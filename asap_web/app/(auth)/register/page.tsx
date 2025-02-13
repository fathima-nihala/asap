"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/features/authSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSnackbar } from "notistack";

export default function Register() {
  const dispatch = useDispatch<AppDispatch>(); 
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData object for multipart form submission
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof typeof formData]) {
        submitData.append(key, formData[key as keyof typeof formData]);
      }
    });

    try {
       await dispatch(registerUser(submitData)).unwrap();
      enqueueSnackbar("Registration successful! Please login.", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" }
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = 
        err instanceof Error ? err.message : "Registration failed. Please try again.";
      
      enqueueSnackbar(errorMessage, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" }
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="f_name"
            placeholder="First Name"
            className="w-full p-2 mb-3 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="l_name"
            placeholder="Last Name"
            className="w-full p-2 mb-3 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone (optional)"
            className="w-full p-2 mb-3 border rounded"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password (must be 6 letters/ charecters)"
            className="w-full p-2 mb-3 border rounded"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account? {" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-700 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}