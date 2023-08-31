import "../../app/globals.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUpPage: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
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
          body: JSON.stringify({ username, password, email }),
        }
      );

      const data = await response.json();

      if (data.status == 201) {
        setQueuePosition(data.queuePosition ?? "?");
        setErrorMessage(null);
        setIsSignedUp(true);
      } else {
        // Display an error message to the user
        setErrorMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  function colorClass() {
    const score = getStrengthScore(password);
    switch (score) {
      case 0:
      case 1:
        return "bg-red-400";
      case 2:
        return "bg-yellow-300";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-green-400";
      case 5:
        return "bg-green-500";
      case 6:
        return "bg-purple-500";
      default:
        return "bg-gray-300";
    }
  }

  function getStrengthScore(password: string): number {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/\W/.test(password)) score++;
    if (password.length >= 16) score++; // added an extra condition for longer passwords

    return score;
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 w-full border-2 border-indigo-300 rounded-md focus:border-indigo-500 focus:outline-none transition duration-150"
                required
              />
              <div className="w-full h-2.5 bg-gray-300 mt-2.5 rounded relative overflow-hidden">
                <div
                  className={`absolute h-full ${colorClass()} rounded transition-all duration-500`}
                  style={{
                    width: `${(getStrengthScore(password) / 6) * 100}%`,
                  }}></div>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <input
                id="terms"
                type="checkbox"
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
              className="w-full p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-800 transition duration-150 ease-in-out">
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
