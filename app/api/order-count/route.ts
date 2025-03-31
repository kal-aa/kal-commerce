import { mongoDb } from "@/app/utils/mongodb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await mongoDb();
  const { userId } = await auth();
  const count = await db.collection("orders").countDocuments({ userId });
  return new NextResponse(JSON.stringify({ count }));
}
