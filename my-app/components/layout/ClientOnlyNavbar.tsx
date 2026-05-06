"use client";

import dynamic from "next/dynamic";

const AppNavbar = dynamic(() => import("./Navbar"), { ssr: false });

export default function ClientOnlyNavbar() {
  return <AppNavbar />;
}