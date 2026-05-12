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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200000]" onClick={onClose}>
      <div
        className="bg-[#111118] border border-white/10 rounded-2xl w-[400px] max-w-[90vw] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.5)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold text-base m-0">Notifications</p>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 inline-flex items-center justify-center px-1.5">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead} className="bg-none border-none cursor-pointer text-[#d3af37] text-xs p-0">
              Mark all as read
            </button>
          )}
        </div>

        <div className="p-2 max-h-[360px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <p className="text-white/30 text-sm m-0">You're all caught up!</p>
              <p className="text-white/20 text-xs mt-1 mb-0">No new notifications.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => onMarkRead(notif.id)}
                  className="w-full text-left rounded-[10px] p-3 cursor-pointer border-none box-border transition-colors duration-150"
                  style={{
                    background: notif.read ? "transparent" : "rgba(255,255,255,0.05)",
                    borderLeft: notif.read ? "2px solid transparent" : "2px solid #d3af37",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = notif.read
                      ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = notif.read
                      ? "transparent" : "rgba(255,255,255,0.05)";
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      {!notif.read && (
                        <span className="shrink-0 w-2 h-2 rounded-full bg-red-500 mt-1" />
                      )}
                      <p
                        className="text-sm m-0 break-words"
                        style={{
                          color: notif.read ? "rgba(255,255,255,0.5)" : "white",
                          paddingLeft: notif.read ? 16 : 0,
                        }}
                      >
                        {notif.message}
                      </p>
                    </div>
                    <p className="text-xs text-white/30 shrink-0 m-0 pt-0.5">
                      {formatTime(notif.createdAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex justify-end">
          <button onClick={onClose} className="py-2 px-5 rounded-lg border border-white/15 bg-transparent text-white/50 text-[13px] cursor-pointer w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}