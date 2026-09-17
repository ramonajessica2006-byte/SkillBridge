import React from 'react';

export const AVATARS = [
  { id: 'avatar-01', skin: '#F2C6A0', hair: '#3C2415', shirt: '#2563EB', style: 'short' },
  { id: 'avatar-02', skin: '#D99A6C', hair: '#1F2937', shirt: '#0F766E', style: 'curly' },
  { id: 'avatar-03', skin: '#8D5524', hair: '#171717', shirt: '#7C3AED', style: 'short' },
  { id: 'avatar-04', skin: '#F7D7BE', hair: '#A16207', shirt: '#DB2777', style: 'long' },
  { id: 'avatar-05', skin: '#C68642', hair: '#2D1B0E', shirt: '#EA580C', style: 'long' },
  { id: 'avatar-06', skin: '#E0AC69', hair: '#111827', shirt: '#0891B2', style: 'curly' },
  { id: 'avatar-07', skin: '#6F4518', hair: '#0F172A', shirt: '#16A34A', style: 'short' },
  { id: 'avatar-08', skin: '#F2C6A0', hair: '#6B21A8', shirt: '#475569', style: 'long' },
  { id: 'avatar-09', skin: '#D99A6C', hair: '#78350F', shirt: '#CA8A04', style: 'curly' },
  { id: 'avatar-10', skin: '#8D5524', hair: '#334155', shirt: '#DC2626', style: 'short' },
  { id: 'avatar-11', skin: '#F7D7BE', hair: '#BE185D', shirt: '#4F46E5', style: 'long' },
  { id: 'avatar-12', skin: '#C68642', hair: '#292524', shirt: '#15803D', style: 'short' },
  { id: 'avatar-13', skin: '#E0AC69', hair: '#92400E', shirt: '#9333EA', style: 'long' },
  { id: 'avatar-14', skin: '#6F4518', hair: '#1E293B', shirt: '#0369A1', style: 'curly' },
  { id: 'avatar-15', skin: '#F2C6A0', hair: '#374151', shirt: '#BE123C', style: 'short' },
  { id: 'avatar-16', skin: '#D99A6C', hair: '#0F172A', shirt: '#0F766E', style: 'long' },
];

export const getAvatar = (avatarId) => AVATARS.find((avatar) => avatar.id === avatarId);

export const AvatarIcon = ({ avatarId, size = 48, className = '' }) => {
  const avatar = getAvatar(avatarId);
  if (!avatar) return null;

  const hairPath = avatar.style === 'long'
    ? 'M18 31V17c0-7 5-11 14-11s14 4 14 11v14h-5V19c-2 2-5 3-9 3s-7-1-9-3v12z'
    : avatar.style === 'curly'
      ? 'M17 23c-2-8 4-17 15-17s17 9 15 17l-4-2-2-7-4 3-5-4-5 4-5-3-2 7z'
      : 'M18 22c0-9 5-16 14-16s14 7 14 16l-5-3-2-7H25l-3 7z';

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} role="img" aria-label="Selected profile avatar">
      <circle cx="32" cy="32" r="32" fill={avatar.shirt} />
      <path d="M14 64c1-13 8-20 18-20s17 7 18 20z" fill="#F8FAFC" opacity="0.95" />
      <rect x="27" y="37" width="10" height="10" rx="4" fill={avatar.skin} />
      <circle cx="32" cy="25" r="13" fill={avatar.skin} />
      <path d={hairPath} fill={avatar.hair} />
      <circle cx="27" cy="26" r="1.5" fill="#172033" />
      <circle cx="37" cy="26" r="1.5" fill="#172033" />
      <path d="M28 32c2 2 6 2 8 0" fill="none" stroke="#7C3F2C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

const AvatarSelector = ({ value, onChange }) => (
  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3" role="radiogroup" aria-label="Profile avatars">
    {AVATARS.map((avatar) => {
      const selected = value === avatar.id;
      return (
        <button
          key={avatar.id}
          type="button"
          role="radio"
          aria-checked={selected}
          aria-label={`Choose ${avatar.id}`}
          onClick={() => onChange(avatar.id)}
          className={`aspect-square rounded-2xl flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
            selected
              ? 'border-2 border-brand-600 bg-brand-50 shadow-md ring-2 ring-brand-200'
              : 'border border-slate-200 bg-slate-50 hover:border-brand-300 hover:bg-brand-50/50'
          }`}
        >
          <AvatarIcon avatarId={avatar.id} size={56} />
        </button>
      );
    })}
  </div>
);

export default AvatarSelector;