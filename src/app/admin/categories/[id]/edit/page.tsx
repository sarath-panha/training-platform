import React from "react";
import { CategoryForm } from "@/components/categories/CategoryForm";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

async function getCategory(id: string) {
  await connectDB();
  const category = await Category.findById(id).lean();
  if (!category) return null;
  return { ...category, _id: category._id.toString() };
}

export default async function EditCategoryPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const category = await getCategory(params.id);
  if (!category) return <div>Category not found</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <CategoryForm initialData={category} />
    </div>
  );
}
