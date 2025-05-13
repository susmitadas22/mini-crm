import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/services";
import { Sidebar } from "./sidebar";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await api.user.getUser();
  if (!user) {
    return redirect("/auth");
  }
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header
          className={cn(
            "sticky top-0 z-50 w-full backdrop-blur border-b border-border",
            "flex items-center justify-between px-6 py-4"
          )}
        >
          <h1 className="text-lg font-bold">Mini CRM Dashboard</h1>

          <div className="flex items-center gap-4">
            <Avatar className="border">
              <AvatarImage
                src={user.user.image || undefined}
                alt={user.user.name || "user"}
              />
              <AvatarFallback>
                {user.user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Button size="sm" variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 bg-muted/40 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
