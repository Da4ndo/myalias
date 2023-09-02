"use client";

import "../../../globals.css";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type User = {
  username: string;
  password: string;
  email: string;
}

const SignUpPage: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState<User>({ username: "", password: "", email: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setQueuePosition(data.queuePosition ?? "?");
        setErrorMessage(null);
        setIsSignedUp(true);
      } else {
        setErrorMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  function colorClass() {
    const score = getStrengthScore(user.password);
    return ["bg-red-400", "bg-red-400", "bg-yellow-300", "bg-yellow-500", "bg-green-400", "bg-green-500", "bg-purple-500", "bg-gray-300"][score];
  }

  function getStrengthScore(password: string): number {
    return [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /\W/.test(password),
      password.length >= 16
    ].filter(Boolean).length;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 text-black transform transition-all hover:scale-105">
        <h1 className="text-3xl font-bold mb-4 text-indigo-500 text-center">
          Sign Up
        </h1>

        {errorMessage && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"
            role="alert">
            <p className="font-bold">Error</p>
            <p>{errorMessage}</p>
          </div>
        )}

        {queuePosition && (
          <div
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded"
            role="alert">
            <p className="font-bold">Queue</p>
            <p>You are in queue.</p>
          </div>
        )}

        {!isSignedUp ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="username">
                Username<span className="ml-1 text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                value={user.username}
                onChange={(e) =>
                  setUser({ ...user, [e.target.id]: e.target.value })
                }
                className="mt-1 p-2 w-full border-2 border-indigo-300 rounded-md focus:border-indigo-500 focus:outline-none transition duration-150"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email<span className="ml-1 text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={user.email}
                onChange={(e) =>
                  setUser({ ...user, [e.target.id]: e.target.value })
                }
                className="mt-1 p-2 w-full border-2 border-indigo-300 rounded-md focus:border-indigo-500 focus:outline-none transition duration-150"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="password">
                Password<span className="ml-1 text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={user.password}
                onChange={(e) =>
                  setUser({ ...user, [e.target.id]: e.target.value })
                }
                className="mt-1 p-2 w-full border-2 border-indigo-300 rounded-md focus:border-indigo-500 focus:outline-none transition duration-150"
                required
              />
              <div className="w-full h-2.5 bg-gray-300 mt-2.5 rounded relative overflow-hidden">
                <div
                  className={`absolute h-full ${colorClass()} rounded transition-all duration-500`}
                  style={{
                    width: `${(getStrengthScore(user.password) / 6) * 100}%`,
                  }}></div>
              </div>
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="confirmPassword">
                Confirm Password<span className="ml-1 text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 p-2 w-full border-2 border-indigo-300 rounded-md focus:border-indigo-500 focus:outline-none transition duration-150"
                required
              />
              {user.password !== confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  Passwords do not match.
                </p>
              )}
            </div>

            <div className="flex items-center mb-4">
              <input
                id="terms"
                type="checkbox"
                checked={isTermsChecked}
                onChange={(e) => setIsTermsChecked(e.target.checked)}
                className="form-checkbox text-indigo-500 h-5 w-5 mr-2 focus:border-indigo-500 focus:outline-none transition duration-150"
                required
              />
              <label className="text-sm font-medium" htmlFor="terms">
                Agree to
                <Link
                  href="/terms-of-service"
                  className="text-indigo-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer">
                  Terms of Service
                </Link>
                <span className="ml-1 text-red-500">*</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={
                user.password !== confirmPassword ||
                !user.username ||
                !user.email ||
                !user.password ||
                !isTermsChecked
              }
              className={`w-full p-2 ${
                user.password !== confirmPassword ||
                !user.username ||
                !user.email ||
                !user.password ||
                !isTermsChecked
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-800"
              } text-white rounded-lg transition duration-150 ease-in-out`}>
              Sign Up
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-xl">Thanks for signing up!</p>
            <p className="mt-4 text-indigo-500">
              Your queue position is {queuePosition}
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 w-full p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-800 transition duration-150 ease-in-out">
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
