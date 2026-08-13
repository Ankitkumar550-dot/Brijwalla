import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Nav from "../components/Nav";
import UserDashboard from "../components/UserDashboard";
import DeliveryBoy from "../components/DeliveryBoy";
import OwnerDashboard from "../components/OwnerDashboard";

// Import all images from the display folder dynamically
const imagesGlob = import.meta.glob('../assets/display/*.{png,jpg,jpeg,webp,svg,gif}', { eager: true, import: 'default' });
const images = Object.values(imagesGlob);
console.log("Dynamically loaded images:", images);

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);



  return (
    <>
      <Nav />
      <div className="w-full px-4 pb-4">
        {/* Container with rounded corners */}
        <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden rounded-3xl">

          {/* Background Images with smooth transition */}
          {images.length > 0 ? (
            images.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
                }`}
              >
                {/* Blurred stretched background to fill empty space */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-50 blur-xl scale-110" 
                  style={{ backgroundImage: `url("${img}")` }}
                ></div>
                {/* Unstretched foreground image to prevent blurriness */}
                <div 
                  className="absolute inset-0 bg-contain bg-center bg-no-repeat drop-shadow-2xl" 
                  style={{ backgroundImage: `url("${img}")` }}
                ></div>
              </div>
            ))
          ) : (
            <div className="absolute inset-0 bg-gray-200"></div>
          )}

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
        {(!userData || userData.role === "user") && <UserDashboard />}
        {userData?.role === "owner" && <OwnerDashboard />}
        {userData?.role === "deliveryBoy" && <DeliveryBoy />}
      </div>
    </>
  );
}

export default Home;