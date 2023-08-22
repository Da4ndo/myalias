import "../app/globals.css";

import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Alias } from "../shared/types";

export default function Home() {
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [realEmail, setRealEmail] = useState("");
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
        setRealEmail(data.realEmail);
        setLoading(false); // Set loading to false after data is set
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);

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
        } else {
          console.error(data.message);
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
        } else {
          console.error(data.message);
        }
      });
  };

  const createNewAlias = () => {
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
        } else {
          console.error(data.message);
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow p-4 fixed w-full top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-center w-full">{realEmail}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white rounded-full px-4 py-2">
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 py-20">
        <div className="container mx-auto">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {aliases.map((alias) => (
              <div
                key={alias.id}
                className="border p-4 mb-4 rounded shadow-sm flex items-center justify-between">
                <button
                  onClick={() => toggleAlias(alias.alias_email)}
                  className={`px-4 py-2 rounded ${
                    alias.enable ? "bg-green-500" : "bg-red-500"
                  }`}>
                  {alias.enable ? "On" : "Off"}
                </button>
                <h2 className="font-bold text-lg mx-4 flex-1">
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

          <div className="text-center">
            <button
              onClick={createNewAlias}
              className="px-4 py-2 bg-blue-500 text-white rounded">
              Create New Alias
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
