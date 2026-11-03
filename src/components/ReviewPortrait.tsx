import { useState } from "react";

export default function ReviewPortrait({ avatar, name }: { avatar: string; name: string }) {
  const src = `${import.meta.env?.BASE_URL ?? "/"}avatars/${avatar}`;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const initials = name.split(/[\s,]+/).slice(0, 2).map((part) => part[0]).join("");

  return (
    <div className="review-portrait" aria-hidden="true">
      {failedSrc === src ? <span>{initials}</span> : (
        <img src={src} alt="" width="72" height="72" loading="lazy" decoding="async" onError={() => setFailedSrc(src)} />
      )}
    </div>
  );
}
