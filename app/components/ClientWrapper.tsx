"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/signin" && <NavBar />}
      {children}
    </>
  );
}
