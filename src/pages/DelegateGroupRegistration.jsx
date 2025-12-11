import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2 } from 'lucide-react';

const DelegateGroupRegistration = () => {
    const navigate = useNavigate();
    const [leader, setLeader] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        college: ''
    });

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleLeaderChange = (e) => {
        setLeader({
            ...leader,
            [e.target.name]: e.target.value
        });
    };

    const addMember = () => {
        setMembers([...members, { name: '', email: '', phone: '' }]);
    };

    const removeMember = (index) => {
        const updatedMembers = members.filter((_, i) => i !== index);
        setMembers(updatedMembers);
    };

    const handleMemberChange = (index, field, value) => {
        const updatedMembers = [...members];
        updatedMembers[index][field] = value;
        setMembers(updatedMembers);
    };

    const totalCount = members.length + 1;
    const paidCount = totalCount - Math.floor(totalCount / 6);
    const totalAmount = paidCount * 699;
    const freeTickets = totalCount - paidCount;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, "delegate_group"), {
                leader,
                members,
                totalAmount,
                totalCount,
                paidCount,
                freeTickets,
                timestamp: serverTimestamp()
            });

            setSubmitted(true);
        } catch (error) {
            console.error("Error registering group: ", error);
            if (error.code === 'permission-denied') {
                alert("Registration failed: Permission denied. Please check your Firebase Firestore rules.");
            } else {
                alert("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const BASE_API_URL = "https://api.technika.co";

    const handlePayment = async () => {
        // Group payment logic - currently placeholder or need specific endpoint
        alert(`Payment for ${paidCount} paid delegates (Total: ${totalCount}, Free: ${freeTickets}) - ₹${totalAmount}. Integration Pending. Please provide Group Event ID.`);

        // Potential implementation if backend supports dynamic amount or specific group ID
        // ...
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#15000d] to-black px-6 pb-24 pt-32 text-white">

            {/* Background Decorative Elements */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-8 left-16 h-72 w-72 rounded-full bg-[#ff0045]/12 blur-[140px]" />
                <div className="absolute bottom-14 right-20 h-72 w-72 rounded-full bg-[#3200ff]/12 blur-[150px]" />
                <div className="absolute top-[18%] right-[12%] text-8xl font-black opacity-[0.06] select-none">✦</div>
                <div className="absolute bottom-[18%] left-[15%] text-7xl font-black opacity-[0.05] select-none">*</div>
            </div>

            <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[30px] border border-white/12 bg-black/55 p-6 md:p-10 shadow-[0_45px_140px_rgba(255,0,48,0.25)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,48,0.2),_transparent_65%)]" />

                <div className="relative mb-8 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/delegate')}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-lg text-white transition hover:bg-white/20"
                        aria-label="Back to delegate overview"
                    >
                        ←
                    </button>
                    <div>
                        <h2 className="text-3xl font-semibold tracking-[0.25em] text-white drop-shadow-[0_0_18px_rgba(255,0,48,0.55)] md:text-4xl">
                            Group Delegate Registration
                        </h2>
                        <p className="mt-2 text-sm font-medium uppercase tracking-[0.3em] text-white/60">
                            organise & manage your team in one place
                        </p>
                    </div>
                </div>

                {submitted ? (
                    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-black/60 p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,48,0.24),_transparent_60%)]" />
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-2xl font-semibold uppercase tracking-[0.35em] text-white/90 md:text-3xl">
                                Registration Submitted
                            </h2>
                            <p className="text-lg text-white/80">
                                Total payable amount • <span className="font-semibold text-[#ff5b6b]">₹{totalAmount}</span>
                            </p>
                            <button
                                className="w-full rounded-full bg-white py-4 text-base font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-white/90"
                                onClick={handlePayment}
                            >
                                Proceed to Pay
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="relative space-y-10">

                        {/* Leader Details */}
                        <div className="space-y-5">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
                                    Team Leader details
                                </h3>
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
                                    Lead contact
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <input type="text" name="name" value={leader.name} onChange={handleLeaderChange} placeholder="Leader name" className="rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40" required />
                                <input type="email" name="email" value={leader.email} onChange={handleLeaderChange} placeholder="Leader email" className="rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40" required />
                                <input type="tel" name="phone" value={leader.phone} onChange={handleLeaderChange} placeholder="Leader phone" className="rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40" required />
                                <input type="text" name="college" value={leader.college} onChange={handleLeaderChange} placeholder="College / Institute" className="rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40" required />
                            </div>
                            <textarea name="address" value={leader.address} onChange={handleLeaderChange} placeholder="Full address" rows="3" className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40 resize-none" required></textarea>
                        </div>

                        {/* Members */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
                                    Team Members
                                </h3>
                                <button type="button" onClick={addMember} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/20">
                                    <Plus className="h-4 w-4" /> Add Member
                                </button>
                            </div>

                            {members.map((member, index) => (
                                <div key={index} className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-12">
                                    <div className="md:col-span-1 text-center font-mono text-sm text-white/50">#{index + 1}</div>
                                    <div className="md:col-span-3">
                                        <input type="text" placeholder="Member name" value={member.name} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40" required />
                                    </div>
                                    <div className="md:col-span-4">
                                        <input type="email" placeholder="Member email" value={member.email} onChange={(e) => handleMemberChange(index, 'email', e.target.value)} className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40" required />
                                    </div>
                                    <div className="md:col-span-3">
                                        <input type="tel" placeholder="Member phone" value={member.phone} onChange={(e) => handleMemberChange(index, 'phone', e.target.value)} className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-white placeholder-white/30 focus:border-[#ff1744] focus:outline-none focus:ring-2 focus:ring-[#ff1744]/40" required />
                                    </div>
                                    <div className="md:col-span-1 text-center">
                                        <button type="button" onClick={() => removeMember(index)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#ff4f61] transition hover:border-[#ff4f61]/60 hover:text-[#ff6f7f]">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {members.length === 0 && <p className="rounded-2xl border border-dashed border-white/15 px-4 py-6 text-center text-sm italic text-white/55">No members added yet — add teammates to unlock the group offer.</p>}
                        </div>

                        {/* Summary */}
                        <div className="grid gap-4 rounded-2xl border border-white/12 bg-white/5 p-5 md:grid-cols-2">
                            <div className="space-y-2 text-sm text-white/70">
                                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                                    <span>Delegates total</span>
                                    <span>{totalCount}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                                    <span>Paid seats</span>
                                    <span>{paidCount}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                                    <span>Complimentary</span>
                                    <span>{freeTickets}</span>
                                </div>
                                {freeTickets > 0 && (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                                        🎉 Offer applied
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col items-end justify-center gap-2 text-right">
                                <span className="text-xs uppercase tracking-[0.35em] text-white/50">Amount payable</span>
                                <span className="text-3xl font-bold text-white">₹{totalAmount}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full rounded-full bg-white py-4 text-lg font-semibold uppercase tracking-[0.3em] text-black transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 ${loading ? 'pointer-events-none opacity-60' : ''}`}
                        >
                            {loading ? 'Submitting...' : 'Register Group'}
                        </button>
                    </form>
                )}
            </div>
            <div className="h-12"></div>
        </div>
    );
};

export default DelegateGroupRegistration;
