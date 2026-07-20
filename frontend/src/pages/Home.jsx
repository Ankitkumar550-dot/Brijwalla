import React from "react";
import { useSelector } from "react-redux";
import Nav from "../components/Nav";
import UserDashboard from "../components/UserDashboard";
import DeliveryBoy from "../components/DeliveryBoy";
import OwnerDashboard from "../components/OwnerDashboard";
import lordKrishnaImg from "../assets/lordkrishna.png";

function Home() {
  const { userData } = useSelector((state) => state.user);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Nav />
      <div className="w-full px-4 pb-4">
        {/* Container with rounded corners */}
        <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden rounded-3xl">

          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${lordKrishnaImg})` }}
          ></div>

          {/* Light Black Gradient Overlay on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

          {/* Text Content */}
          <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 max-w-3xl text-white">

            {/* Cursive Subtitle */}
            <h2
              className="text-3xl md:text-4xl mb-3"
              style={{ fontFamily: "'Great Vibes', cursive", letterSpacing: "1px" }}
            >
              Welcome to Brijwala Sweets
            </h2>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 font-serif uppercase tracking-widest text-shadow-sm">
              The Finest Sweets
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base leading-relaxed mb-8 opacity-95 max-w-lg font-light tracking-wide">
              Indulge in the finest sweets crafted with love and the
              finest ingredients. From classic favorites to delightful
              treats, every bite is pure bliss! Experience the joy of our
              gourmet creations!
            </p>

            {/* Button */}
            <div>
              <button className="bg-[#780d3b] hover:bg-[#5c082c] text-white text-sm md:text-base font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg">
                Shop Our Special
              </button>
            </div>

          </div>
        </div>
      </div>
      <div className="w-screen min-h-screen flex flex-col items-center bg-[#fff9f6]">
        {userData.role === "user" && <UserDashboard />}
        {userData.role === "owner" && <OwnerDashboard />}
        {userData.role === "deliveryBoy" && <DeliveryBoy />}
      </div>
    </>
  );
}

export default Home;