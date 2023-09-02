"use client";

import "../../../globals.css";
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Alias, User } from "../../../../shared/types";
import { ToastContainer, toast } from "react-toastify";

export default function Dashboard() {
  const [user, setUser] = useState<User>();
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAPI = async (url: string, method: string = "GET", body?: any) => {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${Cookie.get("token")}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });
    return response.json();
  };

  useEffect(() => {
    const token = Cookie.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch aliases from the API
    fetchAPI(`${process.env.NEXT_PUBLIC_API}/alias`)
      .then((data) => {
        setAliases(data.aliases);
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        Cookie.set("token", "expired", {
          sameSite: "Strict",
          SameSite: "Strict",
          secure: true,
        });
        router.push("/login");
      });
  }, []);

  const deleteAlias = async (aliasEmail: string) => {
    const data = await fetchAPI(
      `${process.env.NEXT_PUBLIC_API}/alias/${aliasEmail}`,
      "DELETE"
    );

    if (data.status === 200) {
      setAliases((prevAliases) =>
        prevAliases.filter((alias) => alias.alias_email !== aliasEmail)
      );
      toast.success("Alias removed successfully.");
    } else {
      console.error(data.message);
      toast.error("Error removing alias.");
    }
  };

  const toggleAlias = async (aliasEmail: string) => {
    const aliasToToggle = aliases.find(
      (alias) => alias.alias_email === aliasEmail
    );
    if (!aliasToToggle) return;

    const data = await fetchAPI(
      `${process.env.NEXT_PUBLIC_API}/alias/${aliasEmail}`,
      "PUT",
      { enable: !aliasToToggle.enable }
    );

    if (data.status === 200) {
      setAliases((prevAliases) =>
        prevAliases.map((alias) => {
          if (alias.alias_email === aliasEmail) {
            alias.enable = !alias.enable;
          }
          return alias;
        })
      );
      toast.success("Alias status changed successfully.");
    } else {
      console.error(data.message);
      toast.error("Error changing alias status.");
    }
  };

  const createNewAlias = async () => {
    // Check if user is on free plan and has already 10 aliases
    if (user?.plan.toLowerCase() === "free" && aliases.length >= 10) {
      toast.warn("Only 10 aliases can be created by free plan users.");
      return;
    }

    const data = await fetchAPI(`${process.env.NEXT_PUBLIC_API}/alias`, "POST");

    if (data.status === 201 && data.alias) {
      setAliases((prevAliases) => [...prevAliases, data.alias]);
      toast.info(
        "A new alias was made. The registration process will take 1 to 3 minutes before it starts to function."
      );
    } else {
      toast.error(data.message || "An error occurred.");
    }
  };

  const handleLogout = () => {
    Cookie.remove("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gradient-to-r from-blue-500 to-indigo-600 items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col">
      {/* Navbar */}
      <div className="bg-white shadow-md p-4 fixed w-full top-0 z-50">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-600 truncate w-1/2 sm:w-auto">
            {user?.email}
          </h1>
          <div className="flex items-center mt-2 sm:mt-0">
            <p className="text-gray-800 mr-4 text-sm sm:text-base">
              Plan: <span className="font-bold">{user?.plan}</span>
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white rounded-full px-4 py-2 transition hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-20 mt-16">
        <div className="container mx-auto p-6 bg-white rounded-xl shadow-md">
          {aliases.map((alias) => (
            <div
              key={alias.id}
              className="border-b p-4 mb-4 flex items-center justify-between">
              <button
                onClick={() => toggleAlias(alias.alias_email)}
                className={`px-4 py-2 rounded text-white font-bold ${
                  alias.enable
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}>
                {alias.enable ? "On" : "Off"}
              </button>
              <h2 className="font-bold text-lg mx-4 flex-1 text-blue-600">
                {alias.alias_email}
              </h2>
              <button
                onClick={() => deleteAlias(alias.alias_email)}
                className="p-2 rounded hover:bg-gray-200">
                <FaTrash style={{ color: "red", fontSize: "24px" }} />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={createNewAlias}
            className="px-8 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition">
            Create New Alias
          </button>
        </div>
        {/* Alias counter */}
        <div className="text-center mt-5">
          <p className="text-white text-lg">{aliases.length}/10 Aliases</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6">
        <div className="container mx-auto text-center">
          <p className="text-white text-sm">
            © 2023 myalias.pro. All rights reserved.
          </p>
        </div>
      </footer>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
