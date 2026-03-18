"use client";

import { Loader2 } from "lucide-react";
import { ToolCallLabel } from "./ToolCallLabel";

interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "call" | "partial-call" | "result";
  result?: unknown;
}

export function ToolCallBadge({ toolName, args, state, result }: ToolCallBadgeProps) {
  const isDone = state === "result" && result != null;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <ToolCallLabel toolName={toolName} args={args} />
    </div>
  );
}
