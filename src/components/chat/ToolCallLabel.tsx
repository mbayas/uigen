"use client";

import { FileEdit, FilePlus, FileSearch, FileX, FilePen, Undo2, Wrench } from "lucide-react";
import type { ReactNode } from "react";

interface ToolCallLabelProps {
  toolName: string;
  args: Record<string, unknown>;
}

interface ToolDisplay {
  icon: ReactNode;
  label: string;
}

function getStrReplaceDisplay(args: Record<string, unknown>): ToolDisplay {
  const command = args.command as string | undefined;
  const path = args.path as string | undefined;
  const fileName = path ? path.split("/").pop() : undefined;

  switch (command) {
    case "create":
      return {
        icon: <FilePlus className="w-3 h-3 text-emerald-600" />,
        label: fileName ? `Created ${fileName}` : "Created file",
      };
    case "str_replace":
      return {
        icon: <FileEdit className="w-3 h-3 text-blue-600" />,
        label: fileName ? `Edited ${fileName}` : "Edited file",
      };
    case "view":
      return {
        icon: <FileSearch className="w-3 h-3 text-neutral-600" />,
        label: fileName ? `Viewed ${fileName}` : "Viewed file",
      };
    case "insert":
      return {
        icon: <FilePen className="w-3 h-3 text-blue-600" />,
        label: fileName ? `Inserted into ${fileName}` : "Inserted into file",
      };
    case "undo_edit":
      return {
        icon: <Undo2 className="w-3 h-3 text-amber-600" />,
        label: fileName ? `Undid edit to ${fileName}` : "Undid edit",
      };
    default:
      return {
        icon: <FileEdit className="w-3 h-3 text-neutral-600" />,
        label: fileName ? `Modified ${fileName}` : "Modified file",
      };
  }
}

function getFileManagerDisplay(args: Record<string, unknown>): ToolDisplay {
  const command = args.command as string | undefined;
  const path = args.path as string | undefined;
  const newPath = args.new_path as string | undefined;
  const fileName = path ? path.split("/").pop() : undefined;
  const newFileName = newPath ? newPath.split("/").pop() : undefined;

  switch (command) {
    case "rename":
      return {
        icon: <FilePen className="w-3 h-3 text-amber-600" />,
        label:
          fileName && newFileName
            ? `Renamed ${fileName} → ${newFileName}`
            : "Renamed file",
      };
    case "delete":
      return {
        icon: <FileX className="w-3 h-3 text-red-600" />,
        label: fileName ? `Deleted ${fileName}` : "Deleted file",
      };
    default:
      return {
        icon: <Wrench className="w-3 h-3 text-neutral-600" />,
        label: "Managed file",
      };
  }
}

export function getToolDisplay(toolName: string, args: Record<string, unknown>): ToolDisplay {
  switch (toolName) {
    case "str_replace_editor":
      return getStrReplaceDisplay(args);
    case "file_manager":
      return getFileManagerDisplay(args);
    default:
      return {
        icon: <Wrench className="w-3 h-3 text-neutral-600" />,
        label: toolName,
      };
  }
}

export function ToolCallLabel({ toolName, args }: ToolCallLabelProps) {
  const { icon, label } = getToolDisplay(toolName, args);

  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      <span className="text-neutral-700">{label}</span>
    </span>
  );
}
