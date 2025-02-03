import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

interface FloatingActionButtonProps {
  onCreateGroup: () => void;
}

export default function FloatingActionButton({ onCreateGroup }: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-6 right-6">
      <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-black" onClick={onCreateGroup}>
        <Plus className={`h-6 w-6 transition-transform duration-200 text-white`} />
      </Button>
    </div>
  );
}
