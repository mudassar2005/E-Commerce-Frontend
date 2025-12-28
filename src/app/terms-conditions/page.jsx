
import React from 'react';

const TermsConditions = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-10 font-poppins text-gray-800">
            <div className="container mx-auto px-5 md:px-10 max-w-5xl">
                {/* Header Section */}
                <div className="text-center mb-12 animate-in slide-in-from-top duration-500">
                    <h1 className="text-4xl md:text-5xl font-bold font-montserrat bg-gradient-to-r from-[#B88E2F] to-[#d4a574] bg-clip-text text-transparent mb-4">
                        Terms and Conditions
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
                            1. Agreement to Terms
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-justify">
                            By accessing our website <strong>StyleHub</strong>, you agree to be bound by these Terms and Conditions and agree that you are
                            responsible for the agreement with any applicable local laws. If you disagree with any of these terms,
                            you are prohibited from accessing this site.
                        </p>
                    </section>

                    <section className="mb-10 last:mb-0">
                        <h2 className="text-xl md:text-2xl font-bold text-black font-montserrat mb-4 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#B88E2F] rounded-full"></span>
                            2. Use License
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Permission is granted to temporarily download one copy of the materials on StyleHub's website for personal,
                            non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <ul className="space-y-3">
                                {[
                                    "Modify or copy the materials;",
                                    "Use the materials for any commercial purpose or for any public display;",
                                    "Attempt to reverse engineer any software contained on StyleHub's website;",
                                    "Remove any copyright or other proprietary notations from the materials;"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-[#B88E2F] mt-1">•</span>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section className="mb-10 last:mb-0">
                        <h2 className="text-xl md:text-2xl font-bold text-black font-montserrat mb-4 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#B88E2F] rounded-full"></span>
                            3. Disclaimer
                        </h2>
                        <div className="bg-[#B88E2F]/5 p-6 rounded-xl border border-[#B88E2F]/20 border-l-4 border-l-[#B88E2F]">
                            <p className="text-gray-700 italic leading-relaxed">
                                "All the materials on StyleHub’s Website are provided 'as is'. StyleHub makes no warranties, may it be expressed or implied,
                                therefore negates all other warranties. Furthermore, StyleHub does not make any representations concerning the accuracy
                                or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website."
                            </p>
                        </div>
                    </section>

                    <section className="mb-10 last:mb-0">
                        <h2 className="text-xl md:text-2xl font-bold text-black font-montserrat mb-4 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#B88E2F] rounded-full"></span>
                            4. Limitations
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-justify">
                            StyleHub or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use
                            the materials on StyleHub’s Website, even if StyleHub or an authorize representative of this Website has been notified,
                            orally or written, of the possibility of such damage.
                        </p>
                    </section>

                    <section className="mb-6 last:mb-0">
                        <h2 className="text-xl md:text-2xl font-bold text-black font-montserrat mb-4 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#B88E2F] rounded-full"></span>
                            5. Governing Law
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Any claim related to StyleHub's Website shall be governed by the laws of Pakistan without regards to its conflict of law provisions.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
