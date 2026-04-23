"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import CategorySlider from "@/components/CategorySlider";
import FoodCard from "@/components/FoodCard";
import CartDrawer from "@/components/CartDrawer";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/foods");
        setFoods(data);
      } catch (error) {
        console.error("Failed to fetch foods", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const filteredFoods = category === "All" 
    ? foods 
    : foods.filter((food: any) => food.category === category || food.name.toLowerCase().includes(category.toLowerCase()));

  return (
    <div className="min-h-screen pb-20">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      
      <main className="max-w-7xl mx-auto">
        <CategorySlider selected={category} onSelect={setCategory} />

        <div className="px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {category === "All" ? "Recommended for you" : `${category} items`}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            </div>
          ) : filteredFoods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFoods.map((food: any) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl">
              <p className="text-gray-500 text-lg">No items found for this category.</p>
            </div>
          )}
        </div>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
