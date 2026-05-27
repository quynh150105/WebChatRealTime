import { MessageSquare, Plus, Search, Users } from 'lucide-react';
import Avatar from './Avatar';
import type { ConversationResponse, UserResponse } from '../types';
import { displayConversationAvatar, displayConversationName } from '../utils';

export default function ConversationList({
  currentUser,
  conversations,
  activeId,
  loading,
  onSelect,
  onCreateGroup,
  onOpenProfile,
  search,
  setSearch,
  searchResults,
  onDirect,
  searching,
}: {
  currentUser: UserResponse | null;
  conversations: ConversationResponse[];
  activeId?: number;
  loading: boolean;
  onSelect: (conversation: ConversationResponse) => void;
  onCreateGroup: () => void;
  onOpenProfile: () => void;
  search: string;
  setSearch: (value: string) => void;
  searchResults: UserResponse[];
  onDirect: (user: UserResponse) => void;
  searching: boolean;
}) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <div className="mb-4 flex items-center gap-3">
          <button className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left hover:bg-slate-50" onClick={onOpenProfile}>
            <Avatar src={currentUser?.avatarUrl} name={currentUser?.username || currentUser?.email} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-950">{currentUser?.fullName || currentUser?.username}</div>
              <div className="truncate text-xs text-slate-500">{currentUser?.email}</div>
            </div>
          </button>
          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" onClick={onCreateGroup} title="Create group">
            <Plus size={18} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Search users"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>
      {search.trim() ? (
        <div className="min-h-0 flex-1 overflow-auto p-2">
          {searching && <div className="p-3 text-sm text-slate-500">Searching...</div>}
          {!searching && searchResults.length === 0 && <div className="p-3 text-sm text-slate-500">No users found.</div>}
          {searchResults.map((user) => (
            <button
              key={user.id}
              className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-slate-100"
              onClick={() => onDirect(user)}
            >
              <Avatar src={user.avatarUrl} name={user.fullName} />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-slate-900">{user.fullName}</div>
                <div className="truncate text-xs text-slate-500">{user.email}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto p-2 scrollbar-thin">
          {loading && Array.from({ length: 5 }).map((_, index) => <div className="m-2 h-14 animate-pulse rounded-lg bg-slate-100" key={index} />)}
          {!loading && conversations.length === 0 && (
            <div className="grid h-full place-items-center px-6 text-center text-sm text-slate-500">
              <div>
                <MessageSquare className="mx-auto mb-2 text-slate-400" />
                No conversations yet.
              </div>
            </div>
          )}
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation)}
              className={`mb-1 flex w-full items-center gap-3 rounded-lg p-3 text-left ${
                activeId === conversation.id ? 'bg-emerald-50 text-emerald-950' : 'hover:bg-slate-100'
              }`}
            >
              <Avatar src={displayConversationAvatar(conversation, currentUser)} name={displayConversationName(conversation, currentUser)} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{displayConversationName(conversation, currentUser)}</div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  {conversation.type === 'GROUP' && <Users size={12} />}
                  {conversation.type}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
