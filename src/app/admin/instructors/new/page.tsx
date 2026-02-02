import React from "react";
import { InstructorForm } from "@/components/instructors/InstructorForm";

export default function NewInstructorPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <InstructorForm />
    </div>
  );
}
