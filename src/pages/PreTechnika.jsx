import React from "react";

function FeaturedDestination() {
  return (
    <section className="bg-[#f7f4ef] px-10 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* Left Heading Section */}
        <div className="lg:col-span-1 space-y-6">
          <p className="text-sm tracking-wide text-gray-700">
            Featured Destination
          </p>

          <h2 className="text-5xl md:text-6xl font-serif leading-tight">
            Mithila – the <br /> Palette of Traditions
          </h2>

          <a
            href="#"
            className="inline-block text-gray-700 italic font-medium hover:underline"
          >
            View All Destination →
          </a>
        </div>

        {/* Middle Image Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div>
            <img
              src="/images/mithila-temple.jpg"
              alt="Temple"
              className="w-full h-64 object-cover"
            />
            <p className="mt-2 text-sm text-gray-700">
              Touch the Sacred Stones
            </p>
          </div>

          {/* Card 2 */}
          <div>
            <img
              src="/images/mithila-food.jpg"
              alt="Food"
              className="w-full h-64 object-cover"
            />
            <p className="mt-2 text-sm text-gray-700">
              Indulge in the Local Delicacies
            </p>
          </div>

          {/* Card 3 */}
          <div>
            <img
              src="/images/mithila-art.jpg"
              alt="Mithila Art"
              className="w-full h-64 object-cover"
            />
            <p className="mt-2 text-sm text-gray-700">
              Feel the Artistic Spirit
            </p>
          </div>
        </div>

        {/* Right Description */}
        <div className="lg:col-span-1 space-y-10 text-sm text-gray-700 leading-relaxed">
          <p>
            Discover Mithila, where centuries-old art traditions like Madhubani
            paintings blend seamlessly with lively cultural festivals and
            historical sites. Experience the region's rich cultural heritage and
            gain insight into its enduring artistic practices and local customs.
          </p>
          <p>
            Take a closer look at our diverse districts, where every place has a
            unique tale to share. From historical sites to vibrant communities,
            explore what makes each district truly special.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaturedDestination;