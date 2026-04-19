"use client";

import { useEffect, useState } from "react";

type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
};

export default function RewardModal({
  show,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
    });
  };

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center     bg-[#00000020] backdrop-blur-sm">

      <div className="w-full max-w-xl h-auto rounded-3xl       bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center         px-6 py-4 border-b border-[#E5E5E5] bg-white/60 backdrop-blur-md rounded-t-3xl">
          
          <h2 className="text-lg font-semibold text-[#2F2F2F]">
            Create Reward
          </h2>

          <button onClick={onClose} className="text-[#888] hover:text-[#A2503B]">
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 space-y-5 text-[#3E3E3E]">

          <input
            className="input"
            placeholder="Reward Name"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="input min-h-[120px]"
            placeholder="Reward Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

        </div>

        {/* FOOTER */}
        <div className="flex gap-3 p-4 border-t border-[#E5E5E5]         bg-white/60 backdrop-blur-md rounded-b-3xl">
          
          <button
            onClick={onClose}
            className="flex-1 border border-[#DADADA] py-3 rounded-xl             text-[#555] hover:bg-white/60 transition"
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
            className="flex-1 bg-[#A2503B] text-white py-3 rounded-xl             font-medium hover:scale-[1.02] transition shadow-md"
          >
            {loading ? "Saving..." : "Create Reward"}
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
      `}</style>
    </div>
  );
}