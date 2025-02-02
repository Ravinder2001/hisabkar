import React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface FloatingActionButtonProps {
  onCreateGroup: () => void;
  onJoinGroup: () => void;
}

export default function FloatingActionButton({ onCreateGroup, onJoinGroup }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-black">
            <Plus className={`h-6 w-6 transition-transform duration-200 text-white ${isOpen ? "rotate-45" : ""}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white">
          <DropdownMenuItem className="cursor-pointer" onClick={onCreateGroup}>
            Create Group
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={onJoinGroup}>
            Join Group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
