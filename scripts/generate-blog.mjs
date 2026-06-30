// ─── Daily blog generator ─────────────────────────────────────────────────────
// Generates N brand-new blog posts with the Claude API, matching the existing
// posts' voice, structure, length, and on-page SEO, then writes them into the
// single source of truth (src/data/blogs.ts). A push of that change to `main`
// triggers the production deploy and the IndexNow ping (see scripts/indexnow.mjs).
//
// This site serves the SAME blog content under every locale prefix (the
// src/app/[locale]/blog route reads siteConfig.blogs, which is the single
// `blogs` array — there are no per-locale blog translation files), so this
// script generates English posts only and does NOT translate.
//
// Usage:
//   node scripts/generate-blog.mjs              # generate 2 posts, write files
//   node scripts/generate-blog.mjs --count 1    # generate 1 post
//   node scripts/generate-blog.mjs --no-write   # generate + print, write nothing
//
// Env:
//   ANTHROPIC_API_KEY   required — the Claude API key
//   ANTHROPIC_MODEL     optional — defaults to "claude-opus-4-8"
//
// Dependency-free: Node 20+ global fetch, no npm packages (like indexnow.mjs).

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";
const API_KEY = process.env.ANTHROPIC_API_KEY;

const args = process.argv.slice(2);
const COUNT = Number(args[args.indexOf("--count") + 1]) > 0 ? Number(args[args.indexOf("--count") + 1]) : 2;
const NO_WRITE = args.includes("--no-write");

const BLOGS_TS = path.join(ROOT, "src/data/blogs.ts");

// JSON Schema for a single post object. Matches the BlogPost interface in
// src/data/blogs.ts exactly: { slug, title, date, excerpt, content }. The
// `date` is set by this script (today), so the model does not supply it.
const POST_SCHEMA = {
    type: "object",
    properties: {
        slug: { type: "string" },
        title: { type: "string" },
        excerpt: { type: "string" },
        content: { type: "string" },
    },
    required: ["slug", "title", "excerpt", "content"],
};

const POSTS_TOOL = {
    name: "submit_posts",
    description: "Submit the finished blog post objects.",
    input_schema: {
        type: "object",
        properties: { posts: { type: "array", items: POST_SCHEMA } },
        required: ["posts"],
    },
};

// ─── Anthropic Messages API (tool use → structured, valid JSON) ───────────────
// Forces the model to call submit_posts; the API returns input already parsed as
// an object, so there is no manual JSON.parse (and no "bad control character"
// failures from raw newlines in the body).
async function claudePosts(prompt, maxTokens = 16000) {
    if (!API_KEY) throw new Error("ANTHROPIC_API_KEY is not set");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key": API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        body: JSON.stringify({
            model: MODEL,
            max_tokens: maxTokens,
            tools: [POSTS_TOOL],
            tool_choice: { type: "tool", name: "submit_posts" },
            messages: [{ role: "user", content: prompt }],
        }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Anthropic API ${res.status}: ${text.slice(0, 500)}`);
    }
    const data = await res.json();
    const tool = (data.content || []).find((b) => b.type === "tool_use");
    if (!tool || !Array.isArray(tool.input?.posts)) {
        throw new Error(`Model did not return posts (stop_reason: ${data.stop_reason})`);
    }
    return tool.input.posts;
}

// ─── Read the English source of truth out of blogs.ts ─────────────────────────
function extractBlogPosts(src) {
    const anchor = src.indexOf("blogs: BlogPost[] = ");
    if (anchor < 0) throw new Error("Could not locate `blogs` in blogs.ts");
    const arrStart = src.indexOf("[", anchor + "blogs: BlogPost[] = ".length - 1);
    const arrEnd = src.indexOf("];", arrStart);
    if (arrStart < 0 || arrEnd < 0) throw new Error("Could not locate blogs array bounds");
    const arrText = src.slice(arrStart, arrEnd + 1);
    return { posts: JSON.parse(arrText), arrEnd };
}

// ─── Prompts ──────────────────────────────────────────────────────────────────
function generationPrompt(samples, existingSlugs) {
    const sampleBlock = samples.length
        ? `Match the EXISTING posts exactly in voice, depth, structure, length, and on-page SEO. Here are ${samples.length} real examples (study their tone, body length ~1300-1800 words, practical first-person voice, and structure):

${JSON.stringify(samples, null, 2)}`
        : `There are no existing posts yet. Establish a clear, helpful, expert voice. Write practical, specific, first-person craft prose (~1300-1800 words per post).`;

    return `You are a senior writer for IncomeTally, a salary, take-home pay, and income-tax calculator site for employees and freelancers across many countries. Write ${COUNT} brand-new English blog post(s) for the blog.

