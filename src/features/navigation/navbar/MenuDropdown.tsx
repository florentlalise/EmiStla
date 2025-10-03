"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Menu, ChevronRight, LogOut, CodeXml } from "lucide-react";
import { useWindows } from "@/contexts/WindowContext";
import { playSound } from "@/lib/sounds";

export default function MenuDropdown() {
  const { openWindow, windowConfigs } = useWindows();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleOpenDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    playSound("click2");
  };

  const handleWindowClick = (windowId: string) => {
    openWindow(windowId);
    setDropdownOpen(false);
    playSound("click3");
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    playSound("click3");
    window.location.href = "/";
  };

  return (
    <DropdownMenu.Root open={dropdownOpen} onOpenChange={handleOpenDropdown}>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-3 h-9 px-3 rounded-[10px] bg-black/70 backdrop-blur-[5px] outline-none cursor-pointer hover:bg-black/80 transition-colors">
          <Menu width={16} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[215px] rounded-[10px] bg-black/70 backdrop-blur-[5px] overflow-hidden"
          sideOffset={5}
          align="start"
        >
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="flex items-center justify-between h-12 px-3 text-sm cursor-pointer hover:bg-white/10 gap-3 outline-none transition-colors w-full border-b-2 border-white/5">
              <span className="flex items-center gap-3">
                <CodeXml size={20} color="#EAEAEA" />
                Programs
              </span>
              <ChevronRight size={16} color="#EAEAEA" />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="min-w-[215px] rounded-[10px] bg-black/70 backdrop-blur-[5px] overflow-hidden"
                sideOffset={8}
              >
                {windowConfigs.map((config, index) => {
                  const Icon = config.icon;
                  const isLast = index === windowConfigs.length - 1;

                  return (
                    <DropdownMenu.Item
                      key={config.id}
                      className={!isLast ? "border-b-2 border-white/5" : ""}
                      asChild
                    >
                      <button
                        onClick={() => handleWindowClick(config.id)}
                        className="flex items-center h-12 px-3 text-sm cursor-pointer hover:bg-white/10 gap-3 outline-none transition-colors w-full"
                      >
                        <Icon size={20} color="#EAEAEA" />
                        {config.title}
                      </button>
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Item asChild>
            <button
              onClick={handleLogout}
              className="flex items-center h-12 px-3 text-sm cursor-pointer hover:bg-white/10 gap-3 outline-none transition-colors w-full"
            >
              <LogOut size={20} color="#EAEAEA" />
              Logout
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
