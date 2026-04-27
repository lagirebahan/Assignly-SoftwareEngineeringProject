import AppNavbar from "@/components/layout/Navbar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNavbar />
      <main className="flex-1 min-h-0 overflow-hidden">
        {children}
      </main>
    </>
  );
}