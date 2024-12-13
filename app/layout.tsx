import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import ClientWrapper from "./components/ClientWrapper"; // Import ClientWrapper
import "bootstrap-icons/font/bootstrap-icons.css";
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})


export const metadata: Metadata = {
  title: "Powerpay Africa",
  description: "Appliances For The Next Billion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className} data-theme="dark">
      
      <body className="px-0 py-0">
        <ClientWrapper>
          <div className="ml-8 relative z-0 mt-1 mr-8"><SessionProvider>{children}</SessionProvider></div>
        </ClientWrapper>
      </body>
    </html>
  );
}
