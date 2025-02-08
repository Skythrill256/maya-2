
'use client'
import { useState } from "react";
import para from "@/lib/client/para";
import Link from "next/link";
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/main/dropdown-menu";
import { Button } from "@/components/main/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/main/sheet";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ParaModal } from "@getpara/react-sdk";

const navItems = [
  { href: "/home/consensus", label: "Consensus" },
  { href: "/home/policies", label: "Policies" },
  { href: "/home/network-state", label: "Network-State" },
  { href: "/home/leaderboard", label: "Leaderboard" },
];

export function NavBar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isParaModalOpen, setIsParaModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Left section with logo and mobile menu */}
        <div className="flex items-center gap-4">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold tracking-widest">M A Y A</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button onClick={() => setIsParaModalOpen(true)}>Open ParaModal</Button>

        <ParaModal
          para={para}
          isOpen={isParaModalOpen}
          onClose={() => setIsParaModalOpen(false)}
          appName="Your App Name"
          logo="https://yourapp.com/logo.png"
          theme={{ backgroundColor: "#ffffff", foregroundColor: "#000000" }}
          oAuthMethods={["GOOGLE", "TWITTER", "DISCORD"]}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <span className="sr-only">Open user menu</span>
              <div className="h-7 w-7 rounded-full bg-muted" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
