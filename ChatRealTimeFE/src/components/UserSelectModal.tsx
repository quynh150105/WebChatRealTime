import { FormEvent, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Modal from './Modal';
import Avatar from './Avatar';
import { searchUsers } from '../api/users';
import type { UserResponse } from '../types';

export default function UserSelectModal({
  open,
  title,
  mode,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  mode: 'group' | 'members';
  onClose: () => void;
  onSubmit: (payload: { name?: string; avatarUrl?: string; memberIds: number[] }) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<UserResponse[]>([]);
  const [selected, setSelected] = useState<UserResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || keyword.trim().length < 2) {
      setResults([]);
      return;
    }
    const timeout = window.setTimeout(async () => {
      try {
        setResults(await searchUsers(keyword));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      }
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [keyword, open]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (mode === 'group' && name.trim().length < 2) return setError('Group name is required');
    if (selected.length === 0) return setError('Select at least one user');
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), avatarUrl: avatarUrl || undefined, memberIds: selected.map((user) => user.id) });
      setName('');
      setAvatarUrl('');
      setKeyword('');
      setSelected([]);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  const toggle = (user: UserResponse) => {
    setSelected((current) => (current.some((item) => item.id === user.id) ? current.filter((item) => item.id !== user.id) : [...current, user]));
  };

  return (
    <Modal title={title} open={open} onClose={onClose}>
      <form className="space-y-4" onSubmit={submit}>
        {mode === 'group' && (
          <>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Group name" value={name} onChange={(event) => setName(event.target.value)} />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Avatar URL optional" value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} />
          </>
        )}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Search users" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {selected.map((user) => (
            <button type="button" key={user.id} className="rounded-lg bg-emerald-50 px-2 py-1 text-xs text-emerald-700" onClick={() => toggle(user)}>
              {user.fullName}
            </button>
          ))}
        </div>
        <div className="max-h-56 overflow-auto rounded-lg border border-slate-200 p-1">
          {results.map((user) => {
            const active = selected.some((item) => item.id === user.id);
            return (
              <button type="button" key={user.id} className={`flex w-full items-center gap-3 rounded-lg p-2 text-left ${active ? 'bg-emerald-50' : 'hover:bg-slate-100'}`} onClick={() => toggle(user)}>
                <Avatar src={user.avatarUrl} name={user.fullName} size="sm" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-900">{user.fullName}</div>
                  <div className="truncate text-xs text-slate-500">{user.email}</div>
                </div>
              </button>
            );
          })}
          {keyword.trim().length >= 2 && results.length === 0 && <div className="p-3 text-sm text-slate-500">No users found.</div>}
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </Modal>
  );
}
