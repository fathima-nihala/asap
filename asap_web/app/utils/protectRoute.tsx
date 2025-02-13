"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { loadUser } from "../redux/features/authSlice";

export function useProtectRoute() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); 
    } else {
      setIsAuthenticated(true);
        dispatch(loadUser());
    }
  }, [router, dispatch]);

  return isAuthenticated;
}
