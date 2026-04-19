"use client";

import { useState, useEffect } from "react";

type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
};

export default function EventModal({
  show,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    primary_color: "#C79693",
    background_color: "#E9E8E1",
    start_time: "",
    end_time: "",
    status: "draft",
    reward_message: "",
    experiences: [
      { title: "Ground", desc: "Stability & calm" },
      { title: "Align", desc: "Balance & clarity" },
      { title: "Elevate", desc: "Energy & growth" },
    ],
  });

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      location: "",
      primary_color: "#C79693",
      background_color: "#E9E8E1",
      start_time: "",
      end_time: "",
      status: "draft",
      reward_message: "",
      experiences: [
        { title: "Ground", desc: "Stability & calm" },
        { title: "Align", desc: "Balance & clarity" },
        { title: "Elevate", desc: "Energy & growth" },
      ],
    });
  };

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000020] backdrop-blur-sm">

      <div className="w-full max-w-3xl h-[90vh] rounded-3xl  bg-white/70 backdrop-blur-xl border border-white/40       shadow-xl flex flex-col">

        {/* HEADER */}
        <div className="sticky top-0 z-10 flex justify-between items-center         px-6 py-4 border-b border-[#E5E5E5] bg-white/60 backdrop-blur-md rounded-t-3xl">
          
          <h2 className="text-lg font-semibold text-[#2F2F2F]">
            Create Event
          </h2>

          <button onClick={onClose} className="text-[#888] hover:text-[#A2503B]">
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 custom-scroll text-[#3E3E3E]">

          <input
            className="input"
            placeholder="Event Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            className="input"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-xs text-[#6F6F6F] mb-1 block">
                Primary Color
              </label>

              <div className="flex items-center gap-3 bg-white/70 border border-[#E0E0E0] rounded-xl px-3 py-2">
                <div className="relative w-8 h-8">
                  <div
                    className="w-8 h-8 rounded-full border border-white"
                    style={{ backgroundColor: form.primary_color }}
                  />
                  <input
                    type="color"
                    value={form.primary_color}
                    onChange={(e) =>
                      setForm({ ...form, primary_color: e.target.value })
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                <input
                  className="bg-transparent outline-none text-sm w-full"
                  value={form.primary_color}
                  onChange={(e) =>
                    setForm({ ...form, primary_color: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#6F6F6F] mb-1 block">
                Background Color
              </label>

              <div className="flex items-center gap-3 bg-white/70 border border-[#E0E0E0] rounded-xl px-3 py-2">
                <div className="relative w-8 h-8">
                  <div
                    className="w-8 h-8 rounded-full border border-white"
                    style={{ backgroundColor: form.background_color }}
                  />
                  <input
                    type="color"
                    value={form.background_color}
                    onChange={(e) =>
                      setForm({ ...form, background_color: e.target.value })
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                <input
                  className="bg-transparent outline-none text-sm w-full"
                  value={form.background_color}
                  onChange={(e) =>
                    setForm({ ...form, background_color: e.target.value })
                  }
                />
              </div>
            </div>

          </div>

          <input
            type="datetime-local"
            className="input"
            value={form.start_time}
            onChange={(e) =>
              setForm({ ...form, start_time: e.target.value })
            }
          />

          <input
            type="datetime-local"
            className="input"
            value={form.end_time}
            onChange={(e) =>
              setForm({ ...form, end_time: e.target.value })
            }
          />

          <select
            className="input"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <textarea
            className="input"
            placeholder="Reward Message"
            value={form.reward_message}
            onChange={(e) =>
              setForm({ ...form, reward_message: e.target.value })
            }
          />

        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 flex gap-3 p-4 border-t border-[#E5E5E5] bg-white/60 backdrop-blur-md rounded-b-3xl">
          
          <button
            onClick={onClose}
            className="flex-1 border border-[#DADADA] py-3 rounded-xl text-[#555] hover:bg-white/60"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              await onSubmit(form);
              resetForm();
              onClose();
            }}
            disabled={loading}
            className="flex-1 bg-[#A2503B] text-white py-3 rounded-xl font-medium             hover:scale-[1.02] transition shadow-md"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>

      </div>

      {/* STYLES */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(200, 202, 187, 0.6);
          color: #3e3e3e;
          outline: none;
        }

        .input::placeholder {
          color: #8a8a8a;
        }

        .input:focus {
          border-color: #a2503b;
          box-shadow: 0 0 0 3px rgba(162, 80, 59, 0.15);
        }

        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(162, 80, 59, 0.25);
          border-radius: 10px;
        }

        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(162, 80, 59, 0.4);
        }
      `}</style>
    </div>
  );
}