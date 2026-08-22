import React from "react";
import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onCreateGroup: () => void;
}

export default function FloatingActionButton({ onCreateGroup }: FloatingActionButtonProps) {
  return (
    <button className="hk-fab" onClick={onCreateGroup} aria-label="Create group">
      <Plus size={24} />
    </button>
  );
}
