import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { register } from '../api/auth';
import AuthShell from '../components/AuthShell';
import Toast from '../components/Toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', fullName: '', email: '', password: '', avatarUrl: '' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const setField = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (form.username.trim().length < 3) return setError('Username must be at least 3 characters');
    if (form.fullName.trim().length < 6) return setError('Full name must be at least 6 characters');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Email is invalid');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setSubmitting(true);
    try {
      await register({ ...form, avatarUrl: form.avatarUrl || undefined });
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Register failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <Toast message={error} onClose={() => setError(null)} />
      <form className="space-y-4" onSubmit={submit}>
        {[
          ['username', 'Username'],
          ['fullName', 'Full name'],
          ['email', 'Email'],
          ['password', 'Password'],
          ['avatarUrl', 'Avatar URL'],
        ].map(([key, label]) => (
          <label className="block text-sm font-medium text-slate-700" key={key}>
            {label}
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={form[key as keyof typeof form]}
              onChange={(event) => setField(key as keyof typeof form, event.target.value)}
              type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'}
              autoComplete={key}
            />
          </label>
        ))}
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
        >
          <UserPlus size={18} />
          {submitting ? 'Creating...' : 'Create account'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link className="font-medium text-emerald-700 hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
