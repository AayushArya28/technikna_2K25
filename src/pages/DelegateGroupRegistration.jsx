import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, Plus, Trash2 } from 'lucide-react';

const DelegateGroupRegistration = () => {
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
        <div className="min-h-screen w-full bg-gradient-to-b from-black via-[#4a0000] to-black text-white p-8 pt-32 flex flex-col items-center relative overflow-hidden">

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[10%] text-white/5 text-9xl font-bold select-none">*</div>
                <div className="absolute bottom-[20%] right-[10%] text-white/5 text-9xl font-bold select-none">✦</div>
            </div>

            <div className="relative z-10 w-full max-w-3xl bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(255,0,0,0.2)]">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 tracking-wide drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                    Group Delegate Registration
                </h2>

                {submitted ? (
                    <div className="w-full bg-black rounded-[30px] border-2 border-white p-8 md:p-10 relative overflow-hidden font-mono shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <div className="relative z-10 text-center">
                            <h2 className="text-3xl mb-6 tracking-widest text-white font-normal uppercase">Registration Submitted</h2>
                            <p className="mb-6">Total Payable: ₹{totalAmount}</p>
                            <button
                                className="w-full bg-white text-black font-mono text-lg md:text-xl py-4 hover:bg-gray-200 transition-colors uppercase font-bold"
                                onClick={handlePayment}
                            >
                                Proceed to Pay
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Leader Details */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-red-400 border-b border-white/20 pb-2">Team Leader Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" name="name" value={leader.name} onChange={handleLeaderChange} placeholder="Leader Name" className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none" required />
                                <input type="email" name="email" value={leader.email} onChange={handleLeaderChange} placeholder="Leader Email" className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none" required />
                                <input type="tel" name="phone" value={leader.phone} onChange={handleLeaderChange} placeholder="Leader Phone" className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none" required />
                                <input type="text" name="college" value={leader.college} onChange={handleLeaderChange} placeholder="College / Inst." className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none" required />
                            </div>
                            <textarea name="address" value={leader.address} onChange={handleLeaderChange} placeholder="Full Address" rows="2" className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none resize-none" required></textarea>
                        </div>

                        {/* Members */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/20 pb-2">
                                <h3 className="text-xl font-bold text-red-400">Team Members</h3>
                                <button type="button" onClick={addMember} className="flex items-center text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors">
                                    <Plus className="w-4 h-4 mr-1" /> Add Member
                                </button>
                            </div>

                            {members.map((member, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-white/5 p-4 rounded-xl">
                                    <div className="md:col-span-1 text-center font-mono text-gray-400">#{index + 1}</div>
                                    <div className="md:col-span-3">
                                        <input type="text" placeholder="Name" value={member.name} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} className="w-full bg-transparent border-b border-white/20 px-2 py-1 text-white focus:border-red-500 outline-none" required />
                                    </div>
                                    <div className="md:col-span-4">
                                        <input type="email" placeholder="Email" value={member.email} onChange={(e) => handleMemberChange(index, 'email', e.target.value)} className="w-full bg-transparent border-b border-white/20 px-2 py-1 text-white focus:border-red-500 outline-none" required />
                                    </div>
                                    <div className="md:col-span-3">
                                        <input type="tel" placeholder="Phone" value={member.phone} onChange={(e) => handleMemberChange(index, 'phone', e.target.value)} className="w-full bg-transparent border-b border-white/20 px-2 py-1 text-white focus:border-red-500 outline-none" required />
                                    </div>
                                    <div className="md:col-span-1 text-center">
                                        <button type="button" onClick={() => removeMember(index)} className="text-red-400 hover:text-red-300">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {members.length === 0 && <p className="text-gray-400 text-center italic py-4">No members added yet (Registering as Individual Leader only).</p>}
                        </div>

                        {/* Summary */}
                        <div className="border-t border-white/20 pt-4 flex justify-between items-end">
                            <div className="text-sm text-gray-400">
                                Total Delegates: {totalCount} <br />
                                (Offer: Buy 5 Get 1 Free)
                                {freeTickets > 0 && <span className="text-emerald-400 block font-bold mt-1">🎉 {freeTickets} Free Ticket(s) Applied</span>}
                            </div>
                            <div className="text-3xl font-bold">₹{totalAmount}</div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-white text-black font-bold text-lg py-4 rounded-xl hover:scale-[1.02] transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Submitting...' : 'Register Group'}
                        </button>
                    </form>
                )}
            </div>
            <div className="h-20"></div>
        </div>
    );
};

export default DelegateGroupRegistration;
