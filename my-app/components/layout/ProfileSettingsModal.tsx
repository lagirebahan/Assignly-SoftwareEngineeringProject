"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ProfileUser {
  name: string;
  email: string;
  emailNotifications?: boolean;
  twoFactorEnabled?: boolean;
}

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "profile" | "settings";
  user: ProfileUser | null;
}

export default function ProfileSettingsModal({
  isOpen, onClose, defaultTab = "profile", user,
}: ProfileSettingsModalProps) {
  const [selectedTab, setSelectedTab] = useState<"profile" | "settings">(defaultTab);
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => { if (isOpen) setSelectedTab(defaultTab); }, [isOpen, defaultTab]);
  useEffect(() => {
    if (user?.name) setDisplayName(user.name);
    setEmailNotifs(user?.emailNotifications ?? true);
    setTwoFactor(user?.twoFactorEnabled ?? false);
  }, [user?.name, user?.emailNotifications, user?.twoFactorEnabled]);

  const handleSave = async () => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    await fetch("/api/user/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: stored.id, name: displayName, emailNotifications: emailNotifs, twoFactorEnabled: twoFactor }),
    });
    localStorage.setItem("user", JSON.stringify({ ...stored, name: displayName, emailNotifications: emailNotifs }));
    onClose();
  };

  if (!isOpen) return null;

  const tabClass = (active: boolean) =>
    `flex-1 py-3 font-bold text-sm cursor-pointer border-none bg-transparent tracking-[0.05em] transition-colors duration-200
    ${active ? "border-b-2 border-[#d3af37] text-white" : "border-b-2 border-transparent text-white/40"}`;

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="w-11 h-6 rounded-full border-none cursor-pointer relative transition-colors duration-200"
      style={{ backgroundColor: value ? "#d3af37" : "rgba(255,255,255,0.15)" }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200"
        style={{ left: value ? 22 : 2 }}
      />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div
        className="bg-[#111118] border border-white/10 rounded-2xl w-[480px] max-w-[90vw] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 flex items-center justify-between">
          <p className="text-white font-semibold text-base m-0">Account</p>
          <button onClick={onClose} className="bg-none border-none cursor-pointer text-white/40 text-xl leading-none">×</button>
        </div>

        <div className="flex border-b border-white/10 mt-4 px-6">
          <button className={tabClass(selectedTab === "profile")} onClick={() => setSelectedTab("profile")}>My Profile</button>
          <button className={tabClass(selectedTab === "settings")} onClick={() => setSelectedTab("settings")}>Settings</button>
        </div>

        <div className="p-6">
          {selectedTab === "profile" ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3.5">
                <Image src="/default_profile.png" alt="avatar" width={52} height={52} className="rounded-full border-2 border-white/20" />
                <div>
                  <p className="text-white font-medium text-sm m-0">{user?.name || "User"}</p>
                  <p className="text-white/40 text-xs m-0">{user?.email || "—"}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 block mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-white/15 bg-white/5 text-white text-sm outline-none box-border"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 block mb-1.5">Email</label>
                <input
                  type="text"
                  value={user?.email || ""}
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-white/[0.08] bg-white/[0.03] text-white/35 text-sm outline-none box-border cursor-not-allowed"
                />
                <p className="text-[11px] text-white/25 mt-1">Contact support to change your email.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm m-0">Email Notifications</p>
                  <p className="text-white/35 text-xs mt-0.5 mb-0">Receive updates via email</p>
                </div>
                <Toggle value={emailNotifs} onToggle={() => setEmailNotifs((v) => !v)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm m-0">Two-Factor Authentication</p>
                  <p className="text-white/35 text-xs mt-0.5 mb-0">Add an extra layer of security</p>
                </div>
                <Toggle value={twoFactor} onToggle={() => setTwoFactor((v) => !v)} />
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-white/25 mb-2.5">Danger Zone</p>
                <button
                  className="px-4 py-2 rounded-lg border border-red-500/40 bg-transparent text-red-400 text-[13px] cursor-pointer"
                  onClick={async () => {
                    if (!confirm("Are you sure? This cannot be undone.")) return;
                    const stored = JSON.parse(localStorage.getItem("user") || "{}");
                    await fetch(`/api/user/delete`, {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: stored.id }),
                    });
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-2.5">
          <button onClick={onClose} className="py-2 px-5 rounded-lg border border-white/15 bg-transparent text-white/50 text-[13px] cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSave} className="py-2 px-5 rounded-lg border-none bg-[#d3af37] text-black font-bold text-[13px] cursor-pointer">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}