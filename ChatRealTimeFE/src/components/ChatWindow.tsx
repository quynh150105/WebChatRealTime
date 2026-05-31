import { FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowLeft, MoreVertical, Pencil, Reply, Send, Trash2, WifiOff } from 'lucide-react';
import Avatar from './Avatar';
import type { ConversationResponse, MessageResponse, UserResponse } from '../types';
import { displayConversationAvatar, displayConversationName, formatTime, isMessageDeleted } from '../utils';

export default function ChatWindow({
  currentUser,
  conversation,
  messages,
  loading,
  connected,
  replyTo,
  onReply,
  onCancelReply,
  onSend,
  onEdit,
  onDelete,
  onLoadOlder,
  hasOlder,
  onBack,
}: {
  currentUser: UserResponse | null;
  conversation: ConversationResponse | null;
  messages: MessageResponse[];
  loading: boolean;
  connected: boolean;
  replyTo: MessageResponse | null;
  onReply: (message: MessageResponse) => void;
  onCancelReply: () => void;
  onSend: (content: string) => Promise<void>;
  onEdit: (message: MessageResponse, content: string) => Promise<void>;
  onDelete: (message: MessageResponse) => Promise<void>;
  onLoadOlder: () => void;
  hasOlder: boolean;
  onBack: () => void;
}) {
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.id, messages.length]);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    await onSend(trimmed);
    setContent('');
  };

  const getMessageSender = (message: MessageResponse) => {
    if (message.senderId === currentUser?.id) {
      return {
        name: currentUser.username || currentUser.fullName || message.senderName,
        avatarUrl: currentUser.avatarUrl || message.senderAvatarUrl,
      };
    }
    const member = conversation?.members.find((item) => item.id === message.senderId);
    return {
      name: member?.fullName || member?.username || message.senderName,
      avatarUrl: message.senderAvatarUrl || member?.avatarUrl,
    };
  };

  if (!conversation) {
    return (
      <section className="hidden h-full place-items-center bg-slate-50 text-sm text-slate-500 md:grid">
        Select a conversation or search a user to start chatting.
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col bg-slate-50">
      <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <button className="rounded-lg p-2 hover:bg-slate-100 md:hidden" onClick={onBack} aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <Avatar src={displayConversationAvatar(conversation, currentUser)} name={displayConversationName(conversation, currentUser)} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-slate-950">{displayConversationName(conversation, currentUser)}</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {!connected && <WifiOff size={13} />}
            {connected ? 'Realtime connected' : 'REST fallback'}
          </div>
        </div>
      </header>

      <div
        className="min-h-0 flex-1 overflow-auto px-4 py-4 scrollbar-thin"
        onScroll={(event) => {
          if (event.currentTarget.scrollTop < 24 && hasOlder && !loading) onLoadOlder();
        }}
      >
        {hasOlder && (
          <button className="mx-auto mb-3 block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100" onClick={onLoadOlder}>
            Load older
          </button>
        )}
        {loading && messages.length === 0 && Array.from({ length: 6 }).map((_, index) => <div key={index} className="mb-3 h-12 animate-pulse rounded-lg bg-slate-200" />)}
        {!loading && messages.length === 0 && <div className="mt-16 text-center text-sm text-slate-500">No messages yet.</div>}
        {messages.map((message) => {
          const mine = message.senderId === currentUser?.id;
          const isEditing = editingId === message.id;
          const deleted = isMessageDeleted(message);
          const sender = getMessageSender(message);
          const actions = deleted ? null : (
            <div className="relative">
              <button className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700" onClick={() => setOpenMenuId(openMenuId === message.id ? null : message.id)} aria-label="Message actions">
                <MoreVertical size={15} />
              </button>
              {openMenuId === message.id && (
                <div className={`absolute bottom-6 z-10 w-32 rounded-lg border border-slate-200 bg-white p-1 text-sm shadow-lg ${mine ? 'left-0' : 'right-0'}`}>
                  <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-slate-100" onClick={() => { onReply(message); setOpenMenuId(null); }}>
                    <Reply size={14} /> Reply
                  </button>
                  {mine && (
                    <>
                      <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-slate-100" onClick={() => { setEditingId(message.id); setEditingContent(message.content || ''); setOpenMenuId(null); }}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-red-600 hover:bg-red-50" onClick={() => { onDelete(message); setOpenMenuId(null); }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
          return (
            <div key={message.id} className={`mb-3 flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
              {mine && actions}
              {!mine && <Avatar size="sm" src={sender.avatarUrl} name={sender.name} />}
              <div className={`group max-w-[78%] min-w-0 ${mine ? 'items-end' : 'items-start'}`}>
                {conversation.type === 'GROUP' && !mine && <div className="mb-1 text-xs font-medium text-slate-500">{sender.name}</div>}
                <div className={`relative rounded-lg px-3 py-2 text-sm shadow-sm ${mine ? 'bg-emerald-600 text-white' : 'bg-white text-slate-900'}`}>
                  {message.replyToMessageId && <div className={`mb-1 border-l-2 pl-2 text-xs ${mine ? 'border-emerald-200 text-emerald-50' : 'border-slate-300 text-slate-500'}`}>Reply #{message.replyToMessageId}</div>}
                  {isEditing ? (
                    <form
                      onSubmit={async (event) => {
                        event.preventDefault();
                        await onEdit(message, editingContent.trim());
                        setEditingId(null);
                      }}
                      className="flex gap-2"
                    >
                      <input className="min-w-0 rounded border border-slate-300 px-2 py-1 text-slate-900" value={editingContent} onChange={(event) => setEditingContent(event.target.value)} />
                      <button className="rounded bg-slate-900 px-2 text-xs text-white">Save</button>
                    </form>
                  ) : (
                    <div className="whitespace-pre-wrap break-words">{deleted ? 'Tin nh\u1eafn \u0111\u00e3 b\u1ecb x\u00f3a' : message.content}</div>
                  )}
                  <div className={`mt-1 text-[11px] ${mine ? 'text-emerald-50' : 'text-slate-400'}`}>{formatTime(message.createdAt)}</div>
                </div>
              </div>
              {!mine && actions}
              {mine && <Avatar size="sm" src={sender.avatarUrl} name={sender.name} />}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form className="border-t border-slate-200 bg-white p-3" onSubmit={submit}>
        {replyTo && (
          <div className="mb-2 flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
            <span className="min-w-0 truncate">Replying to {replyTo.senderName}: {isMessageDeleted(replyTo) ? 'Tin nh\u1eafn \u0111\u00e3 b\u1ecb x\u00f3a' : replyTo.content}</span>
            <button type="button" className="ml-2 font-medium" onClick={onCancelReply}>Cancel</button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            className="max-h-36 min-h-11 flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Type a message"
            value={content}
            rows={1}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
          />
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50" disabled={!content.trim()} aria-label="Send">
            <Send size={18} />
          </button>
        </div>
      </form>
    </section>
  );
}
