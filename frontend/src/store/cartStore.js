import { create } from "zustand";
const useCartStore = create((set) => ({
  cart: JSON.parse(localStorage.getItem('cart')) || null,
   addToCart: (product) =>
    set((state) => ({
      itemsList: [...state.itemsList, product],
    })),
}))
export default useCartStore
