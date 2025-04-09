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
    status: "Pending Checkout",
  });

  if (existingOrder) {
    const response = await db.collection("orders").updateOne(
      { _id: existingOrder._id },
      {
        $set: { updatedAt: new Date() },
        $inc: { selectedQuantity: selectedQuantity },
      }
    );

    if (response.acknowledged === true) {
      revalidatePath("/your-orders");
      return { success: true, message: "Order quantity updated" };
    }
    throw new Error("An error occured while updating Product");
  }
  // if there is no existing order with identical values
  const status = "Pending Checkout";
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
      return { success: true, message: "Item added to your Cart" };
    }
  } catch (error) {
    console.error("An error occured while posting order:", error);
    return { success: true, message: "Error adding an Item" };
  }
}

// Change order status action
export async function changeStatusAction(orderId: string, status: string) {
  const db = await mongoDb();
  const _id = new ObjectId(orderId);
  try {
    const response = await db
      .collection("orders")
      .updateOne({ _id }, { $set: { status, updatedAt: new Date() } });
    if (response.acknowledged === true) {
      revalidatePath("/admin/manage-orders");
      revalidatePath("/your-orders");
      return { success: true };
    }
  } catch (error) {
    console.error(
      "An Error occured during chagnge the status of an order:",
      error
    );
    return { success: false };
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
    revalidatePath("/admin/manage-orders");
    return { success: true };
  } else if (action === "removeAll") {
    const removeAllResult = await db
      .collection("orders")
      .deleteOne({ _id: orderId });
    if (removeAllResult.deletedCount === 0)
      throw new Error("Failed to remove product from cart");
    revalidatePath("/your-orders");
    revalidatePath("/admin/manage-orders");
    return { success: true };
  }
}

// Set admin role
export async function setRole(id: string) {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.role !== "admin") {
    throw new Error("Not Authorized");
  }

  const client = await clerkClient();

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
export async function removeRole(id: string) {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.role !== "admin") {
    throw new Error("Not Authorized");
  }

  const client = await clerkClient();

  try {
    await client.users.updateUser(id, {
      publicMetadata: { role: "client" },
    });
    revalidatePath("/admin");
  } catch {
    throw new Error("Failed to remove role");
  }
}
