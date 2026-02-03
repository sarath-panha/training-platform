import React from "react";
import { EventForm } from "@/components/events/EventForm";

export default function NewEventPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <EventForm />
    </div>
  );
}
