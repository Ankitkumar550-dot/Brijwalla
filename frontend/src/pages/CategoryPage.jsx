import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUtensils } from "react-icons/fa";
import Nav from "../components/Nav";
import MithaiCard from "../components/MithaiCard";
import ProductDetailsModal from "../components/ProductDetailsModal";
import AiBot from "../components/AiBot";
import axios from "axios";
import { serverUrl } from "../App";

// Map display friendly names and descriptions
const getCategoryMetadata = (categoryName) => {
  const name = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  switch (name.toLowerCase()) {
    case "pedha":
      return { displayName: "Authentic Pedha", desc: "Rich and creamy traditional milk fudge infused with cardamom and saffron.", color: "from-amber-500 to-orange-600" };
    case "laddoo":
      return { displayName: "Delightful Laddoos", desc: "Golden sweet spheres crafted with pure ghee, roasted gram flour, and dry fruits.", color: "from-yellow-400 to-amber-600" };
    case "barfi":
      return { displayName: "Premium Barfi & Katli", desc: "Delectable milk-based barfis decorated with edible silver leaf.", color: "from-rose-400 to-pink-600" };
    case "rasgulla":
      return { displayName: "Spongy Rasgullas", desc: "Soft, juicy cottage cheese dumplings soaked in aromatic sugar syrup.", color: "from-teal-400 to-cyan-600" };
    case "gulabjamun":
      return { displayName: "Warm Gulab Jamuns", desc: "Deep-fried milk dumplings soaked in a warm, sweet rosewater syrup.", color: "from-red-500 to-rose-700" };
    case "rasmalai":
      return { displayName: "Royal Rasmalai", desc: "Soft paneer patties floating in sweetened, cardamom-flavored rich milk cream.", color: "from-yellow-400 to-emerald-500" };
    case "kaju katli":
      return { displayName: "Premium Kaju Katli", desc: "Classic diamond-cut cashew fudge made with premium cashew nuts.", color: "from-slate-400 to-gray-600" };

    default:
      return { displayName: name, desc: "Traditional sweet delicacies direct from local confectioners.", color: "from-amber-500 to-rose-500" };
  }
};

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [categoryItems, setCategoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const metadata = getCategoryMetadata(categoryName);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        setLoading(true);
        // Request sweets filtered by category from backend
        const res = await axios.get(`${serverUrl}/api/item/search?category=${categoryName}`);
        setCategoryItems(res.data);
      } catch (error) {
        console.error("Fetch category items error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryItems();
  }, [categoryName]);

  return (
    <>
      <Nav />
      <div className="w-screen min-h-screen bg-[#fff9f6] flex flex-col items-center pb-12">
        <div className="w-full max-w-6xl px-4 py-8 flex flex-col gap-8">

          {/* Back button and Banner */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-teal-600 font-bold hover:text-teal-800 transition-colors self-start cursor-pointer group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>

            <div className={`bg-gradient-to-r ${metadata.color} rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col gap-2`}>
              <h2 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-3">
                <FaUtensils />
                {metadata.displayName}
              </h2>
              <p className="text-white/95 text-sm sm:text-base max-w-2xl font-medium">
                {metadata.desc}
              </p>
            </div>
          </div>

          {/* Sweets Grid */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-teal-950">
              Explore Available Varieties ({categoryItems.length})
            </h3>
            {loading ? (
              <div className="text-center py-16 text-gray-500 font-semibold animate-pulse">Loading sweets...</div>
            ) : categoryItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryItems.map((item) => (
                  <MithaiCard
                    key={item._id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl text-gray-400 text-sm">
                No sweet items found in the "{categoryName}" category database.
              </div>
            )}
          </div>
        </div>

        {/* AI Bot Floating assistant */}
        <AiBot />

        {/* Product Details Modal support */}
        {selectedItem && (
          <ProductDetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </div>
    </>
  );
};

export default CategoryPage;

