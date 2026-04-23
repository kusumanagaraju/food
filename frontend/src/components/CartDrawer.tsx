"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useState } from "react";

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCartStore();
  const { user, token } = useAuth();
  const [isOrdering, setIsOrdering] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      return;
    }

    if (items.length === 0) return;

    setIsOrdering(true);
    try {
      const orderData = {
        userId: user.id,
        items: items.map(i => ({ foodId: i.foodId, quantity: i.quantity, price: i.price })),
        totalPrice: totalPrice()
      };

      await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Order placed successfully! 🏍️");
      clearCart();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#1a1a1a] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Your Cart
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p>Your cart is empty.</p>
                  <p className="text-sm">Looks like you haven't made your choice yet.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.foodId} className="flex gap-4 items-center">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-[var(--color-primary)] font-bold mt-1">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/5 rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-white/20 shadow-sm"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-white/20 shadow-sm"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 space-y-4">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black dark:text-white">₹{totalPrice()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-black dark:text-white">₹40</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 dark:border-white/10 pt-4">
                  <span>Total</span>
                  <span>₹{totalPrice() + 40}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isOrdering}
                  className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/30 disabled:opacity-70 mt-4"
                >
                  {isOrdering ? "Placing Order..." : "Proceed to Checkout"}
                  {!isOrdering && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
