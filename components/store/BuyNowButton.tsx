'use client';

import { useCart } from '@/lib/CartContext';
import BrutalButton from '@/components/ui/BrutalButton';
import { Product } from '@/data/products';
import { useRouter } from 'next/navigation';

export default function BuyNowButton({ product }: { product: Product }) {
  const { addToCart, items } = useCart();
  const router = useRouter();

  const handleBuyNow = () => {
    const cartItem = items.find(item => item.productId === product.id);
    if (!cartItem) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    router.push('/checkout');
  };

  const isInStock = product.stockStatus === undefined || product.stockStatus === 'In Stock';

  if (!isInStock) return null;

  return (
    <div className="w-full md:w-auto">
      <BrutalButton 
        onClick={handleBuyNow} 
        className="w-full min-w-[200px] bg-black text-white hover:bg-[var(--color-brand-primary)] border-black hover:border-[var(--color-brand-primary)]"
      >
        BUY NOW
      </BrutalButton>
    </div>
  );
}
