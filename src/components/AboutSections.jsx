// import React from "react";
// import { Fade } from "react-awesome-reveal";

// // About Technika Section
// export const AboutTechnika = () => {
//   return (
//     <div className="relative py-20 px-6" style={{ backgroundColor: "#141414" }}>
//       <div className="max-w-7xl mx-auto">
//         <Fade triggerOnce={true} direction="up" delay={100} duration={800}>
//           <div className="text-center mb-12">
//             <h2 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
//               About Technika
//             </h2>
//             <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-pink-600 mx-auto mb-6"></div>
//           </div>
//         </Fade>

//         <div className="grid md:grid-cols-2 gap-12 items-start">
//           <Fade triggerOnce={true} direction="left" delay={200} duration={800}>
//             <div className="space-y-6">
//               <p className="text-lg text-white leading-relaxed">
//                 Technika is the annual technical festival of Birla Institute of
//                 Technology, Patna, one of the leading technical institutions in
//                 India. It stands as a celebration of innovation, creativity, and
//                 hands-on engineering excellence, bringing together talented
//                 minds from across the country.
//               </p>
//               <p className="text-lg text-white leading-relaxed">
//                 Carrying forward a strong legacy, Technika has evolved into a
//                 dynamic platform where students demonstrate their skills through
//                 a wide range of competitions, workshops, exhibitions, and expert
//                 sessions by industry professionals. From robotics challenges to
//                 coding sprints, from design showcases to entrepreneurship
//                 forums—Technika captures every dimension of technology,
//                 invention, and forward-thinking ideas.
//               </p>
//               <div className="grid grid-cols-3 gap-4 pt-4">
//                 <div
//                   className="text-center p-4 rounded-lg shadow-md"
//                   style={{ backgroundColor: "#f52f2f" }}
//                 >
//                   <div className="text-3xl font-bold text-white">30+</div>
//                   <div className="text-sm text-gray-200 mt-1">Events</div>
//                 </div>
//                 <div
//                   className="text-center p-4 rounded-lg shadow-md"
//                   style={{ backgroundColor: "#f52f6e" }}
//                 >
//                   <div className="text-3xl font-bold text-white">1000+</div>
//                   <div className="text-sm text-gray-200 mt-1">Participants</div>
//                 </div>
//                 <div
//                   className="text-center p-4 rounded-lg shadow-md"
//                   style={{ backgroundColor: "#f52fa3" }}
//                 >
//                   <div className="text-3xl font-bold text-white">10+</div>
//                   <div className="text-sm text-gray-200 mt-1">Colleges</div>
//                 </div>
//               </div>
//             </div>
//           </Fade>

//           <Fade triggerOnce={true} direction="right" delay={300} duration={800}>
//             <div className="relative h-full flex items-center">
//               <div className="w-full">
//                 <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl transform rotate-3"></div>
//                 <img
//                   src="/slideshow/dance2.webp"
//                   alt="Technika Event"
//                   className="relative rounded-2xl shadow-2xl object-cover w-full h-[450px]"
//                 />
//               </div>
//             </div>
//           </Fade>
//         </div>
//       </div>
//     </div>
//   );
// };

// // About BIT Patna Section (Updated)
// export const AboutBitPatna = () => {
//   return (
//     <div className="relative py-20 px-6" style={{ backgroundColor: "#141414" }}>
//       <div className="max-w-7xl mx-auto">
//         <Fade triggerOnce={true} direction="up" delay={100} duration={800}>
//           <div className="text-center mb-12">
//             <h2 className="mt-5 text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
//               About BIT Patna
//             </h2>
//             <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto mb-6"></div>
//           </div>
//         </Fade>

//         <div className="grid md:grid-cols-2 gap-12 items-start">
//           <Fade triggerOnce={true} direction="left" delay={200} duration={800}>
//             <div className="relative h-full flex items-center">
//               <div className="w-full">
//                 <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl transform -rotate-3"></div>
//                 <img
//                   src="/images/bit.jpg"
//                   alt="BIT Patna Campus"
//                   className="relative rounded-2xl shadow-2xl object-cover w-full h-[450px]"
//                 />
//               </div>
//             </div>
//           </Fade>

//           <Fade triggerOnce={true} direction="right" delay={300} duration={800}>
//             <div className="space-y-6">
//               <p className="text-lg text-white leading-relaxed">
//                 Birla Institute of Technology, Patna Campus (BIT Patna) is one
//                 of the extension centers of BIT Mesra, established to foster
//                 quality technical education and innovation in Eastern India.
//                 Located in the historic city of Patna, it carries forward BIT
//                 Mesra’s legacy of excellence and academic rigor.
//               </p>
//               <p className="text-lg text-white leading-relaxed">
//                 The campus offers a dynamic environment with modern
//                 infrastructure, experienced faculty, and a vibrant student
//                 community engaged in cutting-edge research, entrepreneurship,
//                 and cultural activities. BIT Patna emphasizes holistic growth —
//                 nurturing not only technical expertise but also leadership,
//                 creativity, and community values.
//               </p>
//               <div className="grid grid-cols-2 gap-4 pt-4">
//                 <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-l-4 border-orange-600">
//                   <div className="text-xl font-bold text-orange-600 mb-1">
//                     BIT Legacy
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     Rooted in BIT Mesra Excellence
//                   </div>
//                 </div>
//                 <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-l-4 border-red-600">
//                   <div className="text-xl font-bold text-red-600 mb-1">
//                     Modern Campus
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     Innovation & Technical Growth
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Fade>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { AboutBitPatna as AboutPatna };

