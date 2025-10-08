import React from 'react';
import { Fade } from 'react-awesome-reveal';

// About Technika Section
export const AboutTechnika = () => {
  return (
    <div className="relative py-20 px-6" style={{ backgroundColor: '#f1e4dc' }}>
      <div className="max-w-7xl mx-auto">
        <Fade triggerOnce={true} direction="up" delay={100} duration={800}>
          <div className="text-center mb-12">
            <h2 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              About Technika
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6"></div>
          </div>
        </Fade>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Fade triggerOnce={true} direction="left" delay={200} duration={800}>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Technika is the annual technical festival of the National Institute of Technology Patna, 
                one of the most prestigious technical institutions in India. It is a celebration of 
                innovation, creativity, and technical excellence that brings together brilliant minds 
                from across the nation.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                With a legacy spanning years, Technika has become a platform where students showcase 
                their technical prowess through competitions, workshops, exhibitions, and guest lectures 
                by industry leaders. From robotics to coding marathons, from design challenges to 
                entrepreneurship summits, Technika encompasses every facet of technology and innovation.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 rounded-lg shadow-md" style={{ backgroundColor: '#ffffff' }}>
                  <div className="text-3xl font-bold text-purple-600">50+</div>
                  <div className="text-sm text-gray-600 mt-1">Events</div>
                </div>
                <div className="text-center p-4 rounded-lg shadow-md" style={{ backgroundColor: '#ffffff' }}>
                  <div className="text-3xl font-bold text-blue-600">10K+</div>
                  <div className="text-sm text-gray-600 mt-1">Participants</div>
                </div>
                <div className="text-center p-4 rounded-lg shadow-md" style={{ backgroundColor: '#ffffff' }}>
                  <div className="text-3xl font-bold text-purple-600">100+</div>
                  <div className="text-sm text-gray-600 mt-1">Colleges</div>
                </div>
              </div>
            </div>
          </Fade>

          <Fade triggerOnce={true} direction="right" delay={300} duration={800}>
            <div className="relative h-full flex items-center">
              <div className="w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl transform rotate-3"></div>
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=3870&auto=format&fit=crop"
                  alt="Technika Event"
                  className="relative rounded-2xl shadow-2xl object-cover w-full h-[450px]"
                />
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
};

// About BIT Patna Section (Updated)
export const AboutBitPatna = () => {
  return (
    <div className="relative py-20 px-6" style={{ backgroundColor: '#f1e4dc' }}>
      <div className="max-w-7xl mx-auto">
        <Fade triggerOnce={true} direction="up" delay={100} duration={800}>
          <div className="text-center mb-12">
            <h2 className="mt-5 text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              About BIT Patna
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto mb-6"></div>
          </div>
        </Fade>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Fade triggerOnce={true} direction="left" delay={200} duration={800}>
            <div className="relative h-full flex items-center">
              <div className="w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl transform -rotate-3"></div>
                <img
                  src="https://images.unsplash.com/photo-1609920658906-8223bd289001?q=80&w=3870&auto=format&fit=crop"
                  alt="BIT Patna Campus"
                  className="relative rounded-2xl shadow-2xl object-cover w-full h-[450px]"
                />
              </div>
            </div>
          </Fade>

          <Fade triggerOnce={true} direction="right" delay={300} duration={800}>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Birla Institute of Technology, Patna Campus (BIT Patna) is one of the extension centers of BIT Mesra, 
                established to foster quality technical education and innovation in Eastern India. Located in the 
                historic city of Patna, it carries forward BIT Mesra’s legacy of excellence and academic rigor.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                The campus offers a dynamic environment with modern infrastructure, experienced faculty, and a 
                vibrant student community engaged in cutting-edge research, entrepreneurship, and cultural activities. 
                BIT Patna emphasizes holistic growth — nurturing not only technical expertise but also leadership, 
                creativity, and community values.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-l-4 border-orange-600">
                  <div className="text-xl font-bold text-orange-600 mb-1">BIT Legacy</div>
                  <div className="text-sm text-gray-600">Rooted in BIT Mesra Excellence</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-l-4 border-red-600">
                  <div className="text-xl font-bold text-red-600 mb-1">Modern Campus</div>
                  <div className="text-sm text-gray-600">Innovation & Technical Growth</div>
                </div>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
};

export { AboutBitPatna as AboutPatna };

// Combined Export Component
const AboutSections = () => {
  return (
    <>
      <AboutTechnika />
      <AboutBitPatna />
    </>
  );
};

export default AboutSections;
