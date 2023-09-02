'use client'

import "../../../globals.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";

const LoginPage: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookie.get("token");

    if (token == "expired") {
      setErrorMessage('You have been logged out because your token has expired');
      Cookie.remove("token");
    }
    else if (token) router.push("/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usernameOrEmail: username, password }),
        }
      );

      const data = await response.json();

      if (data.access_token) {
        Cookie.set("token", data.access_token, {
          expires: 30,
          sameSite: "Strict",
          secure: true,
        });
        router.push("/dashboard");
      } else {
        // Display an error message to the user
        setErrorMessage(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 text-black transform transition-all hover:scale-105">
        <h1 className="text-3xl font-bold mb-4 text-indigo-500 text-center">
          Login
        </h1>

        {errorMessage && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"
            role="alert">
            <p className="font-bold">Error</p>
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="username">
              Username or Email
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 w-full border-2 border-indigo-300 rounded-md focus:border-indigo-500 focus:outline-none transition duration-150"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border-2 border-indigo-300 rounded-md focus:border-indigo-500 focus:outline-none transition duration-150"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-800 transition duration-150 ease-in-out">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
