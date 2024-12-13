"use server"; // This line indicates that this file contains server actions

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function handleSignIn(formData: FormData): Promise<{ error?: string }> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log(email, password);
    // Sign in logic here
    const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Important to handle redirects manually
    });
    console.log("my result is: ",result);
    // Return an object with an error message if the sign-in fails
    if (result?.error) {
        console.log(result.error);
        return { error: result.error }; // Return the error

    }

    // Return success if there's no error
    return {};
}


export async function handleSignInWithProvider(providerId: string, callbackUrl?: string) {
  try {
    await signIn(providerId, {
      redirectTo: callbackUrl ?? "",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      throw error; // Handle the error as needed
    }
    throw error;
  }
}
