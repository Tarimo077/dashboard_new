"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { handleSignIn } from "@/action"; 
import Image from "next/image";

export default function SignInPage(props: { searchParams: { callbackUrl?: string } }) {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    setErrorMessage(""); // Clear previous error message

    try {
        const result = await handleSignIn(formData);

        // Check if there is an error in the result
        if (result.error) {
            // Use the error message returned from handleSignIn
            setErrorMessage(result.error);
            console.log('New Error is:  '); 
            console.log(result.error);
            return; // Stop further execution if there's an error
        }

        // Redirect after successful sign-in
        router.push(props.searchParams.callbackUrl || "/");
    } catch (error) {
        console.log("Unexpected error during sign-in:", error);
        setErrorMessage("Wrong Username or Password. Please try again.");
    } finally {
        setLoading(false);
    }
};

  return (
    <>
      <div className="flex flex-col gap-2 items-center justify-center min-h-screen">
        <form className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleFormSubmit}>
          <Image src="/media/pplogo.png" alt="PowerPay Logo" width={220} height={200} className="ml-20" />
          <h2 className="text-center text-xl font-bold mb-10 mt-2 text-green-600">Appliances For The Next Billion</h2>

          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div> // Display error messages
          )}

          <label htmlFor="email" className="flex items-center mb-4">
            <FiMail className="mr-2 text-green-500" />
            <input
              name="email"
              id="email"
              placeholder="Email"
              className="border rounded w-80 py-3 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </label>

          <label htmlFor="password" className="flex items-center mb-4">
            <FiLock className="mr-2 text-green-500" />
            <input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border rounded w-full py-3 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="ml-2 text-green-500 focus:outline-none"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </label>

          <button
            type="submit"
            className={`flex items-center justify-center w-40 ml-24 mt-6 ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-700"} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer`}
            disabled={loading}
          >
            {loading ? "Signing In..." : <><FiLogIn className="mr-2" /> Sign In</>}
          </button>
        </form>
      </div>
      <label className="text-green-600 text-sm ml-0 italic fixed bottom-0 left-0">
        <i className="bi bi-c-circle-fill mr-1"></i>Powerpay Africa. All Rights Reserved.
      </label>
    </>
  );
}