// // Combined Export Component
// const AboutSections = () => {
//   return (
//     <>
//       <AboutTechnika />
//       <AboutBitPatna />
//     </>
//   );
// };

// export default AboutSections;

import React from "react";
import { Fade } from "react-awesome-reveal";

/* ================= ABOUT TECHNIKA ================= */

export const AboutTechnika = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-black via-[#16060b] to-black px-6 pb-12 pt-12 text-white">
      {/* Ambient background — Timeline style */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 left-10 h-64 w-64 rounded-full bg-[#ff0030]/15 blur-[120px]" />
        <div className="absolute bottom-0 right-16 h-72 w-72 rounded-full bg-[#4100ff]/10 blur-[140px]" />
        <div className="absolute top-[12%] right-[12%] text-8xl font-black opacity-[0.06] select-none">
          TECHNIKA
        </div>
      </div>

      {/* ===== OUTER GLASS CONTAINER ===== */}
      <div className="relative z-10 mx-auto w-full max-w-7xl rounded-[36px] border border-white/12 bg-black/55 p-12 shadow-[0_50px_180px_rgba(255,0,40,0.25)] backdrop-blur-xl">
        <Fade triggerOnce direction="up" duration={800}>
          {/* Header */}
          <div className="mb-20">
            <span className="inline-flex mb-4 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.38em] text-white/70">
              Technika 2K26
            </span>

            <h2 className="text-4xl md:text-5xl font-semibold uppercase tracking-[0.22em]">
              About Technika
            </h2>
          </div>
        </Fade>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Text */}
          <Fade triggerOnce direction="left" duration={800}>
            <div className="space-y-6 text-white/70 leading-relaxed">
              <p>
                Technika is the annual technical festival of Birla Institute of
                Technology, Patna — a celebration of innovation, creativity, and
                hands-on engineering excellence.
              </p>

              <p>
                Over the years, Technika has evolved into a dynamic platform
                where students demonstrate their skills through competitions,
                hackathons, workshops, exhibitions, and expert sessions by
                industry professionals.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pt-6">
                {[
                  { value: "30+", label: "Events" },
                  { value: "1000+", label: "Participants" },
                  { value: "10+", label: "Colleges" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/15 bg-gradient-to-br from-[#ff0030]/20 to-[#4100ff]/20 p-3 md:p-5 text-center backdrop-blur-xl"
                  >
                    <div className="text-base md:text-2xl font-semibold text-white truncate">
                      {item.value}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-widest text-white/50">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Fade>

          {/* Image */}
          <Fade triggerOnce direction="right" duration={800}>
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl">
              <img
                src="/slideshow/dance2.webp"
                alt="Technika Event"
                className="h-[280px] md:h-[420px] w-full object-cover transition duration-700"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,48,0.25),_transparent_65%)]" />
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
};

/* ================= ABOUT BIT PATNA ================= */

export const AboutBitPatna = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black px-6 pb-12 pt-12 text-white">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-[#ff0030]/10 blur-[140px]" />
      </div>

      {/* ===== OUTER GLASS CONTAINER ===== */}
      <div className="relative z-10 mx-auto w-full max-w-7xl rounded-[36px] border border-white/12 bg-black/55 p-6 md:p-12 shadow-[0_50px_180px_rgba(255,0,40,0.25)] backdrop-blur-xl">
        <Fade triggerOnce direction="up" duration={800}>
          <div className="mb-20">
            <span className="inline-flex mb-4 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.38em] text-white/70">
              Institution
            </span>

            <h2 className="text-4xl md:text-5xl font-semibold uppercase tracking-[0.22em]">
              About BIT Patna
            </h2>
          </div>
        </Fade>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Image */}
          <Fade triggerOnce direction="left" duration={800}>
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl">
              <img
                src="/images/bit.jpg"
                alt="BIT Patna Campus"
                className="h-[280px] md:h-[420px] w-full object-cover transition duration-700"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,48,0.25),_transparent_65%)]" />
            </div>
          </Fade>

          {/* Text */}
          <Fade triggerOnce direction="right" duration={800}>
            <div className="space-y-6 text-white/70 leading-relaxed">
              <p>
                Birla Institute of Technology, Patna Campus is an extension of
                BIT Mesra, established to foster quality technical education and
                innovation in Eastern India.
              </p>

              <p>
                The campus provides a modern academic environment with strong
                research culture, experienced faculty, and a vibrant student
                community focused on holistic growth.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-6">
                {[
                  { title: "BIT Legacy", desc: "BIT Mesra Excellence" },
                  { title: "Modern Campus", desc: "Innovation & Growth" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/15 bg-gradient-to-br from-[#ff0030]/20 to-[#4100ff]/20 p-5 backdrop-blur-xl"
                  >
                    <div className="text-sm font-semibold uppercase tracking-wide text-white">
                      {item.title}
                    </div>
                    <div className="mt-2 text-xs text-white/50">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
};
export { AboutBitPatna as AboutPatna };
/* ================= COMBINED EXPORT ================= */

export default function AboutSections() {
  return (
    <>
      <AboutTechnika />
      <AboutBitPatna />
    </>
  );
}
