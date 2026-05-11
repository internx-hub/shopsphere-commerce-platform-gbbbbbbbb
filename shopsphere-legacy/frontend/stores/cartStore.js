import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product) => {
    const items = get().items;
    const existing = items.find((item) => item.id === product.id);

    if (existing) {
      set({
        items: items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        ),
      });
    } else {
      set({
        items: [...items, { ...product, quantity: 1 }],
      });
    }
    console.log('Item added to cart:', product.name);
  },

  removeItem: (productId) => {
    set({
      items: get().items.filter((item) => item.id !== productId),
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity < 1) {
      get().removeItem(productId);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  toggleCart: () => {
    set({ isOpen: !get().isOpen });
  },

  // Computed-like getter
  get total() {
    return get().items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
  },
}));

// Export a computed total helper
export const useCartTotal = () =>
  useCartStore((state) =>
    state.items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    )
  );

// NOTE: persistence not yet implemented
// TODO: add persist middleware for localStorage
// See: https://zustand.docs.pmnd.rs/middlewares/persist

export { useCartStore };