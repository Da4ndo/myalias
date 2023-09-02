"use client";

import "../../../globals.css";

import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Alias, User } from "../../../../shared/types";

export default function Dev() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [originalUsers, setOriginalUsers] = useState<User[]>([]);
  const [aliases, setAliases] = useState<Record<string, Alias[]>>({});

  const [activePanel, setActivePanel] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // setLoading(false); // For Development
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
          router.back();
        } else {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [router]);

  useEffect(() => {
    if (activePanel === "users") {
      fetchUsers();
    }

    if (activePanel === "aliases") {
      fetchAliases();
    }
  }, [activePanel]);

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

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleDelete = async (email: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/dev/accounts/manage`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookie.get("token")}`,
        },
        body: JSON.stringify({ email }),
      }
    );
    if (response.ok) {
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
          Authorization: `Bearer ${Cookie.get("token")}`,
        },
        body: JSON.stringify({ email }),
      }
    );
    if (response.ok) {
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gradient-to-r from-blue-500 to-indigo-600 items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-500 to-indigo-600">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden p-4 bg-white rounded-full shadow-md absolute top-4 left-4 z-50">
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white p-6 shadow-md transform md:transform-none transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static h-full md:h-auto z-40`}>
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Dashboard</h1>
        <ul>
          {["overview", "users", "aliases"].map((panel) => (
            <li
              key={panel}
              className={`py-2 px-4 rounded-lg mb-2 cursor-pointer ${
                activePanel === panel
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 text-blue-600"
              }`}
              onClick={() => setActivePanel(panel)}>
              {capitalizeFirstLetter(panel)}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto rounded-l-xl ml-0">
        {/* Display content based on active panel */}
        {activePanel === "overview" && <div>Overview Content</div>}

        {activePanel === "users" && (
          <div className="bg-white rounded-lg shadow-lg p-6 my-4 mx-auto md:w-9/10 lg:w-9/10 xl:w-9/10 2xl:w-9/10">
            <div className="flex items-center space-x-4 mb-6">
              <label
                htmlFor="filter"
                className="text-lg font-semibold text-gray-700">
                Filter:
              </label>
              <select
                id="filter"
                onChange={(e) => handleFilter(e.target.value)}
                className="border-2 border-gray-200 rounded-md p-2 focus:outline-none focus:border-blue-500 transition-colors duration-200 ease-in-out w-1/2">
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
                className="bg-white shadow-lg rounded p-4 mb-6 flex flex-col transition-all duration-200 ease-in-out transform hover:scale-105 z-10">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-800 text-lg font-semibold">
                    {user.username}
                  </p>
                  <p className="text-gray-600 text-sm">{user.plan}</p>
                </div>
                <div className="pl-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email">
                    Email
                  </label>
                  <p className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full">
                    {user.email}
                  </p>
                </div>
                <div className="flex justify-end mt-3">
                  {!user.accepted && (
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded transition-colors duration-200 ease-in-out"
                      onClick={() => handleAccept(user.email)}>
                      Accept
                    </button>
                  )}
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded ml-3 transition-colors duration-200 ease-in-out"
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
                className="bg-white shadow-md rounded px-6 py-6 mb-4 transform transition duration-500 ease-in-out hover:scale-105">
                <p className="text-gray-800 text-lg font-semibold mb-4">
                  {realEmail}
                </p>

                {Array.isArray(aliases[realEmail]) &&
                  aliases[realEmail].map((alias) => (
                    <div
                      key={alias.alias_email}
                      className="flex items-center justify-between mb-3">
                      <p className="text-gray-600">{alias.alias_email}</p>
                      <button
                        onClick={() =>
                          toggleAlias(
                            alias.alias_email,
                            realEmail,
                            !alias.enable
                          )
                        }
                        className={`px-4 py-2 rounded font-bold transition-colors duration-200 ${
                          alias.enable
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}>
                        {alias.enable ? "On" : "Off"}
                      </button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
