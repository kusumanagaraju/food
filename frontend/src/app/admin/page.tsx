"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Store, Pizza, Plus, Trash2, Edit } from "lucide-react";
import Image from "next/image";

export default function AdminPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"restaurants" | "foods">("restaurants");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [allRestaurants, setAllRestaurants] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "Admin") {
        router.push("/login");
      }
    }
  }, [user, isLoading, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "restaurants" ? "/api/restaurants" : "/api/foods";
      const response = await axios.get(`http://localhost:5000${endpoint}`);
      setData(response.data);

      if (activeTab === "foods") {
        const resData = await axios.get("http://localhost:5000/api/restaurants");
        setAllRestaurants(resData.data);
      }
    } catch (error) {
      toast.error(`Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "Admin") {
      fetchData();
      setShowForm(false);
      setFormData({});
    }
  }, [activeTab, user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const endpoint = activeTab === "restaurants" ? `/api/restaurants/${id}` : `/api/foods/${id}`;
      await axios.delete(`http://localhost:5000${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = activeTab === "restaurants" ? "/api/restaurants" : "/api/foods";
      
      if (formData._id) {
        // Update
        await axios.put(`http://localhost:5000${endpoint}/${formData._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Updated successfully");
      } else {
        // Create
        await axios.post(`http://localhost:5000${endpoint}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Created successfully");
      }
      setShowForm(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  if (isLoading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your platform's data</p>
          </div>
          <button
            onClick={() => {
              setFormData({});
              setShowForm(true);
            }}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            <Plus className="w-5 h-5" /> Add New
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("restaurants")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "restaurants"
                ? "bg-black text-white dark:bg-white dark:text-black shadow-lg"
                : "bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Store className="w-5 h-5" /> Restaurants
          </button>
          <button
            onClick={() => setActiveTab("foods")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "foods"
                ? "bg-black text-white dark:bg-white dark:text-black shadow-lg"
                : "bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Pizza className="w-5 h-5" /> Food Items
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">
                {formData._id ? "Edit" : "Add"} {activeTab === "restaurants" ? "Restaurant" : "Food"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {activeTab === "restaurants" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <input
                        type="text"
                        required
                        value={formData.address || ""}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <input
                        type="text"
                        value={formData.imageUrl || ""}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={formData.price || ""}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <input
                        type="text"
                        required
                        value={formData.category || ""}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <input
                        type="text"
                        required
                        value={formData.image || ""}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Restaurant</label>
                      <select
                        required
                        value={formData.restaurantId || (typeof formData.restaurantId === 'object' ? formData.restaurantId._id : "")}
                        onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white text-black"
                      >
                        <option value="">Select Restaurant</option>
                        {allRestaurants.map((r: any) => (
                          <option key={r._id} value={r._id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2 bg-gray-100 dark:bg-white/10 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] font-medium"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Data Grid */}
        <div className="bg-white dark:bg-white/5 rounded-3xl p-6 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="text-center py-10">Loading data...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="py-4 px-4">Name</th>
                  <th className="py-4 px-4">{activeTab === "restaurants" ? "Address" : "Price"}</th>
                  <th className="py-4 px-4">Rating</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any) => (
                  <tr key={item._id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-medium flex items-center gap-3">
                      {(item.image || item.imageUrl) && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden relative">
                          <Image src={item.image || item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                      )}
                      {item.name}
                    </td>
                    <td className="py-4 px-4 text-gray-500">
                      {activeTab === "restaurants" ? item.address : `₹${item.price}`}
                    </td>
                    <td className="py-4 px-4">⭐ {item.rating}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setFormData(item);
                            setShowForm(true);
                          }}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && data.length === 0 && (
            <div className="text-center py-10 text-gray-500">No data found. Add some!</div>
          )}
        </div>
      </div>
    </div>
  );
}
