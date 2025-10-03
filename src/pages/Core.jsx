import ChromaGrid from '../components/ChromaGrid'

// Management Team
const managementTeam = [
  {
    image: "https://i.pravatar.cc/300?img=1",
    title: "Sarah Johnson",
    subtitle: "Chief Executive Officer",
    handle: "@sarahjohnson",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #3B82F6, #000)",
    url: "https://github.com/sarahjohnson"
  },
  {
    image: "https://i.pravatar.cc/300?img=2",
    title: "Mike Chen",
    subtitle: "Chief Technology Officer",
    handle: "@mikechen",
    borderColor: "#10B981",
    gradient: "linear-gradient(180deg, #10B981, #000)",
    url: "https://linkedin.com/in/mikechen"
  },
  {
    image: "https://i.pravatar.cc/300?img=12",
    title: "Emma Davis",
    subtitle: "Chief Operating Officer",
    handle: "@emmadavis",
    borderColor: "#8B5CF6",
    gradient: "linear-gradient(210deg, #8B5CF6, #000)",
    url: "https://linkedin.com/in/emmadavis"
  }
];

// Web Development Team
const webTeam = [
  {
    image: "https://i.pravatar.cc/300?img=3",
    title: "Alex Rivera",
    subtitle: "Lead Frontend Developer",
    handle: "@alexrivera",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(165deg, #F59E0B, #000)",
    url: "https://github.com/alexrivera"
  },
  {
    image: "https://i.pravatar.cc/300?img=4",
    title: "Jordan Blake",
    subtitle: "Backend Developer",
    handle: "@jordanblake",
    borderColor: "#06B6D4",
    gradient: "linear-gradient(135deg, #06B6D4, #000)",
    url: "https://github.com/jordanblake"
  },
  {
    image: "https://i.pravatar.cc/300?img=5",
    title: "Casey Park",
    subtitle: "Full Stack Developer",
    handle: "@caseypark",
    borderColor: "#EF4444",
    gradient: "linear-gradient(195deg, #EF4444, #000)",
    url: "https://github.com/caseypark"
  },
  {
    image: "https://i.pravatar.cc/300?img=15",
    title: "Riley Martinez",
    subtitle: "DevOps Engineer",
    handle: "@rileymartinez",
    borderColor: "#10B981",
    gradient: "linear-gradient(225deg, #10B981, #000)",
    url: "https://github.com/rileymartinez"
  }
];

// Design Team
const designTeam = [
  {
    image: "https://i.pravatar.cc/300?img=6",
    title: "Morgan Lee",
    subtitle: "Creative Director",
    handle: "@morganlee",
    borderColor: "#EC4899",
    gradient: "linear-gradient(145deg, #EC4899, #000)",
    url: "https://behance.net/morganlee"
  },
  {
    image: "https://i.pravatar.cc/300?img=7",
    title: "Taylor Kim",
    subtitle: "UI/UX Designer",
    handle: "@taylorkim",
    borderColor: "#A855F7",
    gradient: "linear-gradient(180deg, #A855F7, #000)",
    url: "https://dribbble.com/taylorkim"
  },
  {
    image: "https://i.pravatar.cc/300?img=9",
    title: "Avery Thompson",
    subtitle: "Graphic Designer",
    handle: "@averythompson",
    borderColor: "#F97316",
    gradient: "linear-gradient(165deg, #F97316, #000)",
    url: "https://dribbble.com/averythompson"
  }
];

// Marketing Team
const marketingTeam = [
  {
    image: "https://i.pravatar.cc/300?img=10",
    title: "Jamie Wilson",
    subtitle: "Marketing Director",
    handle: "@jamiewilson",
    borderColor: "#14B8A6",
    gradient: "linear-gradient(210deg, #14B8A6, #000)",
    url: "https://linkedin.com/in/jamiewilson"
  },
  {
    image: "https://i.pravatar.cc/300?img=11",
    title: "Drew Anderson",
    subtitle: "Content Strategist",
    handle: "@drewanderson",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(195deg, #F59E0B, #000)",
    url: "https://linkedin.com/in/drewanderson"
  }
];

const Core = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="mt-25 pt-5 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Management Team Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Management Team
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              Leadership driving our vision forward
            </p>
            <ChromaGrid 
              items={managementTeam}
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
            />
          </section>

          {/* Web Development Team Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              Web Development Team
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              Building exceptional digital experiences
            </p>
            <ChromaGrid 
              items={webTeam}
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
            />
          </section>

          {/* Design Team Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
              Design Team
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              Crafting beautiful and intuitive interfaces
            </p>
            <ChromaGrid 
              items={designTeam}
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
            />
          </section>

          {/* Marketing Team Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-teal-600 bg-clip-text text-transparent">
              Marketing Team
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              Spreading our message to the world
            </p>
            <ChromaGrid 
              items={marketingTeam}
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
            />
          </section>

        </div>
      </div>
    </div>
  );
}

export default Core