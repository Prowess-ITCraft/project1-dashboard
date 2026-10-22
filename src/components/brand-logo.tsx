import { cn } from "@/lib/utils";

export function BrandLogo({
  variant = "full",
  className,
}: {
  variant?: "full" | "mark";
  className?: string;
}) {
  if (variant === "mark") {
    return (
      <span className={cn("inline-grid size-9 shrink-0 place-items-center overflow-hidden", className)}>
        {/* Official SVG from itcraft.net.in. The word sits in the lower band, so the rail crops to the mark. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo.svg" alt="ITCraft" width={87} height={83} className="h-14 w-auto max-w-none object-cover object-top" />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/logo.svg" alt="ITCraft" width={87} height={83} className={cn("h-10 w-auto", className)} />
  );
}
