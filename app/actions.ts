"use server";

import { mongoDb } from "./utils/mongodb";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

// Submit product action
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

    revalidatePath("/your-orders");
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

// Remove order action
export async function removeOrderAction(id: string, action: string) {
  const db = await mongoDb();

  const orderId = new ObjectId(id);
  if (action === "removeOne") {
    const remove1Result = await db.collection("orders").updateOne(
      { _id: orderId },
      {
        $set: { updatedAt: new Date() },
        $inc: { selectedQuantity: -1 },
      }
    );
    if (remove1Result.modifiedCount === 0)
      throw new Error("Failed to remove 1 product from cart");
    revalidatePath("/your-orders");
    return;
  } else if (action === "removeAll") {
    const removeAllResult = await db
      .collection("orders")
      .deleteOne({ _id: orderId });
    if (removeAllResult.deletedCount === 0)
      throw new Error("Failed to remove product from cart");
    revalidatePath("/your-orders");
    return;
  }
}

// Set admin role
export async function setRole(formData: FormData) {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.role !== "admin") {
    throw new Error("Not Authorized");
  }

  const client = await clerkClient();
  const id = formData.get("id") as string;

  try {
    await client.users.updateUser(id, {
      publicMetadata: { role: "admin" },
    });
    revalidatePath("/admin");
  } catch {
    throw new Error("Failed to set role");
  }
}

// Remove admin role
export async function removeRole(formData: FormData) {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.role !== "admin") {
    throw new Error("Not Authorized");
  }

  const client = await clerkClient();
  const id = formData.get("id") as string;

  try {
    await client.users.updateUser(id, {
      publicMetadata: { role: "client" },
    });
    revalidatePath("/admin");
  } catch {
    throw new Error("Failed to remove role");
  }
}

export async function changeStatusAction(formData: FormData) {
  const db = await mongoDb();

  const orderId = formData.get("orderId") as string;
  const status = formData.get(`status-${orderId}`) as string;
  const _id = new ObjectId(orderId);

  await db.collection("orders").updateOne({ _id }, { $set: { status } });
  revalidatePath("/admin/manage-orders");
}
