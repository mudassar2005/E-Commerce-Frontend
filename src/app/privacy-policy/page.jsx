
import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-10 font-poppins text-gray-800">
            <div className="container mx-auto px-5 md:px-10 max-w-5xl">
                {/* Header Section */}
                <div className="text-center mb-12 animate-in slide-in-from-top duration-500">
                    <h1 className="text-4xl md:text-5xl font-bold font-montserrat bg-gradient-to-r from-[#B88E2F] to-[#d4a574] bg-clip-text text-transparent mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 border border-gray-100">
                    <section className="mb-10 last:mb-0">
                        <h2 className="text-xl md:text-2xl font-bold text-black font-montserrat mb-4 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#B88E2F] rounded-full"></span>
                            1. Introduction
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-justify">
                            Welcome to <strong>StyleHub</strong>. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you as to how we look after your personal data when you visit our website
                            and tell you about your privacy rights and how the law protects you..
                        </p>
                    </section>

                    <section className="mb-10 last:mb-0">
                        <h2 className="text-xl md:text-2xl font-bold text-black font-montserrat mb-4 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#B88E2F] rounded-full"></span>
                            2. Data We Collect
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                        </p>
                        <ul className="grid gap-3 pl-2">
                            {[
                                { title: "Identity Data", desc: "Includes first name, last name, username or similar identifier." },
                                { title: "Contact Data", desc: "Includes billing address, delivery email address and telephone numbers." },
                                { title: "Transaction Data", desc: "Includes details about payments to and from you and other details of products you have purchased from us." },
                                { title: "Technical Data", desc: "Includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location." }
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                                    <span className="w-2 h-2 mt-2 bg-[#B88E2F] rounded-full flex-shrink-0"></span>
                                    <span>
                                        <strong className="text-black block mb-1">{item.title}</strong>
                                        <span className="text-gray-500 text-sm">{item.desc}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="mb-10 last:mb-0">
                        <h2 className="text-xl md:text-2xl font-bold text-black font-montserrat mb-4 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#B88E2F] rounded-full"></span>
                            3. How We Use Your Data
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                "Where we need to perform the contract we are about to enter into or have entered into with you.",
                                "Where it is necessary for our legitimate interests and your interests do not override those interests.",
                                "Where we need to comply with a legal or regulatory obligation."
                            ].map((text, i) => (
                                <div key={i} className="bg-[#B88E2F]/5 p-5 rounded-xl border border-[#B88E2F]/20">
                                    <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-6 last:mb-0">
                        <h2 className="text-xl md:text-2xl font-bold text-black font-montserrat mb-4 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#B88E2F] rounded-full"></span>
                            4. Contact Us
                        </h2>
                        <div className="bg-gray-900 text-white p-6 rounded-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="leading-relaxed mb-2 opacity-90">
                                    If you have any questions about this privacy policy or our privacy practices, please contact us at:
                                </p>
                                <div className="mt-4 space-y-2">
                                    <p className="flex items-center gap-3">
                                        <span className="text-[#B88E2F] font-semibold">Email:</span>
                                        <a href="mailto:233000@students.au.edu.pk" className="hover:text-[#B88E2F] transition-colors">233000@students.au.edu.pk</a>
                                    </p>
                                    <p className="flex items-center gap-3">
                                        <span className="text-[#B88E2F] font-semibold">Address:</span>
                                        <span>Air University, Islamabad</span>
                                    </p>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B88E2F] opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
