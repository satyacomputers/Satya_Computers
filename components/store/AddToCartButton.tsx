'use client';

import { useCart } from '@/lib/CartContext';
import BrutalButton from '@/components/ui/BrutalButton';
import { Product } from '@/data/products';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, items } = useCart();
  const cartItem = items.find(item => item.productId === product.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  return (
    <div className="w-full md:w-auto">
      <BrutalButton 
        onClick={handleAdd} 
        className={`w-full min-w-[200px] ${currentQuantity > 0 ? 'bg-green-600 text-white border-green-600 hover:bg-green-700 shadow-lg' : ''}`}
      >
        {currentQuantity > 0 
          ? `ADDED (Qty: ${currentQuantity}) ✓` 
          : 'ADD TO CART'}
      </BrutalButton>
    </div>
  );
}
