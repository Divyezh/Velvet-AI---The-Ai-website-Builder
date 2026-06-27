"use client";

import { useIDEStore } from "@/app/sandbox/store";
import { Folder, Search, GitBranch, Blocks, Rocket, User, Settings } from "lucide-react";
import { useToast } from "@/components/ide/Toast";
import { useRouter } from "next/navigation";

export default function IconBar() {
  const { activeIconPanel, setActiveIconPanel, previewUrl } = useIDEStore();
  const { toast } = useToast();
  const router = useRouter();

  const handleIconClick = (id: string) => {
    if (id === "explorer") {
      setActiveIconPanel(activeIconPanel === "explorer" ? null : "explorer");
    } else if (id === "search") {
      setActiveIconPanel(activeIconPanel === "search" ? null : "search");
    } else if (id === "git") {
      setActiveIconPanel(activeIconPanel === "git" ? null : "git");
    } else if (id === "extensions") {
      toast("Extensions coming soon");
    } else if (id === "deploy") {
      if (previewUrl) {
        window.open(previewUrl, "_blank");
      } else {
        toast("Generate a project first");
      }
    }
  };

  const handleBottomIconClick = (id: string) => {
    if (id === "account") {
      router.push("/");
    } else if (id === "settings") {
      toast("Settings coming soon");
    }
  };

  const icons = [
    { id: "explorer", icon: Folder, tooltip: "Workspace Explorer" },
    { id: "search", icon: Search, tooltip: "Search Workspace" },
    { id: "git", icon: GitBranch, tooltip: "Source Control" },
    { id: "extensions", icon: Blocks, tooltip: "Extensions Panel" },
    { id: "deploy", icon: Rocket, tooltip: "Cloud Deployments" },
  ];

  const bottomIcons = [
    { id: "account", icon: User, tooltip: "Account Settings" },
    { id: "settings", icon: Settings, tooltip: "IDE Settings" },
  ];

  return (
    <div className="flex flex-col items-center w-12 shrink-0 bg-[#0A0A0A] border-r border-[rgba(255,107,0,0.1)] py-3 gap-2.5 z-10">
      {icons.map((item) => {
        const isActive = activeIconPanel === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleIconClick(item.id)}
            className={`relative flex items-center justify-center w-9 h-9 rounded-md transition-all duration-150 group ${
              isActive 
                ? "text-[#FF6B00] bg-[rgba(255,107,0,0.12)] border-l-2 border-[#FF6B00] shadow-[0_0_10px_rgba(255,107,0,0.1)]" 
                : "text-[#a08060] hover:text-[#FF6B00] hover:bg-[rgba(255,107,0,0.04)]"
            }`}
            title={item.tooltip}
          >
            <item.icon size={17} />
          </button>
        );
      })}

      <div className="mt-auto flex flex-col gap-2.5">
        {bottomIcons.map((item) => (
          <button
            key={item.id}
            onClick={() => handleBottomIconClick(item.id)}
            className="flex items-center justify-center w-9 h-9 rounded-md text-[#a08060] hover:text-[#FF6B00] hover:bg-[rgba(255,107,0,0.04)] transition-all duration-150"
            title={item.tooltip}
          >
            <item.icon size={17} />
          </button>
        ))}
      </div>
    </div>
  );
}
