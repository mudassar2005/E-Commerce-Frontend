'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/context/AlertContext';
import Navbar from '@/components/nav-bar/nav-bar';
import Footer from '@/components/footer/footer';
import Breadcrumb from '@/components/pages/common/breadcrumb';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';

export default function CheckoutPage() {
    const router = useRouter();
    const { showSuccess, showError } = useAlert();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        country: 'Indonesia',
        streetAddress: '',
        city: '',
        province: '',
        zipCode: '',
        phone: '',
        email: '',
        additionalInfo: '',
        paymentMethod: 'cod'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    const handleApplyCoupon = async () => {
        setCouponError('');
        setCouponSuccess('');
        setValidatingCoupon(true);

        try {
            const { data } = await api.post('/coupons/validate', {
                code: couponCode,
                orderAmount: getCartTotal(),
                cartItems: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            });

            setDiscount(data.discountAmount);
            setCouponSuccess(`Coupon applied! You saved Rp ${data.discountAmount.toLocaleString()}`);
        } catch (error) {
            console.error('Coupon validation failed:', error);
            setCouponError(error.response?.data?.message || 'Invalid coupon code');
            setDiscount(0);
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/orders', {
                shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    companyName: formData.companyName,
                    country: formData.country,
                    streetAddress: formData.streetAddress,
                    city: formData.city,
                    province: formData.province,
                    zipCode: formData.zipCode,
                    phone: formData.phone,
                    email: formData.email
                },
                additionalInfo: formData.additionalInfo,
                paymentMethod: formData.paymentMethod,
                couponCode: discount > 0 ? couponCode : null,
                discountAmount: discount
            });
            clearCart();
            router.push('/');
            showSuccess('Order placed successfully!');
        } catch (error) {
            console.error('Order failed:', error);
            showError(error.response?.data?.message || 'Failed to place order. Please make sure you are logged in.');
        }
    };

    const shipping = 0;
    const total = getCartTotal() + shipping;

    if (cartItems.length === 0) {
        return (
            <div>
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-3xl font-bold text-[#3A3A3A] mb-4">Your cart is empty</h1>
                    <p className="text-[#898989] mb-6">Add some products to checkout</p>
                    <a
                        href="/shop"
                        className="inline-block bg-[#B88E2F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#9F7A28] transition-colors"
                    >
                        Go to Shop
                    </a>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />

            {/* Hero Section */}
            <div className="bg-[#F9F1E7] py-12">
                <div className="container mx-auto px-4">
                    <Breadcrumb items={[{ label: 'Checkout' }]} />
                    <h1 className="text-4xl font-bold text-[#3A3A3A] mt-4">Checkout</h1>
                </div>
            </div>

            {/* Checkout Content */}
            <div className="container mx-auto px-4 py-16">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Billing Details */}
                        <div>
                            <h2 className="text-3xl font-semibold text-[#3A3A3A] mb-8">Billing details</h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-base font-medium text-[#3A3A3A] mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-base font-medium text-[#3A3A3A] mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-[#3A3A3A] mb-2">
                                        Company Name (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-[#3A3A3A] mb-2">
                                        Country / Region
                                    </label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                    >
                                        <option value="Indonesia">Indonesia</option>
                                        <option value="Malaysia">Malaysia</option>
                                        <option value="Singapore">Singapore</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-[#3A3A3A] mb-2">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        name="streetAddress"
                                        value={formData.streetAddress}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-[#3A3A3A] mb-2">
                                        Town / City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-[#3A3A3A] mb-2">
                                        Province
                                    </label>
                                    <input
                                        type="text"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-[#3A3A3A] mb-2">
                                        ZIP Code
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-[#3A3A3A] mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-[#3A3A3A] mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-medium text-[#3A3A3A] mb-2">
                                        Additional Information
                                    </label>
                                    <textarea
                                        name="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Notes about your order, e.g. special notes for delivery"
                                        className="w-full px-4 py-3 border border-[#9F9F9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="bg-white p-8 rounded-lg border border-gray-200">
                                <h2 className="text-2xl font-semibold text-[#3A3A3A] mb-6">Product</h2>

                                <div className="space-y-4 mb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between text-[#898989]">
                                            <span>{item.title} × {item.quantity}</span>
                                            <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-4 border-t border-gray-200">
                                    {/* Coupon Section */}
                                    <div className="mb-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="Coupon Code"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#B88E2F] text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleApplyCoupon}
                                                disabled={validatingCoupon || !couponCode}
                                                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                            >
                                                {validatingCoupon ? '...' : 'Apply'}
                                            </button>
                                        </div>
                                        {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                                        {couponSuccess && <p className="text-green-600 text-xs mt-1">{couponSuccess}</p>}
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-base text-[#3A3A3A]">Subtotal</span>
                                        <span className="text-base text-[#3A3A3A]">Rp {getCartTotal().toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between pb-4 border-b border-gray-200">
                                        <span className="text-base text-[#3A3A3A]">Shipping</span>
                                        <span className="text-base text-[#3A3A3A]">Free</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between pb-4 border-b border-gray-200 text-green-600">
                                            <span className="text-base">Discount</span>
                                            <span className="text-base">- Rp {discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-xl font-semibold text-[#3A3A3A]">Total</span>
                                        <span className="text-2xl font-bold text-[#B88E2F]">
                                            Rp {(total - discount).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="space-y-4">
                                        <label className="flex items-start cursor-pointer">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={formData.paymentMethod === 'cod'}
                                                onChange={handleChange}
                                                className="mt-1 w-4 h-4 text-[#B88E2F] border-gray-300 focus:ring-[#B88E2F]"
                                            />
                                            <div className="ml-3">
                                                <span className="block text-base font-medium text-[#3A3A3A]">
                                                    Cash On Delivery
                                                </span>
                                                <p className="text-sm text-[#898989] mt-1">
                                                    Pay with cash when your order is delivered to your doorstep. No advance payment required.
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-8 bg-[#B88E2F] text-white py-4 rounded-lg font-semibold hover:bg-[#9F7A28] transition-colors"
                                >
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
}
