import React, { useState } from 'react';
import { Folder, FolderOpen, File, Plus, Trash2, ChevronDown, ChevronRight, FilePlus, FolderPlus } from 'lucide-react';
import type { FileEntry } from '@/lib/sandbox';

interface ExplorerProps {
  files: FileEntry[];
  activeFile: string | null;
  onSelectFile: (path: string) => void;
  onCreateFile: (path: string) => Promise<void>;
  onCreateDir: (path: string) => Promise<void>;
  onDeleteFile: (path: string) => Promise<void>;
}

export default function Explorer({
  files,
  activeFile,
  onSelectFile,
  onCreateFile,
  onCreateDir,
  onDeleteFile,
}: ExplorerProps) {
  const [newEntryPath, setNewEntryPath] = useState<string | null>(null);
  const [newEntryName, setNewEntryName] = useState('');
  const [newEntryType, setNewEntryType] = useState<'file' | 'dir'>('file');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryName.trim() || !newEntryPath) return;

    // Remove trailing slashes and join
    const cleanPath = `${newEntryPath.replace(/\/$/, '')}/${newEntryName.trim()}`;
    if (newEntryType === 'file') {
      await onCreateFile(cleanPath);
    } else {
      await onCreateDir(cleanPath);
    }

    setNewEntryName('');
    setNewEntryPath(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#080810] border-r border-white/10 select-none">
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Workspace Explorer</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setNewEntryPath('/tmp/app');
              setNewEntryType('file');
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="New File"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setNewEntryPath('/tmp/app');
              setNewEntryType('dir');
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="New Folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 text-sm font-mono">
        {newEntryPath === '/tmp/app' && (
          <form onSubmit={handleCreateSubmit} className="flex items-center gap-1 p-1 bg-white/5 rounded">
            {newEntryType === 'file' ? (
              <File className="w-4 h-4 text-teal-400 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <input
              autoFocus
              type="text"
              value={newEntryName}
              onChange={(e) => setNewEntryName(e.target.value)}
              onBlur={() => setNewEntryPath(null)}
              placeholder={newEntryType === 'file' ? 'filename.ts' : 'folder_name'}
              className="bg-transparent text-white text-xs border-none outline-none w-full"
            />
          </form>
        )}

        {files.length === 0 ? (
          <div className="text-xs text-slate-500 p-4 text-center">Empty workspace</div>
        ) : (
          files.map((entry) => (
            <FileNode
              key={entry.path}
              entry={entry}
              depth={0}
              activeFile={activeFile}
              onSelectFile={onSelectFile}
              onDeleteFile={onDeleteFile}
              onStartCreate={(path, type) => {
                setNewEntryPath(path);
                setNewEntryType(type);
              }}
              newEntryPath={newEntryPath}
              newEntryName={newEntryName}
              setNewEntryName={setNewEntryName}
              handleCreateSubmit={handleCreateSubmit}
              onCancelCreate={() => setNewEntryPath(null)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface FileNodeProps {
  entry: FileEntry;
  depth: number;
  activeFile: string | null;
  onSelectFile: (path: string) => void;
  onDeleteFile: (path: string) => Promise<void>;
  onStartCreate: (parentPath: string, type: 'file' | 'dir') => void;
  newEntryPath: string | null;
  newEntryName: string;
  setNewEntryName: (name: string) => void;
  handleCreateSubmit: (e: React.FormEvent) => void;
  onCancelCreate: () => void;
}

function FileNode({
  entry,
  depth,
  activeFile,
  onSelectFile,
  onDeleteFile,
  onStartCreate,
  newEntryPath,
  newEntryName,
  setNewEntryName,
  handleCreateSubmit,
  onCancelCreate,
}: FileNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = activeFile === entry.path;
  const displayName = entry.path.replace(/^\/home\/user\/app\/?/, '') || entry.name;

  const handleToggle = () => {
    if (entry.type === 'dir') {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(entry.path);
    }
  };

  return (
    <div className="space-y-0.5">
      <div
        className={`group flex items-center justify-between py-1 px-2 rounded cursor-pointer transition-colors ${
          isSelected ? 'bg-white/10 text-white font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {entry.type === 'dir' ? (
            <>
              {isOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              {isOpen ? (
                <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-amber-400 shrink-0" />
              )}
            </>
          ) : (
            <>
              <span className="w-3.5" /> {/* Spacer */}
              <File className="w-4 h-4 text-teal-400 shrink-0" />
            </>
          )}
          <span className="truncate text-xs">{entry.name}</span>
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          {entry.type === 'dir' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartCreate(entry.path, 'file');
                }}
                className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-white/10"
                title="New File"
              >
                <FilePlus className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartCreate(entry.path, 'dir');
                }}
                className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-white/10"
                title="New Folder"
              >
                <FolderPlus className="w-3 h-3" />
              </button>
            </>
          )}
          {entry.path !== '/tmp/app' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete ${entry.name}?`)) {
                  onDeleteFile(entry.path);
                }
              }}
              className="p-0.5 rounded text-slate-400 hover:text-red-400 hover:bg-white/10"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {entry.type === 'dir' && isOpen && (
        <div className="space-y-0.5">
          {newEntryPath === entry.path && (
            <form
              onSubmit={handleCreateSubmit}
              className="flex items-center gap-1 py-1 px-2 bg-white/5 rounded"
              style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
            >
              <File className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={newEntryName}
                onChange={(e) => setNewEntryName(e.target.value)}
                onBlur={onCancelCreate}
                placeholder="Name"
                className="bg-transparent text-white text-xs border-none outline-none w-full font-mono"
              />
            </form>
          )}
          
          {entry.children?.map((child) => (
            <FileNode
              key={child.path}
              entry={child}
              depth={depth + 1}
              activeFile={activeFile}
              onSelectFile={onSelectFile}
              onDeleteFile={onDeleteFile}
              onStartCreate={onStartCreate}
              newEntryPath={newEntryPath}
              newEntryName={newEntryName}
              setNewEntryName={setNewEntryName}
              handleCreateSubmit={handleCreateSubmit}
              onCancelCreate={onCancelCreate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
