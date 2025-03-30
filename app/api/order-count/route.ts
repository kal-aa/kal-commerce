import { mongoDb } from "@/app/utils/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await mongoDb();
  const count = await db.collection("orders").countDocuments();
  return new NextResponse(JSON.stringify({ count }));
}
