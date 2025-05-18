"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";

type Product = {
  product_id: number;
  name: string;
  description: string;
  price: number;
  is_recurring: boolean;
};

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
          cache: 'no-store'
        });
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const checkoutProduct = async (productId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout?productId=${productId}`, {
        cache: 'no-store'
      });
      const data = await response.json();
      router.push(data.payment_link);
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Dodo Payments Product List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product}  />
        ))}
      </div>
    </div>
  );
}
