"use client";

import { useEffect } from "react";

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string; 
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString();
}

export default function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onMarkRead,
}: NotificationsModalProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#111118",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          width: 400,
          maxWidth: "90vw",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <p style={{ color: "white", fontWeight: 600, fontSize: 16, margin: 0 }}>
              Notifications
            </p>
            {unreadCount > 0 && (
              <span
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 99,
                  minWidth: 20,
                  height: 20,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 6px",
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#d3af37",
                fontSize: 12,
                padding: 0,
              }}
            >
              Mark all as read
            </button>
          )}
        </div>

        <div
          style={{
            padding: "8px",
            maxHeight: 360,
            overflowY: "auto",
          }}
        >
          {notifications.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 24px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, margin: 0 }}>
                You're all caught up!
              </p>
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, marginTop: 4, marginBottom: 0 }}>
                No new notifications.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => onMarkRead(notif.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    borderRadius: 10,
                    padding: "12px",
                    cursor: "pointer",
                    background: notif.read ? "transparent" : "rgba(255,255,255,0.05)",
                    border: notif.read ? "none" : "none",
                    borderLeft: notif.read ? "2px solid transparent" : "2px solid #d3af37",
                    transition: "background 0.15s",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = notif.read
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = notif.read
                      ? "transparent"
                      : "rgba(255,255,255,0.05)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {!notif.read && (
                        <span
                          style={{
                            flexShrink: 0,
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "#ef4444",
                            marginTop: 4,
                          }}
                        />
                      )}
                      <p
                        style={{
                          fontSize: 14,
                          margin: 0,
                          color: notif.read ? "rgba(255,255,255,0.5)" : "white",
                          paddingLeft: notif.read ? 16 : 0,
                          wordBreak: "break-word",
                        }}
                      >
                        {notif.message}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.3)",
                        flexShrink: 0,
                        margin: 0,
                        paddingTop: 2,
                      }}
                    >
                      {formatTime(notif.createdAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              backgroundColor: "transparent",
              color: "rgba(255,255,255,0.5)",
              fontSize: 13,
              cursor: "pointer",
              width: "100%",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}