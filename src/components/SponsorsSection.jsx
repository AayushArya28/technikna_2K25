import React from 'react';

const partnerGrid = [
  { name: "Jio Saavn", icon: "https://i.ibb.co/0y3ph0Vh/1.png" },
  { name: "CERAMIC Junction", icon: "https://i.ibb.co/Q39SzLVv/2.png" },
  { name: "Bank of Baroda", icon: "https://i.ibb.co/6RD2V7K8/3.png", label: "Official Partner", sub: "Official Banking Partner" },
  { name: "VENUS STAR", icon: "https://i.ibb.co/tMrhNJ0R/4.png" },
  { name: "BSEDCL", icon: "https://i.ibb.co/27X3GXL4/5.png" },
  { name: "GAIL", icon: "https://i.ibb.co/bMqpwbPQ/6.png" },
  { name: "hii", icon: "https://i.ibb.co/pBXb1nch/7.png" },
  { name: "NSMCH", icon: "https://i.ibb.co/rGkSQvb0/8.png" },
  { name: "Plum Body lovin'", icon: "https://i.ibb.co/HTvrvPj4/9.png" },
  { name: "DKMS", icon: "https://i.ibb.co/tPkXCw4G/10.png" },
  { name: "Maa construction", icon: "https://i.ibb.co/wFkQvNFH/11.png" },
  { name: "Sudha", icon: "https://i.ibb.co/hJSggBBd/12.png" },
  { name: "Innovadores", icon: "https://i.ibb.co/DHvJdRCk/13.png" },
  { name: "HORIZON", icon: "https://i.ibb.co/gLXP16cW/14.png" },
  { name: "G.C", icon: "https://i.ibb.co/R49yfmT9/15.png" },
  { name: "LIC", icon: "https://i.ibb.co/QBB819K/16.png" },
  { name: "Dainik jagran", icon: "https://i.ibb.co/0yGW5hyN/17.png" },
  { name: "event om", icon: "https://i.ibb.co/fgYsVvg/18.png" },
  { name: "SHRIMATE EVENT PLANNERS", icon: "https://i.ibb.co/CK0JYvxY/19.png" },
  { name: "New Sponsor", icon: "https://i.ibb.co/8D9xFzd3/20.png" },
];

const Sponsors = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans relative overflow-hidden">
      {/* Background Homogenous Glow 
          Matches the atmospheric red/black glow from BIT Patna image.
      */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at center top, #450a0a 0%, transparent 70%)'
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Title Section matching 'About BIT Patna' typography */}
        <div className="text-center mb-16">
          <p className="text-gray-500 text-[10px] tracking-[0.5em] font-bold uppercase mb-4">
            Collaborating with the best
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase">
            Technika <span className="text-red-700">2K25</span>
          </h1>
        </div>

        {/* Tier 1: Powered By - Standalone Hierarchy */}
        <div className="mb-14 flex flex-col items-center">
          <h3 className="text-white/40 text-[10px] font-bold tracking-[0.5em] uppercase mb-6">
            — Powered By —
          </h3>
          <div className="w-full md:w-1/3 py-10 px-12 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl flex flex-col items-center group hover:bg-white/[0.07] transition-all duration-300 shadow-2xl">
            <span className="text-white text-2xl font-black tracking-tight group-hover:scale-105 transition-transform uppercase text-center">
              Bank of Baroda
            </span>
            <span className="text-white/40 text-[9px] mt-2 uppercase tracking-[0.2em] font-semibold">
              Official Banking Partner
            </span>
          </div>
        </div>

        {/* Tier 2: Homogenous Grid System */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-l border-t border-white/10 rounded-sm overflow-hidden bg-white/[0.01]">
          {partnerGrid.map((partner, index) => (
            <div 
              key={index}
              className="relative group flex flex-col items-center justify-center h-32 md:h-40 p-6 border-r border-b border-white/10 hover:bg-white/[0.05] transition-all duration-300"
            >
              {/* Badge for Flying Lemur */}
              {partner.label && (
                <span className="absolute top-2 left-2 bg-blue-700 text-[8px] font-bold px-1.5 py-0.5 rounded text-white uppercase">
                  {partner.label}
                </span>
              )}
              {partner.icon && (
                <div className="flex items-center justify-center w-full h-full">
                  <img
                    src={partner.icon}
                    alt={partner.name}
                    className="object-contain"
                    style={{ width: '200%', height: '250%', maxWidth: '300px', maxHeight: '300px', margin: '0 auto' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
              {/* Only show logo, not name */}
              {partner.sub && (
                <span className="text-white/30 text-[8px] mt-1 text-center leading-tight uppercase tracking-widest">
                  {partner.sub}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sponsors;