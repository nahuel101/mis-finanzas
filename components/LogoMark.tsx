export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-f-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f7dfb" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="30" fill="#0e1220" />
      <path
        d="M40 30h50a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H58v14h26a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H58v22a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6V36a6 6 0 0 1 6-6Z"
        fill="url(#logo-f-grad)"
      />
    </svg>
  );
}
