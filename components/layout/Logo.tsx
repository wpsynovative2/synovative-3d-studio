import Image from "next/image";

// Transparent, trimmed copies of public/logos/DP 1_1.png (light) and "white yellow@300x.png" (dark).
const LIGHT = { src: "/logos/synovative-logo-light.png", width: 1018, height: 203 };
const DARK = { src: "/logos/synovative-logo-dark.png", width: 1400, height: 276 };

const ALT = "Synovative 3D Studio";
const SIZE = "h-8 w-auto sm:h-9";

/**
 * Colour logo in light theme, white logo in dark theme (switched with CSS, so no flash).
 * `onDark` = sitting on something dark in both themes (hero video, footer) → always the white logo.
 */
export function Logo({ className = "", onDark = false }: { className?: string; onDark?: boolean }) {
  if (onDark) {
    return <Image src={DARK.src} alt={ALT} width={DARK.width} height={DARK.height} priority className={`${SIZE} ${className}`} />;
  }
  return (
    <span className={`inline-flex ${className}`}>
      <Image src={LIGHT.src} alt={ALT} width={LIGHT.width} height={LIGHT.height} priority className={`${SIZE} dark:hidden`} />
      <Image
        src={DARK.src}
        alt={ALT}
        width={DARK.width}
        height={DARK.height}
        priority
        className={`${SIZE} hidden dark:block`}
      />
    </span>
  );
}
