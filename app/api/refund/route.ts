// Moved into a server action to keep the code clean
export {}
// import { mongoDb } from "@/app/utils/mongodb";
// import { ObjectId } from "mongodb";
// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { orderId } = body;

//   if (!orderId)
//     return NextResponse.json(
//       { message: "Order ID is required" },
//       { status: 400 }
//     );

//   const db = await mongoDb();
//   const _id = new ObjectId(orderId);
//   const order = await db.collection("orders").findOne({ _id });

//   if (!order)
//     return NextResponse.json({ message: "Order not found" }, { status: 404 });

//   if (!order.paymentIntentId)
//     return NextResponse.json(
//       { message: "No payment intent found" },
//       { status: 400 }
//     );

//   try {
//     //   Refund the payment via Stripe using paymentIntent or charge ID
//     const refund = await stripe.refunds.create({
//       payment_intent: order.paymentIntentId,
//     });

//     // Update order status in DB to "Refunded"
//     // status: "Processing" | "Pending Checkout" | "Dispatched";
//     await db.collection("orders").updateOne(
//       { _id },
//       {
//         $set: {
//           status: "Pending Checkout",
//           updatedAt: new Date(),
//           refundDate: new Date(),
//         },
//       }
//     );

//     return NextResponse.json({ success: true, refund }, { status: 200 });
//   } catch (error) {
//     console.error("Stripe refund error:", error);
//     return NextResponse.json(
//       {
//         message: "Refund failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }
