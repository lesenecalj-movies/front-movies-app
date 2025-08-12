import { auth, signOut } from "@root/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  return Response.json({ user: session?.user ?? null });
}

export async function POST() {
  await signOut({ redirect: false });
  const res = NextResponse.json({ success: true });
  return res;
}
