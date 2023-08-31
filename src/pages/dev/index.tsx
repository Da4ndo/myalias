import "../../app/globals.css";

import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Alias, User } from "../../shared/types";

export default function Dev() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [activePanel, setActivePanel] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [originalUsers, setOriginalUsers] = useState<User[]>([]);
  const [aliases, setAliases] = useState<Record<string, Alias[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookie.get("token");
      if (!token) {
        router.back();
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dev`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status != 200) {
          console.log(response)
          router.back();
        }
      }
    };
  
    fetchData();

    if (activePanel === "users") {
      fetchUsers();
    }

    if (activePanel === "aliases") {
      fetchAliases();
    }

    setLoading(false); // Set loading to false after data is set
  }, [router, activePanel]);

  const fetchUsers = async () => {
    const token = Cookie.get("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/dev/accounts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      setUsers(data.users);
      setOriginalUsers(data.users);
    }
  };

  const fetchAliases = async () => {
    const token = Cookie.get("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dev/aliases`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      setAliases(data.data);
    }
  };

  const toggleAlias = async (
    aliasEmail: string,
    realEmail: string,
    enable: boolean
  ) => {
    const token = Cookie.get("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/dev/aliases/manage`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aliasEmail, realEmail, enable }),
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      fetchAliases();
    }
  };

  const handleFilter = (filter: string) => {
    let filteredUsers = [...originalUsers];
    switch (filter) {
      case "plan":
        filteredUsers.sort((a, b) => a.plan.localeCompare(b.plan));
        break;
      case "notAccepted":
        filteredUsers = filteredUsers.filter((user) => !user.accepted);
        break;
      case "name":
        filteredUsers.sort((a, b) => a.username.localeCompare(b.username));
        break;
      case "email":
        filteredUsers.sort((a, b) => a.email.localeCompare(b.email));
        break;
      default:
        break;
    }
    setUsers(filteredUsers);
  };

  const handleLogout = () => {
    Cookie.remove("token");
    router.push("/login");
  };

  const handleDelete = async (email: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/dev/accounts/manage`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    if (response.ok) {
      // Refresh the user list after a user is deleted
      fetchUsers();
    }
  };

  const handleAccept = async (email: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/dev/accounts/accept`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    if (response.ok) {
      // Refresh the user list after a user is accepted
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-500 to-indigo-600">
      {/* Sidebar */}
      <div className="w-64 bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Dashboard</h1>
        <ul>
          <li
            className={`py-2 px-4 rounded-lg mb-2 cursor-pointer ${
              activePanel === "overview"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-blue-600"
            }`}
            onClick={() => setActivePanel("overview")}>
            Overview
          </li>
          <li
            className={`py-2 px-4 rounded-lg mb-2 cursor-pointer ${
              activePanel === "users"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-blue-600"
            }`}
            onClick={() => setActivePanel("users")}>
            Users
          </li>
          <li
            className={`py-2 px-4 rounded-lg mb-2 cursor-pointer ${
              activePanel === "aliases"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-blue-600"
            }`}
            onClick={() => setActivePanel("aliases")}>
            Aliases
          </li>
        </ul>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto rounded-l-xl">
        {activePanel === "overview" && <div>Overview Content</div>}
        {activePanel === "users" && (
          <div className="bg-white rounded-lg shadow-lg p-6 my-4 mx-auto w-full max-w-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <label htmlFor="filter" className="text-lg font-semibold text-gray-700">
                Filter:
              </label>
              <select
                id="filter"
                onChange={(e) => handleFilter(e.target.value)}
                className="border-2 border-gray-200 rounded-md p-2 focus:outline-none focus:border-blue-500 transition-colors duration-200 ease-in-out">
                <option value="">None</option>
                <option value="plan">Plan</option>
                <option value="notAccepted">Not Accepted</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
              </select>
            </div>
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white shadow-lg rounded px-4 pt-4 pb-4 mb-4 flex flex-col my-2 w-full mx-auto transition-all duration-200 ease-in-out transform hover:scale-105">
                <div className="mb-3">
                  <p className="text-gray-800 text-lg font-semibold">{user.username}</p>
                  <p className="text-gray-600 text-sm">{user.plan}</p>
                </div>
                <div className="pl-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1"
                    htmlFor="email">
                    Email
                  </label>
                  <p className="shadow appearance-none border rounded py-1 px-2 text-gray-700 w-full">
                    {user.email}
                  </p>
                </div>
                <div className="flex justify-end mt-2">
                  {!user.accepted && (
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded transition-colors duration-200 ease-in-out"
                      onClick={() => handleAccept(user.email)}>
                      Accept
                    </button>
                  )}
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ml-2 transition-colors duration-200 ease-in-out"
                    onClick={() => handleDelete(user.email)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {activePanel === "aliases" && (
          <div>
            {Object.keys(aliases).map((realEmail) => (
              <div
                key={realEmail}
                className="bg-white shadow-md rounded px-6 pt-6 pb-6 mb-3 flex flex-col my-3 w-full mx-auto transform transition duration-500 ease-in-out hover:scale-105">
                <div className="mb-3">
                  <p className="text-gray-800 text-lg font-semibold">{realEmail}</p>
                </div>
                <div className="pl-4">
                  {Array.isArray(aliases[realEmail]) &&
                    aliases[realEmail].map((alias) => (
                      <div
                        key={alias.alias_email}
                        className="flex items-center justify-between mb-2">
                        <p
                          key={alias.alias_email}
                          className="text-gray-600 text-md">
                          {alias.alias_email}
                        </p>
                        <button
                          onClick={() =>
                            toggleAlias(
                              alias.alias_email,
                              realEmail,
                              !alias.enable
                            )
                          }
                          className={`px-3 py-2 rounded text-white font-bold transition-colors duration-200 ease-in-out ${
                            alias.enable ? "bg-green-500 hover:bg-green-700" : "bg-red-500 hover:bg-red-700"
                          }`}>
                          {alias.enable ? "On" : "Off"}
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
