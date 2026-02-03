import React from "react";
import { EventForm } from "@/components/events/EventForm";
import connectDB from "@/lib/db";
import Event from "@/models/Event";

async function getEvent(id: string) {
  await connectDB();
  const event = await Event.findById(id).lean();
  if (!event) return null;
  return {
    ...event,
    _id: event._id.toString(),
    category: event.category?.toString(),
  };
}

export default async function EditEventPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const event = await getEvent(params.id);
  if (!event) return <div>Event not found</div>;
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <EventForm initialData={event} />
    </div>
  );
}
