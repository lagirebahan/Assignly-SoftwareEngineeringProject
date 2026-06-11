import ClientOnlyNavbar from "@/components/layout/ClientOnlyNavbar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClientOnlyNavbar />
      <main className="flex-1 min-h-0 overflow-auto">
        {children}
      </main>
    </>
  );
}