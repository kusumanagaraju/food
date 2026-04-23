"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Users, ReceiptText } from "lucide-react";

export default function SubAdminPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"users" | "orders">("users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "Sub-admin") {
        router.push("/login");
      }
    }
  }, [user, isLoading, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "users" ? "/api/users" : "/api/orders";
      const response = await axios.get(`http://localhost:5000${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (error) {
      toast.error(`Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "Sub-admin") {
      fetchData();
    }
  }, [activeTab, user]);

  if (isLoading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Sub-Admin Dashboard</h1>
          <p className="text-gray-500">Monitor users and orders (Read Only)</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "users"
                ? "bg-black text-white dark:bg-white dark:text-black shadow-lg"
                : "bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Users className="w-5 h-5" /> Users
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "orders"
                ? "bg-black text-white dark:bg-white dark:text-black shadow-lg"
                : "bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <ReceiptText className="w-5 h-5" /> Orders
          </button>
        </div>

        {/* Data Grid */}
        <div className="bg-white dark:bg-white/5 rounded-3xl p-6 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="text-center py-10">Loading data...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  {activeTab === "users" ? (
                    <>
                      <th className="py-4 px-4">Name</th>
                      <th className="py-4 px-4">Email</th>
                      <th className="py-4 px-4">Role</th>
                    </>
                  ) : (
                    <>
                      <th className="py-4 px-4">Order ID</th>
                      <th className="py-4 px-4">Total Price</th>
                      <th className="py-4 px-4">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((item: any) => (
                  <tr key={item._id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    {activeTab === "users" ? (
                      <>
                        <td className="py-4 px-4 font-medium">{item.name}</td>
                        <td className="py-4 px-4 text-gray-500">{item.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            item.role === 'Admin' ? 'bg-red-100 text-red-600' : 
                            item.role === 'Sub-admin' ? 'bg-blue-100 text-blue-600' : 
                            'bg-green-100 text-green-600'
                          }`}>
                            {item.role}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-4 font-medium font-mono text-sm">{item._id}</td>
                        <td className="py-4 px-4 font-bold text-[var(--color-primary)]">₹{item.totalPrice}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                            {item.status}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && data.length === 0 && (
            <div className="text-center py-10 text-gray-500">No data found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
