'use client';

import Link from 'next/link';
import { BlogPost } from '@/data/blogs';
import AnimatedBlock from './AnimatedBlock';

interface BlogCardProps {
  blog: BlogPost;
  index?: number;
}

export default function BlogCard({ blog, index = 0 }: BlogCardProps) {
  const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const readingTime = Math.ceil(blog.excerpt.split(' ').length / 200);

  return (
    <AnimatedBlock delay={index * 100} animationType="fade-slide">
      <article className="bg-white rounded-sm overflow-hidden border border-black border-opacity-10 hover:opacity-80 hover:border-opacity-20 transition-all duration-300 hover:shadow-lg">
        <div className="aspect-video bg-gray-200 mb-0"></div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-black bg-[#F5F5F0] px-3 py-1 rounded-full border border-black border-opacity-10 uppercase tracking-[0.05em]">
              Portfolio News
            </span>
            <span className="text-xs text-black opacity-60">
              {readingTime} min | {formattedDate}
            </span>
          </div>
          <h2 className="text-xl font-normal text-black mb-0 hover:opacity-70 transition-opacity tracking-[-0.01em] leading-tight">
            <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
          </h2>
        </div>
      </article>
    </AnimatedBlock>
  );
}
