"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { CategoriesTable } from "@/components/categories/CategoriesTable";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { SlideOver } from "@/components/ui/SlideOver";

// Filter Types
type FilterType = "all" | "course" | "event" | "user";

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Courses", value: "course" },
  { label: "Events", value: "event" },
  { label: "Participants", value: "user" },
];

export default function CategoriesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Off-Canvas State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // If 'all', don't send type param, API should handle returning all
      const query = activeFilter === "all" ? "" : `?type=${activeFilter}`;
      const res = await fetch(`/api/categories${query}`);
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [activeFilter]);

  const handleCreate = () => {
    setEditingCategory(null); // Reset for create mode
    setIsFormOpen(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchCategories(); // Refresh table
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-end md:items-center mb-8">
        <div>
          <h2 className="text-2xl font-light text-slate-900">Categories</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage global taxonomy for the platform.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="h-[42px] px-5 bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 text-sm font-bold rounded-lg transition-colors shadow-lg shadow-slate-900/20"
        >
          <Plus className="w-4 h-4" /> <span>Add Category</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`
              px-4 py-2 text-sm font-medium rounded-full transition-all border
              ${
                activeFilter === filter.value
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
          <div className="animate-spin w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full"></div>
        </div>
      ) : (
        <CategoriesTable categories={categories} onEdit={handleEdit} />
      )}

      {/* Off-Canvas Form */}
      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingCategory ? "Edit Category" : "Create New Category"}
      >
        <CategoryForm
          initialData={editingCategory}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </SlideOver>
    </div>
  );
}
