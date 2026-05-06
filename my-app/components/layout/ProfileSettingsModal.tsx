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
  isOpen,
  onClose,
  defaultTab = "profile",
  user,
}: ProfileSettingsModalProps) {
  const [selectedTab, setSelectedTab] = useState<"profile" | "settings">(defaultTab);
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    if (isOpen) setSelectedTab(defaultTab);
  }, [isOpen, defaultTab]);

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
      body: JSON.stringify({ 
        id: stored.id, 
        name: displayName,
        emailNotifications: emailNotifs,
        twoFactorEnabled: twoFactor,
      }),
    });

    localStorage.setItem("user", JSON.stringify({ 
      ...stored, 
      name: displayName,
      emailNotifications: emailNotifs,
    }));

    onClose();
  };


  if (!isOpen) return null;

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "12px 0",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    border: "none",
    borderBottom: active ? "2px solid #d3af37" : "2px solid transparent",
    backgroundColor: "transparent",
    color: active ? "#ffffff" : "rgba(255,255,255,0.4)",
    letterSpacing: "0.05em",
    transition: "color 0.2s, border-color 0.2s",
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#111118",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          width: 480,
          maxWidth: "90vw",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: "20px 24px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <p style={{ color: "white", fontWeight: 600, fontSize: 16, margin: 0 }}>Account</p>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 20, lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.1)", margin: "16px 0 0", padding: "0 24px" }}>
          <button style={tabStyle(selectedTab === "profile")} onClick={() => setSelectedTab("profile")}>My Profile</button>
          <button style={tabStyle(selectedTab === "settings")} onClick={() => setSelectedTab("settings")}>Settings</button>
        </div>

        <div style={{ padding: "24px" }}>
          {selectedTab === "profile" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Image
                  src="/default_profile.png"
                  alt="avatar"
                  width={52}
                  height={52}
                  style={{ borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)" }}
                />
                <div>
                  <p style={{ color: "white", fontWeight: 500, fontSize: 14, margin: 0 }}>{user?.name || "User"}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0 }}>{user?.email || "—"}</p>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.15)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: "white",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Email</label>
                <input
                  type="text"
                  value={user?.email || ""}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.08)",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    color: "rgba(255,255,255,0.35)",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    cursor: "not-allowed",
                  }}
                />
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>Contact support to change your email.</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "white", fontSize: 14, margin: 0 }}>Email Notifications</p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: "2px 0 0" }}>Receive updates via email</p>
                </div>
                <button
                  onClick={() => setEmailNotifs((v) => !v)}
                  style={{
                    width: 44, height: 24, borderRadius: 12,
                    backgroundColor: emailNotifs ? "#d3af37" : "rgba(255,255,255,0.15)",
                    border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
                  }}
                >
                  <span style={{
                    position: "absolute", top: 2,
                    left: emailNotifs ? 22 : 2,
                    width: 20, height: 20, borderRadius: "50%",
                    backgroundColor: "white", transition: "left 0.2s",
                  }} />
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "white", fontSize: 14, margin: 0 }}>Two-Factor Authentication</p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: "2px 0 0" }}>Add an extra layer of security</p>
                </div>
                <button
                  onClick={() => setTwoFactor((v) => !v)}
                  style={{
                    width: 44, height: 24, borderRadius: 12,
                    backgroundColor: twoFactor ? "#d3af37" : "rgba(255,255,255,0.15)",
                    border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
                  }}
                >
                  <span style={{
                    position: "absolute", top: 2,
                    left: twoFactor ? 22 : 2,
                    width: 20, height: 20, borderRadius: "50%",
                    backgroundColor: "white", transition: "left 0.2s",
                  }} />
                </button>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>Danger Zone</p>
                <button
                  style={{
                    padding: "8px 16px", borderRadius: 8,
                    border: "1px solid rgba(239,68,68,0.4)",
                    backgroundColor: "transparent",
                    color: "#f87171", fontSize: 13, cursor: "pointer",
                  }}
                  onClick={async() => {       
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

        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
        }}>
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px", borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              backgroundColor: "transparent",
              color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "9px 20px", borderRadius: 8,
              border: "none",
              backgroundColor: "#d3af37",
              color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}