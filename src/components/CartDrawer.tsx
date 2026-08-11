import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const delivery = subtotal > 0 ? 5.0 : 0;
  const total = subtotal + delivery;

  const handleCheckout = () => {
    setIsOrdered(true);
    setTimeout(() => {
      onClearCart();
      setIsOrdered(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white text-[#0e2913] h-full shadow-2xl flex flex-col justify-between">
        
        {/* Drawer Header */}
        <div className="p-6 bg-[#0e2913] text-white flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold">Your Fresh Cart</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {isOrdered ? (
            <div className="py-16 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-[#168038] mx-auto animate-bounce" />
              <h4 className="text-2xl font-bold text-[#0e2913]">Order Confirmed!</h4>
              <p className="text-sm text-slate-600">
                Your farm-fresh organic items are being packed and dispatched. Thank you for supporting sustainable farming!
              </p>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
              <p className="text-base font-semibold">Your cart is currently empty.</p>
              <p className="text-xs text-slate-500">
                Browse our fresh vegetables, A2 pasture milk, and soil supplements!
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover rounded-xl"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-[#0e2913]">
                      {item.product.name}
                    </h5>
                    <p className="text-xs text-[#168038] font-bold">
                      ${item.product.price.toFixed(2)}{' '}
                      <span className="text-slate-400 font-normal">
                        / {item.product.unit}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden text-xs">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="px-2 py-1 font-bold hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="px-2 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="px-2 py-1 font-bold hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {!isOrdered && cart.length > 0 && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Eco Express Delivery</span>
                <span className="font-semibold">${delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#0e2913] pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-[#168038]">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-[#168038] hover:bg-[#136e30] text-white font-bold rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition"
            >
              <span>Checkout (${total.toFixed(2)})</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
