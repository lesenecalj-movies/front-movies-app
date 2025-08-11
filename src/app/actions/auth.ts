"use server";

import { z } from "zod";
import { signIn } from "@root/auth";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function login(input: unknown) {
  const result = schema.safeParse(input);
  if (!result.success) {
    const pretty = z.prettifyError(result.error);
    return { ok: false, pretty };
  }

  const { email, password } = result.data;

  try {
    await signIn("credentials", { email, password, redirect: false });
    return { ok: true };
  } catch (err) {
    console.error({ err });
    return { ok: false, error: "Identifiants invalides." };
  }
}