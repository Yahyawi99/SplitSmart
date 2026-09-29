"use client";

import { useEffect, useState } from "react";
import SignInForm from "@/components/forms/sign-in/Sign-in-form";
import { Logo } from "@/components/shared";
// import { getBrowserTheme } from "@/utils/getBrowserTheme";

export default function SignIn() {
  const [theme, setTheme] = useState("light");

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedTheme = localStorage.getItem("theme");
  //     if (storedTheme) {
  //       setTheme(storedTheme);
  //     } else {
  //       if (getBrowserTheme() === "dark") {
  //         setTheme("dark");
  //       } else {
  //         setTheme("light");
  //       }
  //     }
  //   }
  // }, []);

  return (
    <div
      className={`${theme} flex min-h-lvh flex-col items-center justify-center gap-6 bg-(--bg-base) px-4 py-8`}
    >
      <Logo open={true} />

      <SignInForm />
    </div>
  );
}
