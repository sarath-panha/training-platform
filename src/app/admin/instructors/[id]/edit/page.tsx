import React from "react";
import { InstructorForm } from "@/components/instructors/InstructorForm";
import connectDB from "@/lib/db";
import Instructor from "@/models/Instructor";

async function getInstructor(id: string) {
  await connectDB();
  const instructor = await Instructor.findById(id).lean();
  if (!instructor) return null;
  return { ...instructor, _id: instructor._id.toString() };
}

export default async function EditInstructorPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const instructor = await getInstructor(params.id);
  if (!instructor) return <div>Instructor not found</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <InstructorForm initialData={instructor} />
    </div>
  );
}
