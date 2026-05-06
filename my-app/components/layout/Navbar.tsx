"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";

import ProfileSettingsModal from "./ProfileSettingsModal";
import NotificationsModal, { AppNotification } from "./NotificationsModal";

export const AssignlyLogo = () => (
  <Image src="/icon.png" alt="Assignly Logo" width={36} height={36} priority />
);

type PendingAction = "profile" | "settings" | "notifications" | null;

export default function AppNavbar() {
  const pathname = usePathname();

  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileDefaultTab, setProfileDefaultTab] = useState<"profile" | "settings">("profile");
  const [notifOpen, setNotifOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/notifications?userId=${user.id}`)
      .then((res) => res.json())
      .then((data: AppNotification[]) => setNotifications(data))
      .catch(() => {});
  }, [user?.id]);

  useEffect(() => {
    if (!dropdownOpen && pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      setTimeout(() => {
        if (action === "profile") {
          setProfileDefaultTab("profile");
          setProfileOpen(true);
        } else if (action === "settings") {
          setProfileDefaultTab("settings");
          setProfileOpen(true);
        } else if (action === "notifications") {
          setNotifOpen(true);
        }
      }, 50);
    }
  }, [dropdownOpen, pendingAction]);

  const handleMarkRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n))
      );
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await Promise.all(
        unread.map((n) =>
          fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notificationId: n.id }),
          })
        )
      );
    } catch {
      setNotifications((prev) =>
        prev.map((n) =>
          unread.find((u) => u.id === n.id) ? { ...n, read: false } : n
        )
      );
    }
  };

  

  return (
    <>
      <Navbar maxWidth="xl" className="flex items-center">

        {/*left*/}
        <NavbarContent className="flex justify-start">
          <NavbarBrand className="gap-2">
            <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <AssignlyLogo />
              <p className="font-bold text-inherit">Assignly</p>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        {/*tengah */}
        <NavbarContent className="hidden sm:flex gap-4 absolute left-1/2 -translate-x-1/2">
          <NavbarItem>
            <Link
              color="foreground"
              href="../"
              className={`transition-all hover:opacity-70 ${pathname === "/" ? "font-bold underline" : ""}`}
            >
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              color="foreground"
              href="/teams"
              className={`transition-all hover:opacity-70 ${pathname === "/teams" ? "font-bold underline" : ""}`}
            >
              Teams
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/*right */}
        <NavbarContent as="div" justify="end" className="flex-none">
          <h1 className="text-[#d3af37]">Hello, {user?.name || "User"}!</h1>

          <Dropdown
            placement="bottom-end"
            offset={5}
            crossOffset={90}
            onOpenChange={setDropdownOpen}
          >
            <DropdownTrigger>
              <div className="relative cursor-pointer mr-6">
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform hover:opacity-80"
                  color="secondary"
                  style={{ width: "30px", height: "30px" }}
                  name={user?.name || "User"}
                  src="/default_profile.png"
                />
                {unreadCount > 0 && (
                  <span className="
                    absolute -top-1 -right-1
                    min-w-[16px] h-[16px]
                    bg-red-500 text-white
                    text-[10px] font-bold
                    rounded-full
                    flex items-center justify-center
                    px-[3px]
                    pointer-events-none
                    border-2 border-black
                  ">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
            </DropdownTrigger>

            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
              classNames={{
                base: "w-50",
                list: "flex flex-col gap-0 bg-black p-2 rounded-xl",
              }}
            >
              <DropdownItem key="profile_info" className="h-14 gap-2" isReadOnly textValue="profile_info">
                <p className="text-xs text-default-400 px-1">Signed in as</p>
                <p className="text-sm text-blue-500 font-semibold truncate px-1">
                  {user?.email || "—"}
                </p>
              </DropdownItem>

              <DropdownItem key="my_profile" className="p-1" onPress={() => setPendingAction("profile")}>
                My Profile
              </DropdownItem>

              <DropdownItem key="my_settings" className="p-1" onPress={() => setPendingAction("settings")}>
                Settings
              </DropdownItem>

              <DropdownItem
                key="notifications"
                className="p-1"
                onPress={() => setPendingAction("notifications")}
                endContent={
                  unreadCount > 0 ? (
                    <span className="
                      min-w-[20px] h-5
                      bg-red-500 text-white
                      text-[11px] font-bold
                      rounded-full
                      flex items-center justify-center
                      px-1.5
                    ">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  ) : null
                }
              >
                Notifications
              </DropdownItem>

              <DropdownItem
                key="logout"
                className="text-red-500 p-1"
                onPress={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      <ProfileSettingsModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        defaultTab={profileDefaultTab}
        user={user}
      />

      <NotificationsModal
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onMarkRead={handleMarkRead}
      />
    </>
  );
}