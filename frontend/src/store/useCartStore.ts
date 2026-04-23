import { create } from "zustand";

export type CartItem = {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  restaurantId: string;
};

type CartState = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addToCart: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.foodId === item.foodId);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.foodId === item.foodId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    });
  },

  removeFromCart: (foodId) => {
    set((state) => ({
      items: state.items.filter((i) => i.foodId !== foodId),
    }));
  },

  updateQuantity: (foodId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(foodId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.foodId === foodId ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  totalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },
}));
