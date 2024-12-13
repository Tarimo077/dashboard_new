import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import crypto from "crypto";
import type { Provider } from "next-auth/providers";

interface CredentialsType {
  email: string;
  password: string;
}

const validatePassword = (plain: string, hashed: string): boolean => {
  const parts = hashed.split('$');
  const iterations = parseInt(parts[1]);
  const salt = parts[2];
  const keylen = 32;
  const digest = parts[0].split('_')[1];
  const value = parts[3];

  const derivedKey: Buffer = crypto.pbkdf2Sync(plain, salt, iterations, keylen, digest);

  return value === derivedKey.toString('base64');
};

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "text", placeholder: "Enter your email" },
      password: { label: "Password", type: "password", placeholder: "Enter your password" },
    },
    authorize: async (credentials: Partial<Record<"email" | "password", unknown>>) => {
      const { email, password } = credentials as CredentialsType;

      if (!email || !password) {
        throw new Error("Email and password are required.");
      }

      const response = await fetch("https://appliapay.com/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("User not found. Please check your email.");
      }

      const user = await response.json();

      if (!user || !user.password) {
        throw new Error("User not found or missing password.");
      }

      const normalizedHashedPassword = user.password;

      const isValid = validatePassword(password, normalizedHashedPassword);

      if (!isValid) {
        throw new Error("Invalid password. Please try again.");
      }

      return {
        id: user.id,
        email: user.email,
      };
    },
  })
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: '/signin'
  }
});
