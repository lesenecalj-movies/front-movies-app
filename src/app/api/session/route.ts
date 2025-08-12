import { auth } from "@root/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  return Response.json({ user: session?.user ?? null });
}

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("session", "", { maxAge: 0 });
  return res;
}
