"use client";

import { useIDEStore } from "@/app/sandbox/store";
import { Folder, Search, GitBranch, Blocks, Rocket, User, Settings } from "lucide-react";

export default function IconBar() {
  const { activeIconPanel, setActiveIconPanel } = useIDEStore();

  const icons = [
    { id: "explorer", icon: Folder, tooltip: "Explorer" },
    { id: "search", icon: Search, tooltip: "Search" },
    { id: "git", icon: GitBranch, tooltip: "Source Control" },
    { id: "extensions", icon: Blocks, tooltip: "Extensions" },
    { id: "deploy", icon: Rocket, tooltip: "Deploy" },
  ];

  const bottomIcons = [
    { id: "account", icon: User, tooltip: "Account" },
    { id: "settings", icon: Settings, tooltip: "Settings" },
  ];

  return (
    <div className="flex flex-col items-center w-10 shrink-0 bg-[#0a0605] border-r border-[rgba(201,74,10,0.08)] py-2 gap-1 z-10">
      {icons.map((item) => {
        const isActive = activeIconPanel === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveIconPanel(isActive ? null : item.id as any)}
            className={`relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150 group ${
              isActive 
                ? "text-[#e85d0a] bg-[rgba(201,74,10,0.1)]" 
                : "text-[#5a3820] hover:text-[#a08060] hover:bg-[rgba(201,74,10,0.08)]"
            }`}
            title={item.tooltip}
          >
            {isActive && (
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-[2px] h-full bg-[#e85d0a] rounded-r"></div>
            )}
            <item.icon size={16} />
          </button>
        );
      })}

      <div className="mt-auto flex flex-col gap-1">
        {bottomIcons.map((item) => (
          <button
            key={item.id}
            className="flex items-center justify-center w-8 h-8 rounded-md text-[#5a3820] hover:text-[#a08060] hover:bg-[rgba(201,74,10,0.08)] transition-all duration-150"
            title={item.tooltip}
          >
            <item.icon size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}
