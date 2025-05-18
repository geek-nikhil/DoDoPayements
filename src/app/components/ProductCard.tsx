"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  product_id: number;
  name: string;
  description: string;
  price: number;
  is_recurring: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const checkoutProduct = async (productId: number, is_recurring: boolean, useDynamicPaymentLinks: boolean) => {
  if (useDynamicPaymentLinks) {
    setLoading(true);
        let productType = "onetime"
      if (!is_recurring) {
    // Static payload object
    const paymentPayload = {
      allowed_payment_method_types: ["credit"],
      billing: {
        city: "Delhi",
        country: "IN",
        state: "Delhi",
        street: "123 Street Name",
        zipcode: "110001"
      },
      billing_currency: "INR",
      customer: {
        email: "test4@gmail.com",
        name: "test4"
      },
      metadata: {
        order_id: "order_001",
        note: "Test payment from Postman"
      },
      payment_link: true,
      product_cart: [
        {
          amount: 123,
          product_id: "pdt_aTSu8kBkLuG3FQOBVxZ5z",
          quantity: 1
        }
      ],
      return_url: "http://localhost:3000",
      show_saved_payment_methods: true
    };
    
    // if(productType=="onetime"){
    try {
      const response = await fetch(`https://phgpwenqbuqerwolmqhv.functions.supabase.co/onetime`, {
        method: 'POST', // Add method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload), // Send the static payload
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      router.push(data.payment_link);
    } catch (error) {
      console.error('Payment processing failed:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  }else{
       const paymentPayload  ={
  product_Id: "pdt_Edt1qdx7pO2DF7onaFDm1",
  customer: {
    email: "final@example.com",
    name:"final"
  },
   billing: {
          city: "jhansi",
          country: "IN",
          state:  "UP", 
          street: "SEHER",
          zipcode:"284002"
        },
        return_url:"http://localhost:3000/",
        metadata: {
        order_id: "teat",
        note: "Test payment from server"
      },
     }
       try {
      const response = await fetch(`https://phgpwenqbuqerwolmqhv.functions.supabase.co/subscription`, {
        method: 'POST', // Add method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload), // Send the static payload
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      router.push(data.payment_link);
    } catch (error) {
      console.error('Payment processing failed:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }    
  }
  } else {
    let checkoutUrl = `https://test.checkout.dodopayments.com/buy/${productId}?quantity=1&redirect_url=${process.env.NEXT_PUBLIC_BASE_URL}`;
    router.push(checkoutUrl);
  }
};
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:transform hover:scale-105 hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl font-bold text-black">{product.name}</h2>
      <p className="text-gray-700 mt-2">{product.description}</p>
      <p className="text-green-600 font-semibold mt-4">${product.price / 100}</p>
      <button
        className="text-xl font-bold text-black"
        onClick={() => checkoutProduct(product.product_id, product.is_recurring, true)}
        disabled={loading}
      >
        {loading ? "Processing..." : "Buy now"}
      </button>
    </div>
  );
}
