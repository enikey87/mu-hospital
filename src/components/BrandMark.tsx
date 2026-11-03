export default function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M17 10h12L11 38H0zm17 0h12L28 38H16z" />
    </svg>
  );
}
