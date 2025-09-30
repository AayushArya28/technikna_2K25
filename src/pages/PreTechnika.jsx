import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

export default function MithilaTourism() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      {/* Main Content */}
      <main className="pt-24 px-6 max-w-7xl mx-auto pb-16">
        {/* Hero Section */}
        <div className="mb-12">
          <p className="text-sm tracking-wider text-gray-500 mb-6">Featured Destination</p>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
            <h1 className="text-5xl lg:text-6xl font-light leading-tight">
              Mithila - the<br />
              Palette of Traditions
            </h1>
            <a href="#" className="inline-flex items-center text-sm tracking-wider text-gray-600 hover:gap-3 transition-all group self-start lg:self-center">
              <span>View All Destination</span>
              <span className="ml-2 group-hover:ml-4 transition-all">→</span>
            </a>
          </div>
        </div>

        {/* Image Grid - Properly Aligned */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 - Sacred Stones */}
          <div className="group cursor-pointer flex flex-col">
            <div className="relative overflow-hidden mb-4 bg-gray-200" style={{ aspectRatio: '4/3' }}>
              <img 
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80" 
                alt="Historic temple architecture"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-base font-light tracking-wide text-gray-700">Touch the Sacred Stones</h3>
          </div>

          {/* Card 2 - Local Delicacies */}
          <div className="group cursor-pointer flex flex-col">
            <div className="relative overflow-hidden mb-4 bg-gradient-to-br from-red-950 to-black" style={{ aspectRatio: '4/3' }}>
              <img 
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80" 
                alt="Traditional local delicacies"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-base font-light tracking-wide text-gray-700">Indulge in the Local Delicacies</h3>
          </div>

          {/* Card 3 - Artistic Spirit */}
          <div className="group cursor-pointer flex flex-col">
            <div className="relative overflow-hidden mb-4 bg-amber-100" style={{ aspectRatio: '4/3' }}>
              <img 
                src="https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800&q=80" 
                alt="Traditional Madhubani art"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-base font-light tracking-wide text-gray-700">Feel the Artistic Spirit</h3>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 flex justify-center">
          <button className="px-8 py-3 bg-gray-800 text-white text-sm tracking-wider hover:bg-gray-700 transition-colors">
            EXPLORE MORE
          </button>
        </div>
      </main>
    </div>
  );
}