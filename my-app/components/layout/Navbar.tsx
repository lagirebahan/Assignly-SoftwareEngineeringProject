"use client";

import { usePathname, useRouter } from "next/navigation";

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
  Button,
} from "@heroui/react";

export const AssignlyLogo = () => {
  return (
    // <img src="/icon.png" alt="Assignly Logo" style={{ height:'36px', width : 'auto'}} />
    <Image 
      src="/icon.png"
      alt="Assignly Logo"
      width={36}
      height={36}
      priority

      />
  );
};

export default function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Navbar 
      maxWidth="xl" //isBordered kl butuh
      className="flex items-center"
    >
      {/*this section should be on the left*/}
      
      <NavbarContent className="flex justify-start">
        <NavbarBrand className="gap-2">
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <AssignlyLogo />
            <p className="font-bold text-inherit">Assignly</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/*this should be in the center*/}
      <NavbarContent 
        className="
          hidden sm:flex 
          gap-4 
          absolute left-1/2 -translate-x-1/2">
        <NavbarItem>
          <Link color="foreground" href="../" className={`transition-all hover:opacity-70 ${pathname === "/" ? "font-bold underline" : ""}`}>
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/teams" className={`transition-all hover:opacity-70 ${pathname === "/teams" ? "font-bold underline" : ""}`}>
            Teams
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/*this should be on the right(dropdown should drop under profile)*/}
      <NavbarContent as="div" justify="end" className="flex-none">
        {/* <h1>Hello {user?.name || "User"}!</h1> */}
        <h1 className="text-[#d3af37]">Hello, User!</h1>
        <Dropdown placement="bottom-end"  offset={5} crossOffset={90}>
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform mr-6 hover:opacity-80 cursor-pointer"
              color="secondary"
              style={{ width: "30px", height: "30px" }}
              name="Jason Hughes"
              src="/default_profile.png"
            />
          </DropdownTrigger>
          <DropdownMenu 
          aria-label="Profile Actions" 
          variant="flat" 
          classNames={{
            base: "w-50",
            list: "flex flex-col gap-0 bg-black p-2 rounded-xl ",
          }}
          >
            <DropdownItem 
              key="profile" 
              className="h-14 gap-2" 
              isReadOnly 
              textValue="profile"
            >
              <p className="text-xs text-default-400 px-1">Signed in as</p> {/**no links yet */}
              <p className="text-sm text-blue-500 font-semibold truncate px-1">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="my_profile" className="p-1">My Profile</DropdownItem>
            <DropdownItem key="my_settings" className="p-1">Settings</DropdownItem>
            <DropdownItem key="notifications" className="p-1">Notifications</DropdownItem>
            <DropdownItem key="logout" className="text-red-500 p-1" onClick={() => { alert("clicked"); window.location.href = "/login"; }}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}