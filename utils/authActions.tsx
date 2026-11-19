"use server";

import { signIn, signOut } from "@/auth";
import { loginProps, registerProps, registerSchema } from "./authValidations";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Server actions return result objects instead of throwing: Next.js hides
// thrown error messages in production, so the user would only see a
// generic error instead of "Invalid email or password".
export type ActionResult = { success: true } | { success: false; error: string };

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}

export async function signInWithCredentials(
  data: loginProps
): Promise<ActionResult> {
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError)
      return { success: false, error: "Invalid email or password" };
    console.error("Sign in failed", error);
    return { success: false, error: "Something went wrong, please try again" };
  }
}

export async function registerWithCredentials(
  data: registerProps
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message };

  const { name, email, password } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return { success: false, error: "An account with this email already exists" };

    await prisma.user.create({
      data: { name, email, password: await bcrypt.hash(password, 10) },
    });
    return { success: true };
  } catch (error) {
    console.error("Register failed", error);
    return { success: false, error: "Something went wrong, please try again" };
  }
}
