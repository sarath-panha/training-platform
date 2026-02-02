import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CategoriesTable } from "@/components/categories/CategoriesTable";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

async function getCategories() {
  await connectDB();
  const categories = await Category.find({}).sort({ name: 1 }).lean();
  return categories.map((c: any) => ({ ...c, _id: c._id.toString() }));
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-light text-slate-900">Categories</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage course topics and taxonomy.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/categories/new"
            className="h-[42px] px-4 bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> <span>Add Category</span>
          </Link>
        </div>
      </div>
      <CategoriesTable categories={categories} />
    </div>
  );
}
