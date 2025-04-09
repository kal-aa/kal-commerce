import Stripe from "stripe";
import dotenv from "dotenv";
import { NextRequest, NextResponse } from "next/server";
import allProducts from "@/app/data/products.json"; // ✅ import the local data
import { Order, Product } from "@/app/types/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
dotenv.config();

export async function POST(req: NextRequest) {
  const { orders } = await req.json();
  if (!orders || orders.length === 0) {
    return NextResponse.json(
      { mssg: "No products available for payment" },
      { status: 404 }
    );
  }

  const line_items = orders.map((order: Order) => {
    const product = allProducts.products.find(
      (p: Product) => p.productId === order.productId
    );

    if (!product) throw new Error("Invalid product ID");

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: `${product.for} ${product.type} - ${order.selectedColor} - ${order.selectedSize}`.toUpperCase(),
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: order.selectedQuantity,
    };
  });

  const totalProductPrice = orders.reduce((acc: number, order: Order) => {
    const product = allProducts.products.find(
      (p: Product) => p.productId === order.productId
    );

    if (product) {
      acc += order.selectedQuantity * product.price;
    }
    return acc;
  }, 0);

  const baseShipping = 0.1;
  const freeShippingThreshold = 250;
  const shippingCost =
    totalProductPrice < freeShippingThreshold
      ? Math.round(baseShipping * totalProductPrice * 100)
      : 0;

  if (shippingCost > 0) {
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Shipping fee",
        },
        unit_amount: shippingCost,
      },
      quantity: 1,
    });
  }

  const orderIds = orders.map((order: Order) => order.orderId);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.SERVER_URL}/add-orders`,
      cancel_url: `${process.env.SERVER_URL}/your-orders`,
      payment_intent_data: {
        metadata: {
          orderIds: JSON.stringify(orderIds),
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout error:", err);
    return new NextResponse("Failed to create session", { status: 500 });
  }
}
