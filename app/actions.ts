"use server";

import { mongoDb } from "./utils/mongodb";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function searchAction(formData: FormData) {
  const query = formData.get("query") as string;
  console.log(query);
}

export async function submitProductAction(formData: FormData) {
  const db = await mongoDb();

  const productId = Number(formData.get("productId"));
  const selectedQuantity = Number(formData.get(`quantity-${productId}`));
  const selectedColor = formData.get(`color-${productId}`) as string;
  const selectedSize = formData.get(`size-${productId}`) as string;
  const { userId } = await auth();

  // first check if an order with the same shared values exist if so add the quantity to it
  const existingOrder = await db.collection("orders").findOne({
    userId,
    productId,
    selectedSize,
    selectedColor,
  });

  if (existingOrder) {
    await db.collection("orders").updateOne(
      { _id: existingOrder._id },
      {
        $set: { updatedAt: new Date() },
        $inc: { selectedQuantity: selectedQuantity },
      }
    );

    return { success: true, message: "Order quantity updated" };
  }

  // if there is no existing order with identical values
  const random = Math.floor(Math.random() * 3) + 1;
  const status =
    random === 1
      ? "Processing"
      : random === 2
      ? "Dispatched"
      : "Pending Checkout";

  try {
    const result = await db.collection("orders").insertOne({
      userId,
      productId,
      selectedColor,
      selectedSize,
      selectedQuantity,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (result.acknowledged) {
      revalidatePath("/your-orders");
      revalidatePath("/api/order-count");
      return { success: true, message: "Item added to your Cart" };
    }
  } catch (error) {
    console.error("An error occured while posting order:", error);
    return { success: true, message: "Error adding an Item" };
  }
}

export async function removeOrderAction(formData: FormData) {
  const action = formData.get("action");

  if (action === "removeOne") {
    console.log("removed one");
  } else if (action === "removeAll") {
    console.log("removed all");
  }
}
