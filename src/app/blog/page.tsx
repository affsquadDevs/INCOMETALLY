'use client';

import { siteConfig } from '@/config/site';
import BlogCard from '@/components/BlogCard';
import AnimatedBlock from '@/components/AnimatedBlock';
import Link from 'next/link';

export default function BlogList() {
  const { blogs, aboutUs } = siteConfig;

  return (
    <div className="bg-[#F5F5F0] min-h-screen pt-16">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-12 py-12 lg:py-16">
        <AnimatedBlock delay={0} animationType="fade-slide">
          <div className="mb-16 lg:mb-20">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-normal text-black mb-8 lg:mb-12 tracking-[-0.02em]">
              Blog
            </h1>
          </div>
        </AnimatedBlock>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* About Us Card */}
          <AnimatedBlock delay={0} animationType="fade-slide">
            <Link href="/about-us">
              <article className="bg-white rounded-sm overflow-hidden border border-black border-opacity-10 hover:opacity-80 hover:border-opacity-20 transition-all duration-300 hover:shadow-lg h-full flex flex-col cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-[#0066FF] to-[#0044CC] flex items-center justify-center">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs text-black bg-[#F5F5F0] px-3 py-1 rounded-full border border-black border-opacity-10 uppercase tracking-[0.05em]">
                      About
                    </span>
                    <span className="text-xs text-black opacity-60">
                      Last updated: {aboutUs.lastUpdated}
                    </span>
                  </div>
                  <h2 className="text-xl font-normal text-black hover:opacity-70 transition-opacity tracking-[-0.01em] leading-tight">
                    {aboutUs.title}
                  </h2>
                  <p className="text-sm text-black opacity-60 mt-3 leading-relaxed line-clamp-3">
                    {aboutUs.content.split('\n')[0]}
                  </p>
                </div>
              </article>
            </Link>
          </AnimatedBlock>

          {/* Blog Posts */}
          {blogs.map((blog, index) => (
            <BlogCard key={blog.slug} blog={blog} index={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
