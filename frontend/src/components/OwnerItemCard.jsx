import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { resolveLocalImage } from "../utils/imageResolver";

const OwnerItemCard = ({ data, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Item Image & Category Tag */}
      <div className="h-44 overflow-hidden relative">
        <img
          src={resolveLocalImage(data.image)}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
          {data.category}
        </span>
      </div>

      {/* Item Details */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-200 line-clamp-1">
              {data.name}
            </h3>
            <span
              className={`text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md ${
                data.foodType === "sweet"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {data.foodType === "sweet" ? "Mithai" : "Namkeen"}
            </span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-extrabold text-teal-800">
            ₹{data.price}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(data)}
              title="Edit Item"
              className="p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-600 hover:text-teal-700 border border-teal-100 transition-colors"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={() => onDelete(data._id)}
              title="Delete Item"
              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-100 transition-colors"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;