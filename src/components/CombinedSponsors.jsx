import React from "react";

const partnerGrid = [
  { name: "Bank of Baroda", label: "Official Partner", sub: "Official Banking Partner" },
  { name: "Jio Saavn" },
  { name: "CERAMIC Junction" },
  { name: "BSEDCL" },
  { name: "VENUS STAR" },
  { name: "GAIL" },
  { name: "NSMCH" },
  { name: "Plum Body lovin'" },
  { name: "DKMS" },
  { name: "Maa construction" },
  { name: "Sudha" },
  { name: "SHRIMATE EVENT PLANNERS" },
  { name: "New Sponsor" },
];

const CombinedSponsors = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans relative overflow-hidden">
      {/* Background Homogenous Glow (Pic 2 style) */}
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

        {/* Powered By - Independent Hierarchy (Pic 1 fix) */}
        <div className="mb-14 flex flex-col items-center">
          <h3 className="text-white/40 text-[10px] font-bold tracking-[0.5em] uppercase mb-6">
            — Powered By —
          </h3>
          <div className="w-full md:w-1/3 py-10 px-12 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl flex flex-col items-center group hover:bg-white/[0.07] transition-all duration-300 shadow-2xl">
            <span className="text-white text-2xl font-black tracking-tight group-hover:scale-105 transition-transform uppercase">
              Bank of Baroda
            </span>
            <span className="text-white/40 text-[9px] mt-2 uppercase tracking-[0.2em] font-semibold">
              Official Banking Partner
            </span>
          </div>
        </div>

        {/* Homogenous Grid (Pic 3 layout) */}
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
              
              <span className="text-white text-center font-bold text-sm md:text-lg tracking-tight group-hover:scale-110 transition-transform">
                {partner.name}
              </span>
              
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

export default CombinedSponsors;