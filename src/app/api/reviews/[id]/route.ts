import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Review";

// Update Status (Approve/Reject)
export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const params = await props.params;
    const { status } = await req.json();

    const review = await Review.findByIdAndUpdate(
      params.id,
      { status },
      { new: true },
    );

    if (!review)
      return NextResponse.json({ error: "Review not found" }, { status: 404 });

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// Delete Review
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const params = await props.params;

    const review = await Review.findByIdAndDelete(params.id);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
