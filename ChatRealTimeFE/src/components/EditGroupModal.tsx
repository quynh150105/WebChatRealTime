import { FormEvent, useEffect, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import Avatar from './Avatar';
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
  onSubmit: (payload: { name: string; avatar?: File }) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<File | undefined>();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(conversation?.name || '');
    setAvatar(undefined);
    setAvatarPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
  }, [conversation, open]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const changeAvatar = (file?: File) => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatar(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  };

  const closeModal = () => {
    changeAvatar(undefined);
    setError(null);
    onClose();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await onSubmit({ name: name.trim(), avatar });
      changeAvatar(undefined);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  return (
    <Modal title="Edit group" open={open} onClose={closeModal}>
      <form className="space-y-4" onSubmit={submit}>
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" value={name} onChange={(event) => setName(event.target.value)} placeholder="Group name" />
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center">
          <Avatar src={avatarPreview || conversation?.avatarUrl} name={name || conversation?.name || 'Group'} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                <ImagePlus size={17} />
                Chọn ảnh
                <input className="sr-only" type="file" accept="image/*" onChange={(event) => changeAvatar(event.target.files?.[0])} />
              </label>
              {avatar && (
                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" onClick={() => changeAvatar(undefined)}>
                  <X size={16} />
                  Bỏ chọn
                </button>
              )}
            </div>
            <div className="mt-2 truncate text-xs text-slate-500">{avatar ? avatar.name : 'Chưa chọn ảnh mới'}</div>
          </div>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Save changes</button>
      </form>
    </Modal>
  );
}
