'use client';

import React, { useState } from 'react';
import { useAlert } from '@/context/AlertContext';
import Breadcrumb from '@/components/pages/common/breadcrumb';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
    const { showSuccess } = useAlert();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Contact form submitted:', formData);
        showSuccess('Thank you for contacting us! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const contactInfo = [
        {
            icon: <MapPin size={28} />,
            title: "Visit Us",
            lines: ["Air University,", "Islamabad, Pakistan"]
        },
        {
            icon: <Phone size={28} />,
            title: "Call Us",
            lines: ["Mobile: +92 304 5650316", "Support: +92 300 1234567"]
        },
        {
            icon: <Mail size={28} />,
            title: "Email Us",
            lines: ["233000@students.au.edu.pk", "support@stylehub.com"]
        },
        {
            icon: <Clock size={28} />,
            title: "Working Hours",
            lines: ["Mon-Fri: 9:00 - 22:00", "Sat-Sun: 9:00 - 21:00"]
        }
    ];

    return (
        <div className="bg-white font-poppins text-[#3A3A3A]">

            {/* Hero Section */}
            <div className="relative h-[300px] flex items-center justify-center bg-[#F9F1E7] overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-5">
                    <div className="absolute top-10 right-10 w-96 h-96 bg-[#B88E2F] rounded-full filter blur-[100px]"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Breadcrumb items={[{ label: 'Contact' }]} className="justify-center mb-3" />
                    <h1 className="text-4xl sm:text-5xl font-bold font-montserrat mb-4">Get In Touch</h1>
                    <p className="text-gray-500 max-w-xl mx-auto text-center leading-relaxed">
                        Have a question about our collections or need assistance? We're here to help you style your perfect look.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16 lg:py-24">

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 px-2">
                    {contactInfo.map((info, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300 group text-center">
                            <div className="w-16 h-16 mx-auto bg-[#F9F1E7] rounded-full flex items-center justify-center text-[#B88E2F] mb-6 group-hover:bg-[#B88E2F] group-hover:text-white transition-colors duration-300">
                                {info.icon}
                            </div>
                            <h3 className="text-xl font-bold font-montserrat mb-4">{info.title}</h3>
                            {info.lines.map((line, i) => (
                                <p key={i} className="text-gray-500 text-sm leading-relaxed">{line}</p>
                            ))}
                        </div>
                    ))}
                </div>


                {/* Featured Section: Map & Form */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">

                    {/* Visual Side / Image or Map Placeholder */}
                    <div className="lg:w-1/2 bg-[#B88E2F] p-12 text-white flex flex-col justify-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold font-montserrat mb-6">Let's Talk Fashion</h2>
                            <p className="opacity-90 mb-8 leading-relaxed text-lg">
                                Whether you're interested in a collaboration, have feedback on our latest drops, or just want to say hi, we'd love to hear from you.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <Send size={18} />
                                    </div>
                                    <p className="font-medium">Fast Response within 24 Hours</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <Phone size={18} />
                                    </div>
                                    <p className="font-medium">Dedicated Support Team</p>
                                </div>
                            </div>
                        </div>

                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-5 rounded-full -ml-16 -mb-16"></div>
                    </div>

                    {/* Form Side */}
                    <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16">
                        <h2 className="text-2xl font-bold font-montserrat mb-8 text-[#3A3A3A]">Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/50 focus:border-[#B88E2F] transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/50 focus:border-[#B88E2F] transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="How can we help?"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/50 focus:border-[#B88E2F] transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    placeholder="Tell us more about your inquiry..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/50 focus:border-[#B88E2F] transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#B88E2F] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#9F7A28] transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
