"use client";
import React, {useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import Cookie from "js-cookie";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await axios.post(
        "https://clipwave-backend-fue2eyddgwd8akbw.uksouth-01.azurewebsites.net/users/login",
        formData
      );
      console.log(response);
      Cookie.set("token", response.data.token);
      Cookie.set("role", response.data.role);
      Cookie.set("username", response.data.username);
      Cookie.set("id", response.data.id);
      router.push("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Log In</h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-1">Username</label>
          <input
            type="name"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium disabled:opacity-50"
        >
          {loading ? "Logging In..." : "Log In"}
        </button>
      </form>

      <div className="mt-4 text-center text-gray-400">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-400 hover:underline">
          Sign up
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
