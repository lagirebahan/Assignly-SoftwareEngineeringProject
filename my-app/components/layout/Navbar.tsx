"use client";

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
  return (
    <Navbar 
      maxWidth="xl" //isBordered kl butuh
      className="flex items-center"
    >
      {/*this section should be on the left*/}
      
      <NavbarContent className="flex justify-start">
        <NavbarBrand className="gap-2">
          <AssignlyLogo />
          <p className="font-bold text-inherit">Assignly</p>
        </NavbarBrand>
      </NavbarContent>

      {/*this should be in the center*/}
      <NavbarContent 
        className="
          hidden sm:flex 
          gap-4 
          absolute left-1/2 -translate-x-1/2">
        <NavbarItem className="">
          <Link color="foreground" href="../">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" color="secondary" href="/teams">
            Teams
          </Link>
        </NavbarItem>
        {/* <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem> */}
      </NavbarContent>

      {/*this should be on the right(dropdown should drop under profile)*/}
      <NavbarContent as="div" justify="end" className="flex-none">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            {/* const userImage = user?.image; // from your user data */}
            {/* <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name={user?.name || "User"}
              size="sm"
              src={userImage || "/default-avatar.png"}
            /> */}
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              style={{ width: "24px", height: "24px" }}
              name="Jason Hughes"
              src="/default_profile.png"
            />
          </DropdownTrigger>
          <DropdownMenu 
          aria-label="Profile Actions" 
          variant="flat" 
          classNames={{
            base: "w-56",
            list: "flex flex-col gap-0",
          }}
          >
            <DropdownItem 
              key="profile" 
              className="h-14 gap-2" 
              isReadOnly 
              textValue="profile"
            >
              <p className="text-xs text-default-400">Signed in as</p>
              <p className="text-sm font-semibold truncate">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="profile" >My Profile</DropdownItem>
            <DropdownItem key="my_settings" >Settings</DropdownItem>
            <DropdownItem key="notifications" >Notifications</DropdownItem>
            <DropdownItem key="logout" color="danger" >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}

// "use client";

// import Image from "next/image";
// import {
//   Navbar,
//   NavbarBrand,
//   NavbarContent,
//   NavbarItem,
//   NavbarMenu,
//   NavbarMenuItem,
//   NavbarMenuToggle,
//   Link,
//   DropdownItem,
//   DropdownTrigger,
//   Dropdown,
//   DropdownMenu,
//   Avatar,
// } from "@heroui/react";

// export const AssignlyLogo = () => {
//   return (
//     <Image
//       src="/icon.png"
//       alt="Assignly Logo"
//       width={32}
//       height={32}
//       priority
//     />
//   );
// };

// export default function AppNavbar() {
//   return (
//     <Navbar isBordered maxWidth="xl">

//       {/* This wrapper spreads everything apart */}
//       <div className="flex w-full items-center justify-between">

//         {/* LEFT */}
//         <NavbarContent justify="start">
//           <NavbarBrand className="gap-2">
//             <AssignlyLogo />
//             <p className="font-bold text-inherit">Assignly</p>
//           </NavbarBrand>
//         </NavbarContent>

//         {/* CENTER (takes remaining space and centers itself) */}
//         <NavbarContent
//           justify="center"
//           className="hidden sm:flex gap-8 flex-1"
//         >
//           <NavbarItem>
//             <Link color="foreground" href="/">
//               Home
//             </Link>
//           </NavbarItem>

//           <NavbarItem isActive>
//             <Link aria-current="page" color="secondary" href="/teams">
//               Teams
//             </Link>
//           </NavbarItem>
//         </NavbarContent>

//         {/* RIGHT */}
//         <NavbarContent justify="end" className="gap-4">

//           {/* Mobile toggle */}
//           <NavbarMenuToggle className="sm:hidden" />

//           <Dropdown placement="bottom-end">
//             <DropdownTrigger>
//               <Avatar
//                 isBordered
//                 as="button"
//                 className="transition-transform w-7 h-7"
//                 color="secondary"
//                 name="Jason Hughes"
//                 src="/default_profile.png"
//               />
//             </DropdownTrigger>

//             <DropdownMenu aria-label="Profile Actions" variant="flat">
//               <DropdownItem
//                 key="profile_header"
//                 className="h-14 gap-2"
//                 isReadOnly
//               >
//                 <p className="text-xs text-default-400">
//                   Signed in as
//                 </p>
//                 <p className="text-sm font-semibold truncate">
//                   zoey@example.com
//                 </p>
//               </DropdownItem>

//               <DropdownItem key="profile">
//                 My Profile
//               </DropdownItem>

//               <DropdownItem key="settings">
//                 Settings
//               </DropdownItem>

//               <DropdownItem key="logout" color="danger">
//                 Log Out
//               </DropdownItem>
//             </DropdownMenu>
//           </Dropdown>
//         </NavbarContent>

//       </div>

//       {/* MOBILE MENU */}
//       <NavbarMenu>
//         <NavbarMenuItem>
//           <Link href="/" size="lg">
//             Home
//           </Link>
//         </NavbarMenuItem>
//         <NavbarMenuItem>
//           <Link href="/teams" size="lg">
//             Teams
//           </Link>
//         </NavbarMenuItem>
//       </NavbarMenu>

//     </Navbar>
//   );
// }