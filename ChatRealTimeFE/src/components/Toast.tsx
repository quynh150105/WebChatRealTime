import { X } from 'lucide-react';

export default function Toast({
  message,
  onClose,
  variant = 'error',
}: {
  message: string | null;
  onClose: () => void;
  variant?: 'error' | 'success';
}) {
  if (!message) return null;
  const tone =
    variant === 'success'
      ? 'border-emerald-200 text-emerald-700'
      : 'border-red-200 text-red-700';
  const hoverTone = variant === 'success' ? 'hover:bg-emerald-50' : 'hover:bg-red-50';

  return (
    <div className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border bg-white px-4 py-3 text-sm shadow-lg ${tone}`}>
      <span className="min-w-0 flex-1 break-words">{message}</span>
      <button className={`rounded p-1 ${hoverTone}`} onClick={onClose} aria-label="Close">
        <X size={16} />
      </button>
    </div>
  );
}
