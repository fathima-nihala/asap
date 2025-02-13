"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const handleButtonClick = () => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  };

  return (
    <div
      className="h-screen flex flex-col justify-center items-center text-white bg-cover bg-center px-4 md:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url("/image/background-.jpg")`,
      }}
    >
      <div className="max-w-xl text-center sm:text-left">
        <h1 className="text-lg sm:text-xl md:text-2xl font-mono leading-tight">
          Go confidently in the direction of your dreams!
          <br />
          <span className="text-gray-300">Find Out Your Dream Job..!</span>
        </h1>
      </div>

      <button
        className="flex items-center justify-center bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-[300px] mt-6"
        onClick={handleButtonClick}
      >
        Login / Register
        <ArrowRight className="ml-2" size={20} />
      </button>
    </div>
  );
}
