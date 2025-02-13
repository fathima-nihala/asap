"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useProtectRoute() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); 
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  return isAuthenticated;
}
