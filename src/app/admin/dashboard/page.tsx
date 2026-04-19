"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import EventModal from "../../components/EventsModal";
import AppLayout from "@/app/components/AppLayout";

export default function Dashboard() {
  const API = "https://elevate.synetalsolutions.co/public/api/events";

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async (data: any) => {
    try {
      setLoading(true);
      await axios.post(API, data);
      await fetchEvents();
      setShowModal(false);
    } catch (err) {
      alert("Error creating event");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchEvents();
    } catch (err) {
      alert("Error deleting event");
    }
  };

  return (
    <AppLayout>
      <main className="relative min-h-screen px-6 py-10 overflow-hidden bg-gradient-to-b from-[#E9E8E1] via-[#D8D9CC] to-[#C8CABB] text-[#3E3E3E]">
        
        {/* Soft Background Glow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute w-[400px] h-[400px] bg-[#A2503B]/10 blur-[120px] top-[-100px] left-[-100px]" />
          <div className="absolute w-[300px] h-[300px] bg-[#C79693]/15 blur-[120px] bottom-[-100px] right-[-100px]" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex justify-between items-center mb-12 backdrop-blur-md bg-white/50 border border-white/40 px-6 py-4 rounded-2xl shadow-md">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-[#2F2F2F]">
              Event Manager
            </h1>
            <p className="text-[#6F6F6F] text-sm mt-1">
              Craft immersive event experiences effortlessly
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#A2503B] text-white px-6 py-3 rounded-xl font-medium hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            + New Event
          </button>
        </div>

        {/* Modal */}
        <EventModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={createEvent}
          loading={loading}
        />

        {/* Empty State */}
        {events.length === 0 && (
          <div className="relative z-10 flex flex-col items-center justify-center mt-32 text-center">
            <div className="w-24 h-24 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 flex items-center justify-center mb-6 text-3xl shadow-sm">
              ✨
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-[#2F2F2F]">
              No Events Yet
            </h2>
            <p className="text-[#6F6F6F] text-sm mb-6 max-w-sm">
              Start building your experience by creating your first event
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#A2503B] text-white px-6 py-2 rounded-lg hover:scale-105 transition"
            >
              Create Event
            </button>
          </div>
        )}

        {/* Events Grid */}
        <div className="relative z-10 grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-white/50 to-transparent"
            >
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 h-full border border-white/40 shadow-sm hover:shadow-md transition-all">
                
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-[#2F2F2F]">
                      {event.name}
                    </h2>
                    <p className="text-[#6F6F6F] text-sm mt-1">
                      {event.location}
                    </p>
                    <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-[#A2503B]/10 text-[#A2503B]">
                      {event.status}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="opacity-0 group-hover:opacity-100 transition text-[#999] hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>

                <div className="my-4 h-px bg-[#E0E0E0]" />

                <div className="flex items-center justify-between">
                  <div className="max-w-[60%]">
                    <p className="text-xs text-[#8A8A8A]">Access Link</p>
                    <p className="text-xs text-[#6F6F6F] mt-1 truncate">
                      /{event.slug}
                    </p>
                  </div>

                  <div className="relative">
                    <div className="relative bg-white p-2 rounded-lg shadow-md">
                      <img
                        src={`https://elevate.synetalsolutions.co/public/api/events/qr/${event.slug}`}
                        alt="Event QR"
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}