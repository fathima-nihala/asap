
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/features/authSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { useRouter } from "next/navigation";
import { setAuthToken } from "../../utils/auth";
import { useSnackbar } from "notistack";
import { Link } from "lucide-react";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { error } = useSelector((state: RootState) => state.auth);
  const { enqueueSnackbar } = useSnackbar(); 

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      enqueueSnackbar("Please enter email and password.", { variant: "error" });
      return;
    }

    try {
      const result = await dispatch(loginUser(credentials)).unwrap();

      if (result.token) {
        setAuthToken(result.token);
        enqueueSnackbar("Login successful!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });

        setTimeout(() => {
          router.push("/home");
          router.refresh();
        }, 1500); 
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don`&apos;`t have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:text-blue-700">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
