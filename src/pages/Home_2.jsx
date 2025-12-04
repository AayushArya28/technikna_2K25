import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <section
        className="h-screen w-full bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: "url('/images/bg.jpg')" }}
      >
        <span>
          <h1 className="text-6xl md:text-8xl text-white font-extrabold drop-shadow-lg">
            TECHNIKA &nbsp;
          </h1>
        </span>
        <span>
          <h1 className="text-6xl md:text-8xl text-white font-serif drop-shadow-lg">
            <b>2</b>
          </h1>
        </span>
        <span>
          <h1 className="text-6xl md:text-8xl text-white font-extrabold drop-shadow-lg">
            K
          </h1>
        </span>
        <span>
          <h1 className="text-6xl md:text-8xl text-white font-serif drop-shadow-lg">
            <b>25</b>
          </h1>
        </span>

        {/* REGISTER Button */}
        <Link
          to="/login"
          className="absolute bottom-7 right-6 flex items-center justify-center group"
        >
          {/* Mobile Image */}
          <div className="relative block md:hidden w-56">
            <img
              src="https://www.bits-oasis.org/svgs/landing/mobileRegisterBtn.svg"
              alt="Register"
              className="w-full transition duration-300 group-hover:brightness-75"
            />
            <span className="absolute inset-0 flex items-center justify-center text-yellow-400 font-bold text-lg pointer-events-none">
              REGISTER
            </span>
          </div>

          {/* Desktop Image */}
          <div className="relative hidden md:block w-96">
            <img
              src="https://www.bits-oasis.org/svgs/landing/registerBtn.svg"
              alt="Register"
              className="w-full transition duration-300 group-hover:brightness-75"
            />
            <span className="mb-4 absolute inset-0 flex items-center justify-center text-white font-bold text-4xl pointer-events-none">
              REGISTER
            </span>
          </div>
        </Link>
      </section>

      <section
        className="h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/bg.jpg')" }}
      >
        <h1 className="text-6xl md:text-8xl text-white font-extrabold drop-shadow-lg">
          TECHNIKA 2K26
        </h1>
      </section>
    </>
  );
}

export default Home;
