import "../../app/globals.css";
import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Alias, User } from "../../shared/types";
import { ToastContainer, toast } from 'react-toastify';

export default function Dashboard() {
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookie.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch aliases from the API
    fetch(`${process.env.NEXT_PUBLIC_API}/alias`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Authentication failed");
        return response.json();
      })
      .then((data) => {
        setAliases(data.aliases);
        setUser(data.user);
        setLoading(false); // Set loading to false after data is set
      })
      .catch(() => {
        Cookie.set("token", "expired");
        router.push("/login");
      });
  }, [router]);

  const deleteAlias = (aliasEmail: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API}/alias/${aliasEmail}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookie.get("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setAliases((prevAliases) =>
            prevAliases.filter((alias) => alias.alias_email !== aliasEmail)
          );
          toast.success('Alias removed successfully.');
        } else {
          console.error(data.message);
          toast.error('Error removing alias.');
        }
      });
  };

  const toggleAlias = (aliasEmail: string) => {
    const aliasToToggle = aliases.find(
      (alias) => alias.alias_email === aliasEmail
    );
    if (!aliasToToggle) return;

    fetch(`${process.env.NEXT_PUBLIC_API}/alias/${aliasEmail}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${Cookie.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ enable: !aliasToToggle.enable }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setAliases((prevAliases) =>
            prevAliases.map((alias) => {
              if (alias.alias_email === aliasEmail) {
                alias.enable = !alias.enable;
              }
              return alias;
            })
          );
          toast.success('Alias status changed successfully.');
        } else {
          console.error(data.message);
          toast.error('Error changing alias status.');
        }
      });
  };

  const createNewAlias = () => {
    // Check if user is on free plan and has already 10 aliases
    if (user?.plan.toLowerCase() === 'free' && aliases.length >= 10) {
      toast.warn('Only 10 aliases can be created by free plan users.');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API}/alias`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookie.get("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 201 && data.alias) {
          setAliases((prevAliases) => [...prevAliases, data.alias]);
          toast.info(
            "A new alias was made. The registration process will take 1 to 3 minutes before it starts to function."
          );
        } else {
          toast.error(data.message || 'An error occurred.');
        }
      });
  };

  const handleLogout = () => {
    Cookie.remove("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col">
      {/* Navbar */}
      <div className="bg-white shadow-md p-4 fixed w-full top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">{user?.email}</h1>
          <div className="flex items-center">
            <p className="text-gray-800 mr-4">
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
          <p className="text-white text-lg">
            {aliases.length}/10 Aliases
          </p>
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
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}


