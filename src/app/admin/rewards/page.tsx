"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import RewardModal from "../../components/RewardModal";
import AppLayout from "@/app/components/AppLayout";

export default function RewardsPage() {
  const API = "https://elevate.synetalsolutions.co/public/api/rewards";

  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchRewards = async () => {
    const res = await axios.get(API);
    setRewards(res.data);
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const createReward = async (data: any) => {
    try {
      setLoading(true);
      await axios.post(API, data);
      fetchRewards();
      setShowModal(false);
    } catch (err) {
      alert("Error creating reward");
    } finally {
      setLoading(false);
    }
  };

  const deleteReward = async (id: number) => {
    await axios.delete(`${API}/${id}`);
    fetchRewards();
  };

  return (
    <AppLayout>
      <main
        className="relative min-h-screen px-6 py-10 overflow-hidden    bg-gradient-to-b from-[#E9E8E1] via-[#D8D9CC] to-[#C8CABB] text-[#3E3E3E]"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute w-[400px] h-[400px] bg-[#A2503B]/10 blur-[120px] top-[-100px] left-[-100px]" />
          <div className="absolute w-[300px] h-[300px] bg-[#C79693]/15 blur-[120px] bottom-[-100px] right-[-100px]" />
        </div>

        {/* Header */}
        <div
          className="relative z-10 flex justify-between items-center mb-12       backdrop-blur-md bg-white/50 border border-white/40 px-6 py-4 rounded-2xl shadow-md"
        >
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-[#2F2F2F]">
              Rewards Manager
            </h1>
            <p className="text-[#6F6F6F] text-sm mt-1">
              Design and manage user rewards effortlessly
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#A2503B] text-white px-6 py-3 rounded-xl font-medium           hover:scale-105 active:scale-95 transition-all duration-200  shadow-md hover:shadow-lg"
          >
            + New Reward
          </button>
        </div>

        {/* Modal */}
        <RewardModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={createReward}
          loading={loading}
        />

        {/* Empty State */}
        {rewards.length === 0 && (
          <div className="relative z-10 flex flex-col items-center justify-center mt-32 text-center">
            <div className="w-24 h-24 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 flex items-center justify-center mb-6 text-3xl shadow-sm">
              🎁
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-[#2F2F2F]">
              No Rewards Yet
            </h2>
            <p className="text-[#6F6F6F] text-sm mb-6 max-w-sm">
              Create rewards to engage and motivate your users
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#A2503B] text-white px-6 py-2 rounded-lg hover:scale-105 transition"
            >
              Create Reward
            </button>
          </div>
        )}

        {/* Rewards Grid */}
        <div className="relative z-10 grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="group relative rounded-2xl p-[1px]    bg-gradient-to-br from-white/50 to-transparent"
            >
              <div
                className="bg-white/70 backdrop-blur-md rounded-2xl p-5 h-full              border border-white/40 shadow-sm hover:shadow-md transition-all"
              >
                {/* Top */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-[#2F2F2F]">
                      {reward.title}
                    </h2>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteReward(reward.id)}
                    className="opacity-0 group-hover:opacity-100 transition text-[#999] hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>

                {/* Divider */}
                <div className="my-4 h-px bg-[#E0E0E0]" />

                {/* Description */}
                <p className="text-sm text-[#6F6F6F] leading-relaxed">
                  {reward.description || "No description provided"}
                </p>

                {/* Footer */}
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-xs text-[#8A8A8A]">
                    Reward ID: {reward.id}
                  </span>

                  <div className="text-lg opacity-70">🎁</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}