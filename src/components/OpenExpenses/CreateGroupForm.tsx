import React, { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";

interface CreateGroupFormProps {
  onSubmit: (name: string, members: string[]) => void;
  onCancel: () => void;
}

export default function CreateGroupForm({ onSubmit, onCancel }: CreateGroupFormProps) {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([""]);
  const memberRefs = useRef<Array<HTMLInputElement | null>>([]);

  const addMember = () => {
    setMembers((prev) => [...prev, ""]);
  };

  // Focus the last input whenever a new member is added
  useEffect(() => {
    const lastIndex = members.length - 1;
    memberRefs.current[lastIndex]?.focus();
  }, [members.length]);

  const updateMember = (index: number, value: string) => {
    const updated = [...members];
    updated[index] = value;
    setMembers(updated);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent form submit
      const value = members[index].trim();
      if (value) {
        if (index === members.length - 1) addMember();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && members.some((m) => m.trim())) {
      onSubmit(
        groupName.trim(),
        members.filter((m) => m.trim())
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Create New Group</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter group name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Members</label>
          <div className="space-y-2">
            {members.map((member, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={member}
                  onChange={(e) => updateMember(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (memberRefs.current[index] = el)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Member name"
                />
                {members.length > 1 && (
                  <button type="button" onClick={() => removeMember(index)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addMember} className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1">
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>

        <div className="flex space-x-3 pt-4">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create Group
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
