import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, AtSign, BadgeCheck, Clock3, Loader2, LogOut, Pencil, Save, Shield, UserRound, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { updateMe } from '../api/users';
import Avatar from '../components/Avatar';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  username: '',
  fullName: '',
  avatarUrl: '',
};

function formatLastSeen(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function valueOrEmpty(value?: string | null) {
  return value?.trim() || 'Chưa cập nhật';
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading, logout, refreshUser } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      username: user.username || '',
      fullName: user.fullName || '',
      avatarUrl: user.avatarUrl || '',
    });
  }, [user]);

  const presenceText = useMemo(() => {
    if (user?.status) return user.status;
    if (user?.lastSeen) return `Last seen ${formatLastSeen(user.lastSeen)}`;
    return '';
  }, [user]);

  const closeEditor = () => {
    setEditing(false);
    setError(null);
    setForm({
      username: user?.username || '',
      fullName: user?.fullName || '',
      avatarUrl: user?.avatarUrl || '',
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      username: form.username.trim(),
      fullName: form.fullName.trim(),
      avatarUrl: form.avatarUrl.trim() || undefined,
    };

    if (!payload.username) {
      setError('Username không được để trống');
      return;
    }
    if (!payload.fullName) {
      setError('Full name không được để trống');
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await updateMe(payload);
      await refreshUser();
      setEditing(false);
      setMessage('Cập nhật thông tin cá nhân thành công');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật thông tin cá nhân');
    } finally {
      setSaving(false);
    }
  };

  const doLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <Loader2 className="animate-spin text-emerald-600" size={18} />
          Đang tải thông tin cá nhân...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-5 text-center shadow-sm">
          <div className="text-sm font-medium text-red-700">Không lấy được thông tin user.</div>
          <button className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={doLogout}>
            Về trang đăng nhập
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-5 sm:px-6 lg:px-8">
      <Toast message={error || message} variant={error ? 'error' : 'success'} onClose={() => { setError(null); setMessage(null); }} />
      <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <button className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100" onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            Back to chat
          </button>
          <div className="flex flex-col items-center text-center">
            <Avatar src={user.avatarUrl} name={user.username || user.email} size="xl" />
            <h1 className="mt-4 max-w-full truncate text-xl font-semibold text-slate-950">{valueOrEmpty(user.fullName)}</h1>
            <p className="max-w-full truncate text-sm text-slate-500">@{valueOrEmpty(user.username)}</p>
            {presenceText && (
              <span className={`mt-3 rounded-full px-3 py-1 text-xs font-medium ${user.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {presenceText}
              </span>
            )}
          </div>
          <div className="mt-6 grid gap-2">
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700" onClick={() => setEditing(true)}>
              <Pencil size={17} />
              Edit profile
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={doLogout}>
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <UserRound className="text-emerald-600" size={20} />
            <h2 className="text-base font-semibold text-slate-950">Thông tin cá nhân</h2>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            <InfoItem label="Username" value={valueOrEmpty(user.username)} />
            <InfoItem label="Full name" value={valueOrEmpty(user.fullName)} />
            <InfoItem label="Email" value={valueOrEmpty(user.email)} icon={<AtSign size={16} />} />
            {user.role && <InfoItem label="Role" value={user.role} icon={<Shield size={16} />} />}
            {user.status && <InfoItem label="Status" value={user.status} icon={<BadgeCheck size={16} />} />}
            {user.lastSeen && <InfoItem label="Last seen" value={formatLastSeen(user.lastSeen)} icon={<Clock3 size={16} />} />}
          </dl>
        </section>

        {editing && (
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-start-2">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Pencil className="text-emerald-600" size={20} />
                <h2 className="text-base font-semibold text-slate-950">Edit profile</h2>
              </div>
              <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={closeEditor} aria-label="Close edit profile">
                <X size={18} />
              </button>
            </div>
            <form className="grid gap-4" onSubmit={submit}>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Username
                <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} required />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Full name
                <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} required />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Avatar URL
                <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" value={form.avatarUrl} onChange={(event) => setForm((current) => ({ ...current, avatarUrl: event.target.value }))} />
              </label>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={closeEditor} disabled={saving}>
                  Hủy
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60" disabled={saving}>
                  {saving ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />}
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <dt className="text-xs font-medium uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 flex min-w-0 items-center gap-2 break-words text-sm font-semibold text-slate-950">
        {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
        <span className="min-w-0 break-words">{value}</span>
      </dd>
    </div>
  );
}
