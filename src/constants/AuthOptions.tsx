import { authOptionsType } from "@/types/auth";
import {  Mail } from "lucide-react";
import Image from "next/image";

export const authOptions: authOptionsType[] = [
  {
    type: "Email",
    icon: <Mail aria-hidden="true" size={16} />,
    label: "Email",
  },
  {
    type: "Google",
    icon: <Image src="/icons/google.png" alt="" width={16} height={16} />,
    label: "Google",
  },
  {
    type: "Github",
    icon: <Image src="/icons/github.png" alt="" width={16} height={16} />,
    label: "GitHub",
  },
];