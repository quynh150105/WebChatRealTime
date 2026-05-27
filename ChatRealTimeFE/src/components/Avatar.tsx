import { User } from 'lucide-react';

export default function Avatar({
  src,
  name,
  size = 'md',
}: {
  src?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-24 w-24 text-3xl',
  };
  const initials = (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  if (src) {
    return <img className={`${sizes[size]} shrink-0 rounded-lg object-cover`} src={src} alt={name || 'avatar'} />;
  }
  return (
    <div className={`${sizes[size]} grid shrink-0 place-items-center rounded-lg bg-slate-200 font-semibold text-slate-600`}>
      {initials || <User size={16} />}
    </div>
  );
}
