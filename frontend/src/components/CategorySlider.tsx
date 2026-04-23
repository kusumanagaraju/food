"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const categories = [
  { name: "All", icon: "🍽️" },
  { name: "Pizza", icon: "🍕" },
  { name: "Burger", icon: "🍔" },
  { name: "Sushi", icon: "🍣" },
  { name: "Healthy", icon: "🥗" },
  { name: "Dessert", icon: "🍰" },
  { name: "Drinks", icon: "🥤" },
  { name: "South Indian", icon: "🍛" },
  { name: "Fast Food", icon: "🍟" },
];

export default function CategorySlider({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="py-6">
      <h2 className="text-xl font-bold mb-4 px-4 sm:px-6 lg:px-8">Eat what makes you happy</h2>
      <div className="flex overflow-x-auto hide-scrollbar gap-4 px-4 sm:px-6 lg:px-8 pb-4">
        {categories.map((category, index) => (
          <motion.button
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(category.name)}
            className={`flex flex-col items-center justify-center min-w-[80px] sm:min-w-[100px] gap-3 p-3 rounded-2xl transition-all ${
              selected === category.name
                ? "bg-[var(--color-primary)] text-white shadow-lg shadow-red-500/30"
                : "bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm bg-gray-50 dark:bg-white/5 ${
                selected === category.name ? "bg-white/20" : ""
              }`}
            >
              {category.icon}
            </div>
            <span className="text-sm font-semibold whitespace-nowrap">
              {category.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
