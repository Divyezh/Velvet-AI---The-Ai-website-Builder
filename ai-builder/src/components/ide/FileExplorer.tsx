"use client";

import { useIDEStore } from "@/app/sandbox/store";
import { FileNode } from "@/types/ide";
import { ChevronRight, File as FileIcon, Folder as FolderIcon, FilePlus, FolderPlus } from "lucide-react";

export default function FileExplorer() {
  const { fileTree, expandedFolders, toggleFolder, openFile, streamingFile } = useIDEStore();

  const handleFileClick = async (path: string) => {
    // In a real app, we'd fetch the file content here if not already loaded
    // For now we just open it. We might need to fetch from API.
    const res = await fetch(`/api/sandbox/file?sandboxId=${useIDEStore.getState().sandboxId}&path=${encodeURIComponent(path)}`);
    if (res.ok) {
      const data = await res.json();
      openFile(path, data.content);
    } else {
      openFile(path); // Empty or error
    }
  };

  const getFileColor = (name: string) => {
    if (name.endsWith('.ts') || name.endsWith('.tsx')) return 'text-[#4ec9b0]';
    if (name.endsWith('.js') || name.endsWith('.jsx')) return 'text-[#dcdcaa]';
    if (name.endsWith('.css')) return 'text-[#4fc1ff]';
    if (name.endsWith('.json')) return 'text-[#ce9178]';
    if (name.endsWith('.html')) return 'text-[#f28b54]';
    if (name.endsWith('.md')) return 'text-[#d4d4d4]';
    return 'text-[#a08060]';
  };

  const renderTree = (nodes: FileNode[], depth: number = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedFolders.has(node.path);
      const paddingLeft = 8 + depth * 16;
      
      if (node.type === "folder") {
        return (
          <div key={node.path}>
            <div 
              className="flex items-center h-[26px] mx-1 rounded cursor-pointer text-[12px] text-[#a08060] hover:bg-[rgba(201,74,10,0.06)] hover:text-[#f5e8d8] transition-colors"
              style={{ paddingLeft: `${paddingLeft}px` }}
              onClick={() => toggleFolder(node.path)}
            >
              <ChevronRight size={12} className={`mr-1 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              <FolderIcon size={14} className="mr-1.5 text-[#5a3820]" />
              <span className="truncate">{node.name}</span>
            </div>
            {isExpanded && node.children && (
              <div>{renderTree(node.children, depth + 1)}</div>
            )}
          </div>
        );
      }

      return (
        <div 
          key={node.path}
          className="relative flex items-center h-[26px] mx-1 rounded cursor-pointer text-[12px] text-[#a08060] hover:bg-[rgba(201,74,10,0.06)] hover:text-[#f5e8d8] transition-colors group"
          style={{ paddingLeft: `${paddingLeft + 16}px` }}
          onClick={() => handleFileClick(node.path)}
        >
          {streamingFile === node.path && (
            <div className="absolute left-[2px] w-1.5 h-1.5 rounded-full bg-[#e85d0a] animate-pulse"></div>
          )}
          <FileIcon size={14} className={`mr-1.5 ${getFileColor(node.name)}`} />
          <span className={`truncate ${streamingFile === node.path ? "text-[#e85d0a] italic" : ""}`}>
            {node.name}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col w-[220px] shrink-0 bg-[#0a0605] border-r border-[rgba(201,74,10,0.08)] h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 pr-2 h-[36px] shrink-0">
        <span className="text-[10px] font-semibold text-[#5a3820] tracking-widest uppercase">Workspace Explorer</span>
        <div className="flex items-center gap-0.5">
          <button className="flex items-center justify-center w-[22px] h-[22px] rounded-full text-[#5a3820] hover:text-[#a08060] hover:bg-[rgba(201,74,10,0.08)] transition-colors">
            <FilePlus size={13} />
          </button>
          <button className="flex items-center justify-center w-[22px] h-[22px] rounded-full text-[#5a3820] hover:text-[#a08060] hover:bg-[rgba(201,74,10,0.08)] transition-colors">
            <FolderPlus size={13} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-1">
        {fileTree.length > 0 ? (
          renderTree(fileTree)
        ) : (
          <div className="px-4 py-2 text-[12px] text-[#5a3820]">
            No files to display
          </div>
        )}
      </div>
    </div>
  );
}
