import React, { useState } from "react";
import { Plus, Users, Trash2 } from "lucide-react";
import CreateGroupForm from "./CreateGroupForm";
import type { Group } from "../../pages/OpenExpenses/OpenExpenses";

interface GroupsViewProps {
  groups: Group[];
  onSelectGroup: (group: Group) => void;
  onCreateGroup: (name: string, members: string[]) => void;
  onDeleteGroup: (groupId: string) => void;
}

export default function GroupsView({ groups, onSelectGroup, onCreateGroup, onDeleteGroup }: GroupsViewProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Groups</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Group</span>
        </button>
      </div>

      {showCreateForm && <CreateGroupForm onSubmit={onCreateGroup} onCancel={() => setShowCreateForm(false)} />}

      {groups.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
          <p className="text-gray-600">Create your first group to start tracking expenses</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-gray-900">{group.name}</h3>
                <button onClick={() => onDeleteGroup(group.id)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">{group.members.length} members</p>
                <p className="text-sm text-gray-600">{group.expenses.length} expenses</p>
                <p className="text-sm font-medium text-gray-900">Total: ₹{group.expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</p>
              </div>
              <button
                onClick={() => onSelectGroup(group)}
                className="w-full bg-gray-100 text-gray-900 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                View Group
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
