"use client";

import { Star, Clock, Plus } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

type FoodCardProps = {
  food: {
    _id: string;
    name: string;
    price: number;
    rating: number;
    image: string;
    restaurantId: { name: string, _id: string };
    deliveryTime: string;
    discount?: string;
  };
};

export default function FoodCard({ food }: FoodCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
      foodId: food._id,
      name: food.name,
      price: food.price,
      image: food.image,
      restaurantId: food.restaurantId._id,
    });
    toast.success(`Added ${food.name} to cart!`, {
      icon: "🛒",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-white/5"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800"}
          alt={food.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {food.discount && (
          <div className="absolute top-4 left-0 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1.5 rounded-r-lg shadow-md">
            {food.discount}
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm">
          <Clock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
          {food.deliveryTime || "30 mins"}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
              {food.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {food.restaurantId?.name || "Cravings Kitchen"}
            </p>
          </div>
          <div className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
            {food.rating} <Star className="w-3 h-3 fill-current" />
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-xl font-black text-gray-900 dark:text-white">
            ₹{food.price}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-gray-100 dark:bg-white/10 hover:bg-[var(--color-primary)] hover:text-white dark:hover:bg-[var(--color-primary)] text-gray-900 dark:text-white p-2 rounded-full transition-colors flex items-center justify-center shadow-sm"
            aria-label="Add to cart"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