${sampleBlock}

STRICT REQUIREMENTS for each new post object:
- "slug": short, kebab-case, unique. MUST NOT be any of these existing slugs: ${JSON.stringify(existingSlugs)}
- "title": specific and useful (not clickbait), like the samples.
- "excerpt": 1-2 sentence summary for the blog index card and reading-time estimate.
- "content": full article in GitHub-Flavored Markdown (rendered with react-markdown + remark-gfm) — "## H2" and "### H3" headings, "- " bullet lists, numbered lists, tables where useful, inline **bold**, *italic*, \`code\`, and [text](url) links. Where natural, link to the [salary calculator](/salary-calculator) or [guides](/guides). 1300-1800 words. Do NOT include a top-level H1 (the title renders separately).

Topics should fit IncomeTally: net vs gross pay, tax brackets, take-home pay, freelancing income, payroll deductions, cost-of-living and salary comparisons across countries, financial planning for workers. Pick fresh, non-overlapping topics that are NOT already covered by the existing slugs. Each post must be on a distinct topic.

Call the submit_posts tool with exactly ${COUNT} post object(s).`;
}

// ─── Serialize an English post as a blogs.ts array element (2-space indented) ──
function toTsElement(post) {
    // Field order matches the BlogPost interface for clean diffs.
    const ordered = {
        slug: post.slug,
        title: post.title,
        date: post.date,
        excerpt: post.excerpt,
        content: post.content,
    };
    return JSON.stringify(ordered, null, 2)
        .split("\n")
        .map((line) => "  " + line)
        .join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    const src = await readFile(BLOGS_TS, "utf8");
    const { posts: english } = extractBlogPosts(src);
    const existingSlugs = english.map((p) => p.slug);

    // Up to two recent posts as the style reference (trim if huge).
    const samples = english.slice(-2);

    console.log(`→ Generating ${COUNT} new English post(s) with ${MODEL}…`);
    const generated = await claudePosts(generationPrompt(samples, existingSlugs));

    const today = new Date().toISOString().slice(0, 10);
    const seen = new Set(existingSlugs);
    const newPosts = [];
    for (const p of Array.isArray(generated) ? generated : [generated]) {
        if (!p || !p.slug || !p.content) { console.warn("  ⚠ skipping malformed post", p?.slug); continue; }
        if (seen.has(p.slug)) { console.warn(`  ⚠ duplicate slug "${p.slug}" — skipping`); continue; }
        seen.add(p.slug);
        newPosts.push({ ...p, date: today });
    }
    if (!newPosts.length) throw new Error("Model returned no usable new posts");
    console.log(`  ✓ ${newPosts.length} post(s): ${newPosts.map((p) => p.slug).join(", ")}`);

    if (NO_WRITE) {
        console.log("\n--no-write: nothing written. Generated English posts:\n");
        console.log(JSON.stringify(newPosts, null, 2));
        return;
    }

    // Write English into blogs.ts (insert before the array close `];`).
    const freshSrc = await readFile(BLOGS_TS, "utf8");
    const anchor = freshSrc.indexOf("blogs: BlogPost[] = ");
    if (anchor < 0) throw new Error("Could not locate `blogs` in blogs.ts");
    const arrStart = freshSrc.indexOf("[", anchor);
    const closeAt = freshSrc.indexOf("];", arrStart);
    if (closeAt < 0) throw new Error("Could not locate blogs array close `];`");

    // Is the array currently empty (only whitespace between `[` and `]`)?
    const inner = freshSrc.slice(arrStart + 1, closeAt);
    const isEmpty = inner.trim() === "";
    const tsBlock = newPosts.map(toTsElement).join(",\n");

    let newSrc;
    if (isEmpty) {
        // Replace `[]`/`[ ]` with a populated, multi-line array.
        newSrc = freshSrc.slice(0, arrStart) + "[\n" + tsBlock + ",\n]" + freshSrc.slice(closeAt + 1);
    } else {
        // Append after the last existing element, before `];`.
        newSrc = freshSrc.slice(0, closeAt) + tsBlock + ",\n" + freshSrc.slice(closeAt);
    }
    await writeFile(BLOGS_TS, newSrc);
    console.log(`  ✓ wrote ${newPosts.length} post(s) to src/data/blogs.ts`);

    console.log("\n✅ Done.");
}

main().catch((err) => {
    console.error("❌", err.message);
    process.exit(1);
});
