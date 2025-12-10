
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Delegate = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-black via-[#4a0000] to-black text-white p-8 pt-32 flex flex-col items-center relative overflow-hidden">

            {/* Top Decorative Elements */}
            <div className="flex justify-between w-full max-w-4xl mb-12 opacity-80 max-md:hidden">
                <div className="border border-white/50 rounded-full px-6 py-2 flex items-center gap-4">
                    <span>*</span>
                </div>
                <div className="border border-white/50 rounded-full px-6 py-2 flex items-center gap-4">
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                </div>

                {/* Center Graphic Placeholder */}
                <div className="h-12 w-32 bg-white/10 rounded-full border border-white/30 overflow-hidden flex items-center justify-center">
                    <div className="w-full h-full bg-white opacity-20"></div>
                </div>

                <div className="border border-white/50 rounded-full px-6 py-2 flex items-center gap-4">
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                </div>
                <div className="border border-white/50 rounded-full px-6 py-2 flex items-center gap-4">
                    <span>*</span>
                </div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 leading-relaxed tracking-wider text-white drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                A DELEGATE CARD OFFERS YOU
            </h1>

            {/* List */}
            <div className="text-lg md:text-xl space-y-4 max-w-4xl w-full mb-20 px-4">
                <ul className="list-disc pl-6 space-y-4 text-gray-200">
                    <li className="pl-2">Audience viewership across all events held under Technika, BIT Patna</li>
                    <li className="pl-2">Discounted registration for all Technika events</li>
                    <li className="pl-2">Bus transportation facilities on designated BIT Patna routes</li>
                    <li className="pl-2">Eligibility for in-campus accommodation facilities</li>
                    <li className="pl-2">Free & exclusive entry to all after-party Technika events</li>
                    <li className="pl-2">Free parking facilities for all participant vehicles</li>
                </ul>
            </div>

            {/* Registration Status Box */}
            <div className="mb-12">
                <div className="border-2 border-white px-12 py-4 text-xl md:text-2xl font-bold tracking-wide rounded-2xl hover:bg-white/5 transition-colors cursor-default">
                    Your Registrations
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl justify-center px-4">
                <button
                    onClick={() => navigate('/delegate-registration')}
                    className="bg-white text-black font-semibold text-lg md:text-xl py-4 px-8 rounded-2xl hover:scale-105 transition-transform duration-300 w-full md:w-1/2 text-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    Self Registration
                </button>
                <button className="bg-white text-black font-semibold text-lg md:text-xl py-4 px-8 rounded-2xl hover:scale-105 transition-transform duration-300 w-full md:w-1/2 text-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    Group Registration
                </button>
            </div>

            {/* Bottom spacing */}
            <div className="h-20"></div>
        </div>
    );
};

export default Delegate;
