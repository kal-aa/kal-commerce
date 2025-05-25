//stripe listen --forward-to localhost:3000/api/stripe/webhook
import Stripe from "stripe";
import { mongoDb } from "@/app/utils/mongodb";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Helper to read stream as Buffer
async function buffer(readable: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

// Webhook handler
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") as string;

  let buf: Buffer;
  try {
    buf = await buffer(req.body as ReadableStream<Uint8Array>);
  } catch (err) {
    console.error("Error reading buffer:", err);
    return new Response("Could not read body", { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      { status: 400 }
    );
  }

  // Handle event types
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("✅ PaymentIntent was successful!");

      try {
        const orderIds = JSON.parse(
          paymentIntent.metadata.orderIds
        ) as string[];
        const db = await mongoDb();

        for (const orderId of orderIds) {
          const order = await db
            .collection("orders")
            .findOne({ _id: new ObjectId(orderId) });

          if (order) {
            const charge = await stripe.charges.retrieve(
              paymentIntent.latest_charge as string
            );

            await db.collection("orders").updateOne(
              { _id: new ObjectId(orderId) },
              {
                $set: {
                  status: "Processing",
                  updatedAt: new Date(),
                  paymentIntentId: paymentIntent.id,
                  chargeId: charge.id,
                  paymentDate: new Date(paymentIntent.created * 1000),
                },
              }
            );
          } else {
            console.error(`Order with Id ${orderId} not found`);
          }
        }
      } catch (err) {
        console.error("Error updating order status:", err);
      }
      break;

    case "payment_intent.payment_failed":
      const failed = event.data.object as Stripe.PaymentIntent;
      console.log("❌ Payment failed:", failed);
      break;

    default:
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
