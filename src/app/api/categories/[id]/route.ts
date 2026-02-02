import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const params = await props.params;
    const category = await Category.findById(params.id);
    if (!category)
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const params = await props.params;
    const body = await req.json();

    // Update slug if name changes and slug isn't manually provided
    if (body.name && !body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }

    const category = await Category.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!category)
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const params = await props.params;
    const category = await Category.findByIdAndDelete(params.id);
    if (!category)
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
