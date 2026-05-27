import { FormEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import type { ConversationResponse } from '../types';

export default function EditGroupModal({
  open,
  conversation,
  onClose,
  onSubmit,
}: {
  open: boolean;
  conversation: ConversationResponse | null;
  onClose: () => void;
  onSubmit: (payload: { name: string; avatarUrl?: string }) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(conversation?.name || '');
    setAvatarUrl(conversation?.avatarUrl || '');
  }, [conversation]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await onSubmit({ name: name.trim(), avatarUrl: avatarUrl || undefined });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  return (
    <Modal title="Edit group" open={open} onClose={onClose}>
      <form className="space-y-4" onSubmit={submit}>
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" value={name} onChange={(event) => setName(event.target.value)} placeholder="Group name" />
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} placeholder="Avatar URL optional" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Save changes</button>
      </form>
    </Modal>
  );
}
