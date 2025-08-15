"use client";
import React, {useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    display_name: "",
    password: "",
    confirmPassword: "",
    role: "user", // default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://clipwave-backend-fue2eyddgwd8akbw.uksouth-01.azurewebsites.net/users/signup",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }
      );

      localStorage.setItem("token", response.data.token);
      router.push("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        Create Account
      </h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-black mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white border border-gray-600 rounded text-black"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-black mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white border border-gray-600 rounded text-black"
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-black mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-gray-600 rounded text-black"
          >
            <option value="user">User</option>
            <option value="creator">Creator</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block text-black mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full px-3 py-2 bg-white border border-gray-600 rounded text-black"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-black mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white border border-gray-600 rounded text-black"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded text-black font-medium disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      {/* Already have an account */}
      <div className="mt-4 text-center text-gray-400">
        Already have an account?{" "}
        <a href="/login" className="text-blue-400 hover:underline">
          Log in
        </a>
      </div>
    </div>
  );
};

export default SignupForm;
