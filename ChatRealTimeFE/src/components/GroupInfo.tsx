import { LogOut, Settings, UserMinus, Users } from 'lucide-react';
import Avatar from './Avatar';
import type { ConversationResponse, UserResponse } from '../types';

export default function GroupInfo({
  conversation,
  currentUser,
  onAddMembers,
  onEditGroup,
  onLeave,
  onRemove,
}: {
  conversation: ConversationResponse | null;
  currentUser: UserResponse | null;
  onAddMembers: () => void;
  onEditGroup: () => void;
  onLeave: () => void;
  onRemove: (userId: number) => void;
}) {
  if (!conversation || conversation.type !== 'GROUP') {
    return <aside className="hidden border-l border-slate-200 bg-white p-4 text-sm text-slate-500 lg:block">Conversation info</aside>;
  }
  return (
    <aside className="hidden min-h-0 flex-col border-l border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <Avatar src={conversation.avatarUrl} name={conversation.name} size="lg" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-950">{conversation.name}</div>
            <div className="text-xs text-slate-500">{conversation.members.length} members</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button className="grid place-items-center rounded-lg border border-slate-200 py-2 text-slate-600 hover:bg-slate-100" onClick={onAddMembers} title="Add members"><Users size={18} /></button>
          <button className="grid place-items-center rounded-lg border border-slate-200 py-2 text-slate-600 hover:bg-slate-100" onClick={onEditGroup} title="Edit group"><Settings size={18} /></button>
          <button className="grid place-items-center rounded-lg border border-red-200 py-2 text-red-600 hover:bg-red-50" onClick={onLeave} title="Leave group"><LogOut size={18} /></button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        {conversation.members.map((member) => (
          <div className="flex items-center gap-3 rounded-lg p-2" key={member.id}>
            <Avatar src={member.avatarUrl} name={member.fullName} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-slate-900">{member.fullName}</div>
              <div className="truncate text-xs text-slate-500">{member.email}</div>
            </div>
            {member.id !== currentUser?.id && (
              <button className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" onClick={() => onRemove(member.id)} title="Remove member">
                <UserMinus size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
