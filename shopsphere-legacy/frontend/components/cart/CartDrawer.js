'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, clearCart } = useCartStore();
  const [removingId, setRemovingId] = useState(null);

  const total = items.reduce((sum, item) => {
    return sum + (item.price || 0) * (item.quantity || 1);
  }, 0);

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      removeItem(id);
      setRemovingId(null);
    }, 200);
  };

  const handleQuantityChange = (id, newQty) => {
    // BUG: this updates the local state but does NOT recalculate total
    // the total is derived from items but the quantity change isn't
    // properly reflected until a re-render from another action
    console.log('Quantity change for', id, 'to', newQty);
    // This is a no-op currently - just logs
    // TODO: implement quantity update in cart store
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="overlay" onClick={toggleCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">
            Cart ({items.reduce((s, i) => s + (i.quantity || 1), 0)})
          </h2>
          <button
            onClick={toggleCart}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🛒</p>
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-3 p-3 rounded-lg border transition-opacity ${
                    removingId === item.id ? 'opacity-0' : ''
                  }`}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.image_url || '/placeholder.svg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{item.name}</h4>
                    <p className="text-sm text-brand-600 font-semibold">
                      ${item.price?.toFixed(2)}
                    </p>
                    {/* BUG: quantity input change does not update cart total */}
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        defaultValue={item.quantity || 1}
                        onChange={(e) =>
                          handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-14 text-center text-xs border rounded px-1 py-0.5"
                      />
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium">
                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${(total > 50 ? total : total + 4.99).toFixed(2)}</span>
            </div>
            {total < 50 && (
              <p className="text-xs text-gray-400">
                Add ${(50 - total).toFixed(2)} more for free shipping!
              </p>
            )}
            <Link
              href="/checkout"
              onClick={toggleCart}
              className="btn-primary w-full py-3 text-center block"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={clearCart}
              className="w-full text-center text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}