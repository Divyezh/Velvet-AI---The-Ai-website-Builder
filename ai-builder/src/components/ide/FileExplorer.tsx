"use client";

import { useIDEStore } from "@/app/sandbox/store";
import { FileNode } from "@/types/ide";
import { 
  ChevronRight, File as FileIcon, Folder as FolderIcon, 
  FilePlus, FolderPlus, Trash2, Edit, Check, X, RefreshCw 
} from "lucide-react";
import { useEffect, useState } from "react";
import { Tree, NodeApi, NodeRendererProps } from "react-arborist";

export default function FileExplorer() {
  const { fileTree, openFile, streamingFile, setFileTree, sandboxId } = useIDEStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Creation state
  const [createTarget, setCreateTarget] = useState<{ path: string; type: 'file' | 'folder' } | null>(null);
  const [createName, setCreateName] = useState("");
  
  // Rename state
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const refreshTree = async () => {
    if (!sandboxId) return;
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/sandbox/files?sandboxId=${sandboxId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.tree) {
          setFileTree(data.tree);
        }
      }
    } catch (e) {
      console.error("Failed to refresh file tree:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (sandboxId) {
      refreshTree();
    }
  }, [sandboxId]);

  useEffect(() => {
    if (!streamingFile && sandboxId) {
      refreshTree();
    }
  }, [streamingFile]);

  const handleFileClick = async (path: string) => {
    if (!sandboxId) return;
    try {
      const res = await fetch(`/api/sandbox/file?sandboxId=${sandboxId}&path=${encodeURIComponent(path)}`);
      if (res.ok) {
        const data = await res.json();
        openFile(path, data.content);
      } else {
        openFile(path);
      }
    } catch (e) {
      openFile(path);
    }
  };

  const handleCreate = async () => {
    if (!sandboxId || !createTarget || !createName.trim()) return;
    const parentPath = createTarget.path;
    const newPath = parentPath ? `${parentPath}/${createName.trim()}` : createName.trim();
    
    try {
      const res = await fetch("/api/sandbox/file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sandboxId,
          path: newPath,
          type: createTarget.type
        })
      });
      if (res.ok) {
        setCreateTarget(null);
        setCreateName("");
        refreshTree();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sandboxId) return;
    if (!confirm(`Are you sure you want to delete ${path}?`)) return;
    
    try {
      const res = await fetch("/api/sandbox/file", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sandboxId, path })
      });
      if (res.ok) {
        refreshTree();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = async (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenameTarget(path);
    const parts = path.split('/');
    setRenameValue(parts[parts.length - 1]);
  };

  const submitRename = async (oldPath: string) => {
    if (!sandboxId || !renameValue.trim() || renameValue === oldPath.split('/').pop()) {
      setRenameTarget(null);
      return;
    }
    const parts = oldPath.split('/');
    parts[parts.length - 1] = renameValue.trim();
    const newPath = parts.join('/');

    try {
      const res = await fetch("/api/sandbox/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sandboxId,
          command: `mv "/app/${oldPath}" "/app/${newPath}"`
        })
      });
      if (res.ok) {
        setRenameTarget(null);
        refreshTree();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Drag & Drop move in react-arborist
  const handleMove = async ({ dragIds, parentId, index }: any) => {
    if (!sandboxId || dragIds.length === 0) return;
    const oldPath = dragIds[0];
    const fileName = oldPath.split('/').pop();
    const newParentPath = parentId || "";
    const newPath = newParentPath ? `${newParentPath}/${fileName}` : fileName;

    if (oldPath === newPath) return;

    try {
      const res = await fetch("/api/sandbox/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sandboxId,
          command: `mv "/app/${oldPath}" "/app/${newPath}"`
        })
      });
      if (res.ok) {
        refreshTree();
      }
    } catch (e) {
      console.error("Failed to move file:", e);
    }
  };

  const getFileColor = (name: string) => {
    if (name.endsWith('.ts') || name.endsWith('.tsx')) return 'text-[#FF6B00]';
    if (name.endsWith('.js') || name.endsWith('.jsx')) return 'text-[#f5e8d8]';
    if (name.endsWith('.css')) return 'text-[#4fc1ff]';
    if (name.endsWith('.json')) return 'text-[#ce9178]';
    if (name.endsWith('.html')) return 'text-[#f28b54]';
    if (name.endsWith('.md')) return 'text-[#a08060]';
    return 'text-[#a08060]';
  };

  // Convert FileNode tree to arborist compatible data structure
  const convertTreeData = (nodes: FileNode[]): any[] => {
    return nodes.map(node => ({
      id: node.path,
      name: node.name,
      type: node.type,
      children: node.children ? convertTreeData(node.children) : undefined
    }));
  };

  const arboristData = convertTreeData(fileTree);

  // Render node template for react-arborist
  const NodeRenderer = ({ node, style, dragHandle }: NodeRendererProps<any>) => {
    const isFolder = node.data.type === 'folder';
    const isRenaming = renameTarget === node.data.id;
    const paddingLeft = node.level * 12 + 6;

    return (
      <div 
        style={{ ...style, paddingLeft: `${paddingLeft}px` }}
        className="flex items-center h-[28px] pr-2 rounded-md hover:bg-[rgba(255,107,0,0.05)] hover:text-[#f5e8d8] group select-none text-[12.5px] text-[#a08060] justify-between cursor-pointer"
        onClick={() => {
          if (isFolder) {
            node.toggle();
          } else {
            handleFileClick(node.data.id);
          }
        }}
      >
        <div className="flex items-center min-w-0" ref={dragHandle}>
          {isFolder ? (
            <>
              <ChevronRight 
                size={13} 
                className={`mr-1 transition-transform shrink-0 ${node.isOpen ? "rotate-90 text-[#FF6B00]" : ""}`} 
              />
              <FolderIcon size={14} className="mr-1.5 text-[#a08060] shrink-0" />
            </>
          ) : (
            <div className="w-4 flex items-center justify-center mr-1">
              <FileIcon size={14} className={`shrink-0 ${getFileColor(node.data.name)}`} />
            </div>
          )}
          
          {isRenaming ? (
            <input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitRename(node.data.id);
                if (e.key === "Escape") setRenameTarget(null);
              }}
              className="bg-[#0A0A0A] border border-[#FF6B00] text-xs text-[#f5e8d8] px-1 py-0.5 rounded outline-none w-28"
              autoFocus
            />
          ) : (
            <span className="truncate">{node.data.name}</span>
          )}
        </div>

        {/* Hover action elements */}
        <div className="hidden group-hover:flex items-center gap-1 shrink-0">
          {isFolder && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setCreateTarget({ path: node.data.id, type: 'file' });
                }} 
                className="text-[#a08060] hover:text-[#FF6B00] p-0.5 rounded"
                title="New File"
              >
                <FilePlus size={11} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setCreateTarget({ path: node.data.id, type: 'folder' });
                }}
                className="text-[#a08060] hover:text-[#FF6B00] p-0.5 rounded"
                title="New Folder"
              >
                <FolderPlus size={11} />
              </button>
            </>
          )}
          <button 
            onClick={(e) => handleRename(node.data.id, e)}
            className="text-[#a08060] hover:text-white p-0.5 rounded"
            title="Rename"
          >
            <Edit size={11} />
          </button>
          <button 
            onClick={(e) => handleDelete(node.data.id, e)}
            className="text-[#a08060] hover:text-red-400 p-0.5 rounded"
            title="Delete"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#0A0A0A] overflow-hidden select-none">
      <div className="flex items-center justify-between px-3 h-[38px] border-b border-[rgba(255,107,0,0.08)] shrink-0 bg-[#111111]">
        <span className="text-[10px] font-bold text-[#FF6B00] tracking-wider uppercase">Workspace Explorer</span>
        
        <div className="flex items-center gap-0.5">
          <button 
            onClick={refreshTree}
            className={`flex items-center justify-center w-6 h-6 rounded-md text-[#a08060] hover:text-[#FF6B00] transition-colors ${isRefreshing ? "animate-spin" : ""}`}
            title="Refresh Explorer Tree"
          >
            <RefreshCw size={12} />
          </button>
          <button 
            onClick={() => setCreateTarget({ path: "", type: "file" })}
            className="flex items-center justify-center w-6 h-6 rounded-md text-[#a08060] hover:text-[#FF6B00] transition-colors"
            title="Create File at Root"
          >
            <FilePlus size={12} />
          </button>
          <button 
            onClick={() => setCreateTarget({ path: "", type: "folder" })}
            className="flex items-center justify-center w-6 h-6 rounded-md text-[#a08060] hover:text-[#FF6B00] transition-colors"
            title="Create Folder at Root"
          >
            <FolderPlus size={12} />
          </button>
        </div>
      </div>
      
      {/* Root File/Folder Input */}
      {createTarget && createTarget.path === "" && (
        <div className="flex items-center h-[32px] px-3 gap-1.5 border-b border-[rgba(255,107,0,0.05)] bg-[#111111] shrink-0">
          {createTarget.type === 'file' ? <FileIcon size={12} className="text-[#a08060]" /> : <FolderIcon size={12} className="text-[#a08060]" />}
          <input
            placeholder={`new root ${createTarget.type}...`}
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setCreateTarget(null);
            }}
            className="bg-[#0A0A0A] border border-[#FF6B00] text-xs text-[#f5e8d8] px-1.5 py-0.5 rounded outline-none flex-1 min-w-0"
            autoFocus
          />
          <button onClick={handleCreate} className="text-[#FF6B00]"><Check size={12} /></button>
          <button onClick={() => setCreateTarget(null)} className="text-[#a08060]"><X size={12} /></button>
        </div>
      )}

      {/* Target Directory File/Folder Input */}
      {createTarget && createTarget.path !== "" && (
        <div className="flex items-center h-[32px] px-3 gap-1.5 border-b border-[rgba(255,107,0,0.05)] bg-[#111111] shrink-0">
          {createTarget.type === 'file' ? <FileIcon size={12} className="text-[#a08060]" /> : <FolderIcon size={12} className="text-[#a08060]" />}
          <input
            placeholder={`new in ${createTarget.path.split('/').pop()}...`}
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setCreateTarget(null);
            }}
            className="bg-[#0A0A0A] border border-[#FF6B00] text-xs text-[#f5e8d8] px-1.5 py-0.5 rounded outline-none flex-1 min-w-0"
            autoFocus
          />
          <button onClick={handleCreate} className="text-[#FF6B00]"><Check size={12} /></button>
          <button onClick={() => setCreateTarget(null)} className="text-[#a08060]"><X size={12} /></button>
        </div>
      )}
      
      <div className="flex-1 py-2 overflow-y-auto">
        {arboristData.length > 0 ? (
          <Tree
            data={arboristData}
            onMove={handleMove}
            width="100%"
            height={500}
            indent={12}
            rowHeight={28}
          >
            {NodeRenderer}
          </Tree>
        ) : (
          <div className="px-4 py-4 text-center">
            <span className="text-[11px] text-[#5a3820] italic">No workspace files.</span>
            <button 
              onClick={refreshTree} 
              className="block mx-auto mt-2 text-[10px] text-[#FF6B00] hover:underline"
            >
              Scan workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
