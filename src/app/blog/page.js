import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/nav-bar/nav-bar';
import Footer from '@/components/footer/footer';
import Breadcrumb from '@/components/pages/common/breadcrumb';
import { Calendar, User, Tag } from 'lucide-react';

const blogPosts = [
    {
        id: 1,
        title: '5 Tips for Choosing the Perfect Sofa',
        excerpt: 'Finding the right sofa can transform your living space. Here are our top tips for making the perfect choice...',
        image: '/images/living_room.png',
        author: 'Admin',
        date: 'Dec 7, 2024',
        category: 'Interior Design'
    },
    {
        id: 2,
        title: 'Modern vs. Traditional Furniture: Which is Right for You?',
        excerpt: 'Explore the differences between modern and traditional furniture styles and discover which suits your home best...',
        image: '/images/bedroom.png',
        author: 'Admin',
        date: 'Dec 5, 2024',
        category: 'Style Guide'
    },
    {
        id: 3,
        title: 'How to Care for Your Wooden Furniture',
        excerpt: 'Proper maintenance can keep your wooden furniture looking beautiful for years. Learn the best practices...',
        image: '/images/dining_room.png',
        author: 'Admin',
        date: 'Dec 3, 2024',
        category: 'Maintenance'
    }
];

export default function BlogPage() {
    return (
        <div>


            {/* Hero Section */}
            <div className="bg-[#F9F1E7] py-12">
                <div className="container mx-auto px-4">
                    <Breadcrumb items={[{ label: 'Blog' }]} />
                    <h1 className="text-4xl font-bold text-[#3A3A3A] mt-4">Our Blog</h1>
                    <p className="text-[#898989] mt-2">
                        Tips, trends, and inspiration for your home
                    </p>
                </div>
            </div>

            {/* Blog Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Blog Posts */}
                    <div className="lg:col-span-2 space-y-8">
                        {blogPosts.map((post) => (
                            <article key={post.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                                <div className="relative h-[400px]">
                                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-sm text-[#898989] mb-3">
                                        <div className="flex items-center gap-1">
                                            <User size={16} />
                                            <span>{post.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar size={16} />
                                            <span>{post.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Tag size={16} />
                                            <span>{post.category}</span>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-semibold text-[#3A3A3A] mb-3">{post.title}</h2>
                                    <p className="text-[#898989] mb-4">{post.excerpt}</p>
                                    <Link
                                        href={`/blog/${post.id}`}
                                        className="text-[#B88E2F] font-medium hover:underline"
                                    >
                                        Read More →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
                            <h3 className="text-xl font-semibold text-[#3A3A3A] mb-4">Categories</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/blog?category=interior-design" className="text-[#898989] hover:text-[#B88E2F] transition-colors">
                                        Interior Design
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/blog?category=style-guide" className="text-[#898989] hover:text-[#B88E2F] transition-colors">
                                        Style Guide
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/blog?category=maintenance" className="text-[#898989] hover:text-[#B88E2F] transition-colors">
                                        Maintenance
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="text-xl font-semibold text-[#3A3A3A] mb-4">Recent Posts</h3>
                            <ul className="space-y-4">
                                {blogPosts.slice(0, 3).map((post) => (
                                    <li key={post.id}>
                                        <Link href={`/blog/${post.id}`} className="text-[#898989] hover:text-[#B88E2F] transition-colors text-sm">
                                            {post.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>


        </div>
    );
}
