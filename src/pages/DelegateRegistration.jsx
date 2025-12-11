
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DelegateRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        college: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, "delegate_single"), {
                ...formData,
                timestamp: serverTimestamp()
            });

            setSubmitted(true);
            // setFormData({ name: '', email: '', phone: '', address: '', college: '' }); // Keep data for ticket display
        } catch (error) {
            console.error("Error registering delegate: ", error);
            if (error.code === 'permission-denied') {
                alert("Registration failed: Permission denied. Please check your Firebase Firestore rules to allow writing to the 'delegate_single' collection.");
            } else {
                alert("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const BASE_API_URL = "https://api.technika.co";

    const handlePayment = async () => {
        setLoading(true);
        const endpoint = `${BASE_API_URL}/book/2399`;
        console.log("Initiating payment to:", endpoint);

        try {
            let headers = {
                "Content-Type": "application/json",
            };

            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    name: String(formData.name),
                    phone: String(formData.phone),
                    callbackUrl: window.location.href // Use current page as callback
                }),
            });

            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Response data:", data);

            if (data.paymentUrl) {
                // Open in new tab to preserve the Ticket View state in the original tab
                window.open(data.paymentUrl, "_blank");
            } else if (data.url) {
                window.open(data.url, "_blank");
            } else {
                alert(`Payment failed: ${data.message || "No payment URL returned"}`);
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Something went wrong. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-black via-[#4a0000] to-black text-white p-8 pt-32 flex flex-col items-center relative overflow-hidden">


            {/* Background Decorative Elements (Consistent with Delegate Page) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[10%] text-white/5 text-9xl font-bold select-none">*</div>
                <div className="absolute bottom-[20%] right-[10%] text-white/5 text-9xl font-bold select-none">✦</div>
            </div>

            <div className="relative z-10 w-full max-w-2xl bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(255,0,0,0.2)]">
                <div className="mb-8 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/delegate')}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-lg text-white transition hover:bg-white/20"
                        aria-label="Back to delegate overview"
                    >
                        ←
                    </button>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-wide drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                        Delegate Registration
                    </h2>
                </div>

                {submitted ? (
                    <div className="w-full max-w-lg bg-black rounded-[30px] border-2 border-white p-8 md:p-10 relative overflow-hidden font-mono shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                        {/* Noise Effect Background */}
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        <div className="relative z-10">
                            {/* Header */}
                            <h2 className="text-3xl text-center mb-10 tracking-widest text-white font-normal uppercase">
                                User Details
                            </h2>

                            {/* Details Grid */}
                            <div className="space-y-6 text-white">
                                {/* Name */}
                                <div className="flex items-center gap-4">
                                    <div className="border border-white px-3 py-1 min-w-[80px] text-sm md:text-base">
                                        Name
                                    </div>
                                    <div className="border-b border-white flex-1 py-1 text-lg">
                                        {formData.name}
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-4">
                                    <div className="border border-white px-3 py-1 min-w-[80px] text-sm md:text-base">
                                        Email
                                    </div>
                                    <div className="border-b border-white flex-1 py-1 truncate text-lg">
                                        {formData.email}
                                    </div>
                                </div>

                                {/* Ph No */}
                                <div className="flex items-center gap-4">
                                    <div className="border border-white px-3 py-1 min-w-[80px] text-sm md:text-base">
                                        Ph No.
                                    </div>
                                    <div className="border-b border-white flex-1 py-1 text-lg w-max inline-block">
                                        {formData.phone}
                                    </div>
                                </div>

                                {/* Inst */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-4">
                                        <div className="border border-white px-3 py-1 min-w-[80px] text-sm md:text-base">
                                            Inst.
                                        </div>
                                        <div className="border-b border-white flex-1 py-1 text-lg leading-tight">
                                            {formData.college}
                                        </div>
                                    </div>
                                </div>

                                {/* Addr */}
                                <div className="flex items-center gap-4">
                                    <div className="border border-white px-3 py-1 min-w-[80px] text-sm md:text-base">
                                        Addr.
                                    </div>
                                    <div className="border-b border-white flex-1 py-1 text-lg truncate">
                                        {formData.address}
                                    </div>
                                </div>
                            </div>

                            {/* Fees */}
                            <div className="mt-12 space-y-2 border-b border-white pb-4">
                                <div className="flex justify-between items-end text-xl md:text-2xl">
                                    <span>Delegate Reg. Fee:</span>
                                    <span>₹699</span>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-between items-end text-xl md:text-2xl font-bold">
                                <span>Total Amount Payable:</span>
                                <span>₹699</span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                                (incl. of convenience fee & GST)
                            </div>

                            {/* Terms */}


                            {/* Pay Button */}
                            <button
                                className="w-full bg-white text-black font-mono text-lg md:text-xl py-4 mt-8 hover:bg-gray-200 transition-colors uppercase font-bold"
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Proceed to Pay"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-gray-200 text-sm font-medium tracking-wide">
                                FULL NAME
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-gray-200 text-sm font-medium tracking-wide">
                                EMAIL ADDRESS
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                                required
                            />
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-gray-200 text-sm font-medium tracking-wide">
                                PHONE NUMBER
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                                required
                            />
                        </div>

                        {/* Address Field */}
                        <div className="space-y-2">
                            <label htmlFor="address" className="block text-gray-200 text-sm font-medium tracking-wide">
                                ADDRESS
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your full address"
                                rows="3"
                                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all resize-none"
                                required
                            ></textarea>
                        </div>

                        {/* College Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="college" className="block text-gray-200 text-sm font-medium tracking-wide">
                                COLLEGE NAME
                            </label>
                            <input
                                type="text"
                                id="college"
                                name="college"
                                value={formData.college}
                                onChange={handleChange}
                                placeholder="Enter your college name"
                                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-white text-black font-bold text-lg py-4 rounded-xl hover:scale-[1.02] transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Registering...' : 'Register Now'}
                            </button>
                        </div>

                    </form>
                )}
            </div>

            <div className="h-20"></div>
        </div>
    );
};

export default DelegateRegistration;
