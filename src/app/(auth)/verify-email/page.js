'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import BackgroundEffect from '@/components/ui/BackgroundEffect';
import { Mail, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { verifyEmail, sendVerificationOtp } = useAuth();
    
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    
    const inputRefs = useRef([]);

    useEffect(() => {
        const emailParam = searchParams.get('email');
        const storedEmail = localStorage.getItem('pendingVerificationEmail');
        setEmail(emailParam || storedEmail || '');
    }, [searchParams]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) {
            value = value.slice(-1);
        }
        
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;
        
        const newOtp = [...otp];
        pastedData.split('').forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtp(newOtp);
        
        const lastIndex = Math.min(pastedData.length - 1, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        setLoading(true);
        const result = await verifyEmail(email, otpString);

        if (result.success) {
            setSuccess('Email verified successfully!');
            setTimeout(() => router.push('/'), 1500);
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;
        
        setResendLoading(true);
        setError('');
        
        const result = await sendVerificationOtp(email);
        
        if (result.success) {
            setSuccess('OTP sent successfully!');
            setCountdown(60);
            setOtp(['', '', '', '', '', '']);
        } else {
            setError(result.error);
        }
        setResendLoading(false);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden px-4 py-12">
            <BackgroundEffect />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#B88E2F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-[#B88E2F]" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#3A3A3A] mb-2">Verify Your Email</h1>
                    <p className="text-[#898989]">
                        We've sent a 6-digit code to<br />
                        <span className="font-medium text-[#3A3A3A]">{email}</span>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 text-sm text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#B88E2F] focus:ring-2 focus:ring-[#B88E2F]/20 transition-all"
                            />
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading || otp.join('').length !== 6}
                        className="w-full bg-[#B88E2F] text-white py-3 rounded-lg font-semibold hover:bg-[#9F7A28] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Verify Email
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </motion.button>

                    <div className="text-center">
                        <p className="text-sm text-[#898989] mb-2">Didn't receive the code?</p>
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={countdown > 0 || resendLoading}
                            className="text-[#B88E2F] font-semibold hover:underline disabled:opacity-50 disabled:no-underline flex items-center justify-center gap-2 mx-auto"
                        >
                            {resendLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
