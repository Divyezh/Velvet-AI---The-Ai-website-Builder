"use client";

import { useIDEStore } from "@/app/sandbox/store";
import { Loader2 } from "lucide-react";

export default function PreviewPanel() {
  const { previewUrl, sandboxStatus } = useIDEStore();

  if (sandboxStatus === "creating" || !previewUrl) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-white">
        <Loader2 size={32} className="text-[#e85d0a] animate-spin mb-4" />
        <span className="text-[14px] text-[#5a3820] font-medium">Starting Sandbox...</span>
        <span className="text-[12px] text-[#a08060] mt-2 text-center max-w-[250px]">
          Initializing Velvet ai MicroVM and installing dependencies. This usually takes 10-15 seconds.
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full relative bg-white">
      <iframe
        src={previewUrl}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
