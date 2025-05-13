"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "~/lib/utils";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  PlusCircle,
  Inbox,
  LogOutIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth.client";

const navItems = [
  {
    title: "Home",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Create Campaign",
    href: "/segments/create",
    icon: PlusCircle,
  },
  {
    title: "Campaigns",
    href: "/campaigns",
    icon: Megaphone,
  },
  {
    title: "Users",
    href: "/customers",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col w-[240px] border-r bg-white/70 backdrop-blur-lg p-4">
      <div className="text-2xl font-semibold mb-6 px-2 text-primary mx-auto">
        <Inbox className="text-muted-foreground" />
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export const LogOut = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.replace("/auth");
            },
          },
        });
      }}
      size="sm"
      variant="outline"
    >
      <LogOutIcon className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
};
