import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addGroupMembers, createDirectConversation, createGroupConversation, getConversation, getConversations, leaveGroup, removeGroupMember, updateGroup } from '../api/conversations';
import { deleteMessage, getMessages, sendMessage as sendMessageRest, updateMessage } from '../api/messages';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import GroupInfo from '../components/GroupInfo';
import Toast from '../components/Toast';
import UserSelectModal from '../components/UserSelectModal';
import EditGroupModal from '../components/EditGroupModal';
import { useAuth } from '../context/AuthContext';
import type { ConversationResponse, MessageResponse, UserResponse } from '../types';
import { ChatSocket } from '../ws/chatSocket';
import { isMessageDeleted, markMessageDeleted, mergeMessages, normalizeMessage } from '../utils';
import { searchUsers } from '../api/users';

export default function ChatPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [active, setActive] = useState<ConversationResponse | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [messagePage, setMessagePage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<UserResponse[]>([]);
  const [searching, setSearching] = useState(false);
  const [replyTo, setReplyTo] = useState<MessageResponse | null>(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const socketRef = useRef<ChatSocket | null>(null);

  const upsertConversation = useCallback((conversation: ConversationResponse) => {
    setConversations((current) => [conversation, ...current.filter((item) => item.id !== conversation.id)]);
  }, []);

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load conversations'))
      .finally(() => setLoadingConversations(false));
  }, []);

  useEffect(() => {
    if (!token) return;
    socketRef.current = new ChatSocket();
    socketRef.current.connect(token, () => {
      setConnected(true);
      if (active) {
        socketRef.current?.subscribe(active.id, (message) => {
          setMessages((current) => mergeMessages(current, [message]));
          setReplyTo((current) => (current?.id === message.id && isMessageDeleted(message) ? normalizeMessage(message) : current));
          setConversations((current) => {
            const found = current.find((conversation) => conversation.id === message.conversationId);
            return found ? [found, ...current.filter((conversation) => conversation.id !== found.id)] : current;
          });
        });
      }
    }, () => setConnected(false));
    return () => socketRef.current?.disconnect();
  }, [token]);

  const subscribeActive = useCallback((conversationId: number) => {
    socketRef.current?.subscribe(conversationId, (message) => {
      setMessages((current) => mergeMessages(current, [message]));
      setReplyTo((current) => (current?.id === message.id && isMessageDeleted(message) ? normalizeMessage(message) : current));
      setConversations((current) => {
        const found = current.find((conversation) => conversation.id === message.conversationId);
        return found ? [found, ...current.filter((conversation) => conversation.id !== found.id)] : current;
      });
    });
  }, []);

  const openConversation = useCallback(
    async (conversation: ConversationResponse) => {
      setMobileChatOpen(true);
      setLoadingMessages(true);
      setReplyTo(null);
      try {
        const [detail, page] = await Promise.all([getConversation(conversation.id), getMessages(conversation.id, 0, 20)]);
        setActive(detail);
        upsertConversation(detail);
        setMessages(page.content.slice().reverse());
        setMessagePage(page.page);
        setTotalPages(page.totalPages);
        subscribeActive(detail.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not open conversation');
      } finally {
        setLoadingMessages(false);
      }
    },
    [subscribeActive, upsertConversation],
  );

  useEffect(() => {
    if (search.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const timeout = window.setTimeout(async () => {
      setSearching(true);
      try {
        setSearchResults(await searchUsers(search));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const startDirect = async (target: UserResponse) => {
    try {
      const conversation = await createDirectConversation(target.id);
      setSearch('');
      upsertConversation(conversation);
      await openConversation(conversation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start conversation');
    }
  };

  const loadOlder = async () => {
    if (!active || messagePage >= totalPages - 1) return;
    try {
      const next = await getMessages(active.id, messagePage + 1, 20);
      setMessages((current) => mergeMessages(next.content.slice().reverse(), current));
      setMessagePage(next.page);
      setTotalPages(next.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load older messages');
    }
  };

  const sendMessage = async (content: string) => {
    if (!active) return;
    const payload = { conversationId: active.id, content, typeMessage: 'TEXT' as const, replyToMessageId: replyTo?.id };
    setReplyTo(null);
    if (socketRef.current?.send(payload)) return;
    try {
      const response = await sendMessageRest(payload);
      setMessages((current) => mergeMessages(current, [response]));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send message');
    }
  };

  const updateActiveConversation = (conversation: ConversationResponse) => {
    setActive(conversation);
    upsertConversation(conversation);
  };

  const hasOlder = useMemo(() => messagePage < totalPages - 1, [messagePage, totalPages]);

  return (
    <main className="h-screen overflow-hidden bg-slate-100">
      <Toast message={error} onClose={() => setError(null)} />
      <div className="flex h-full">
        <div className={`${mobileChatOpen ? 'hidden' : 'block'} h-full w-full md:block md:w-80 xl:w-96`}>
          <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
            <span className="font-semibold">ChatRealTime</span>
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" onClick={logout} aria-label="Logout"><LogOut size={18} /></button>
          </div>
          <ConversationList
            currentUser={user}
            conversations={conversations}
            activeId={active?.id}
            loading={loadingConversations}
            onSelect={openConversation}
            onCreateGroup={() => setGroupModalOpen(true)}
            onOpenProfile={() => navigate('/profile')}
            search={search}
            setSearch={setSearch}
            searchResults={searchResults}
            onDirect={startDirect}
            searching={searching}
          />
        </div>
        <div className={`${mobileChatOpen ? 'block' : 'hidden'} h-full min-w-0 flex-1 md:block`}>
          <ChatWindow
            currentUser={user}
            conversation={active}
            messages={messages}
            loading={loadingMessages}
            connected={connected}
            replyTo={replyTo}
            onReply={setReplyTo}
            onCancelReply={() => setReplyTo(null)}
            onSend={sendMessage}
            onLoadOlder={loadOlder}
            hasOlder={hasOlder}
            onBack={() => setMobileChatOpen(false)}
            onEdit={async (message, content) => {
              const updated = await updateMessage(message.id, content);
              setMessages((current) => mergeMessages(current, [updated]));
            }}
            onDelete={async (message) => {
              const deleted = await deleteMessage(message.id);
              const deletedMessage = markMessageDeleted({ ...message, ...deleted });
              setMessages((current) => mergeMessages(current, [deletedMessage]));
              setReplyTo((current) => (current?.id === deletedMessage.id ? deletedMessage : current));
            }}
          />
        </div>
        <div className="hidden w-80 xl:block">
          <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4">
            <span className="font-semibold text-slate-950">ChatRealTime</span>
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" onClick={logout} aria-label="Logout"><LogOut size={18} /></button>
          </div>
          <div className="h-[calc(100%-3rem)]">
            <GroupInfo
              conversation={active}
              currentUser={user}
              onAddMembers={() => setMembersModalOpen(true)}
              onEditGroup={() => setEditGroupOpen(true)}
              onLeave={async () => {
                if (!active) return;
                try {
                  await leaveGroup(active.id);
                  setConversations((current) => current.filter((item) => item.id !== active.id));
                  setActive(null);
                  setMessages([]);
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Could not leave group');
                }
              }}
              onRemove={async (userId) => {
                if (!active) return;
                try {
                  updateActiveConversation(await removeGroupMember(active.id, userId));
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Could not remove member');
                }
              }}
            />
          </div>
        </div>
      </div>

      <UserSelectModal
        open={groupModalOpen}
        title="Create group"
        mode="group"
        onClose={() => setGroupModalOpen(false)}
        onSubmit={async ({ name, avatarUrl, memberIds }) => {
          const conversation = await createGroupConversation({ type: 'GROUP', name: name || 'New group', avatarUrl, memberIds });
          upsertConversation(conversation);
          await openConversation(conversation);
        }}
      />
      <UserSelectModal
        open={membersModalOpen}
        title="Add members"
        mode="members"
        onClose={() => setMembersModalOpen(false)}
        onSubmit={async ({ memberIds }) => {
          if (!active) return;
          updateActiveConversation(await addGroupMembers(active.id, memberIds));
        }}
      />
      <EditGroupModal
        open={editGroupOpen}
        conversation={active}
        onClose={() => setEditGroupOpen(false)}
        onSubmit={async (payload) => {
          if (!active) return;
          updateActiveConversation(await updateGroup(active.id, payload));
        }}
      />
    </main>
  );
}
