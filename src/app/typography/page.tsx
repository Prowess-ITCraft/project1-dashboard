import { Albert_Sans, Gloock, Hanken_Grotesk, IBM_Plex_Mono, Martian_Mono, Newsreader, Schibsted_Grotesk, Young_Serif } from "next/font/google";

const newsreader = Newsreader({ subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"] });
const hanken = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"] });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"] });
const young = Young_Serif({ subsets: ["latin"], weight: "400" });
const schibsted = Schibsted_Grotesk({ subsets: ["latin"], weight: ["400", "600"] });
const martian = Martian_Mono({ subsets: ["latin"], weight: ["400"] });
const gloock = Gloock({ subsets: ["latin"], weight: "400" });
const albert = Albert_Sans({ subsets: ["latin"], weight: ["400", "600"] });

const pairings = [
  { name: "A, in use", display: newsreader, sans: hanken, mono: plex, note: "Newsreader, Hanken Grotesk, IBM Plex Mono" },
  { name: "B", display: young, sans: schibsted, mono: martian, note: "Young Serif, Schibsted Grotesk, Martian Mono" },
  { name: "C", display: gloock, sans: albert, mono: plex, note: "Gloock, Albert Sans, IBM Plex Mono. Fragment Mono is not in the Google set used here." },
];

export default function TypographyPage() {
  if (process.env.NODE_ENV === "production") {
    return (
      <main className="min-h-[100dvh] bg-[#0a0a0a] px-6 py-16 text-[#ededed]">
        <h1 className="font-display text-4xl">Specimen unavailable</h1>
        <p className="mt-3 max-w-md text-sm text-[#a1a1a1]">This type specimen is for local development. The dashboard uses pairing A.</p>
      </main>
    );
  }
  return (
    <main className="min-h-[100dvh] bg-[#0a0a0a] px-6 py-10 text-[#ededed]">
      <h1 className={`${newsreader.className} text-4xl`}>Typography specimen</h1>
      <p className={`${hanken.className} mt-2 max-w-xl text-sm text-[#a1a1a1]`}>
        Pairing A is the live dashboard. This route is for review and returns not found in production.
      </p>
      <div className="mt-8 grid gap-10">
        {pairings.map((pairing) => (
          <section key={pairing.name} className="grid gap-6 border-t border-[#1f1f1f] pt-6 lg:grid-cols-2">
            <div>
              <p className={`${pairing.mono.className} text-xs text-[#a1a1a1]`}>{pairing.name}</p>
              <h2 className={`${pairing.display.className} mt-2 text-5xl leading-[1.1]`}>Dashboard</h2>
              <p className={`${pairing.sans.className} mt-3 max-w-md text-base leading-relaxed text-[#a1a1a1]`}>{pairing.note}</p>
              <p className={`${pairing.display.className} mt-4 text-5xl tabular-nums`}>102</p>
              <p className={`${pairing.display.className} text-3xl tabular-nums`}>91%</p>
              <p className={`${pairing.sans.className} text-2xl tabular-nums`}>2h 40m</p>
              <p className={`${pairing.sans.className} text-xl tabular-nums`}>24 of 102</p>
              <p className={`${pairing.mono.className} mt-2 text-sm`}>P1-2627-0002</p>
              <p className={`${pairing.sans.className} text-xs`}>Updated 14:06 IST</p>
            </div>
            <div className="rounded-[12px] bg-[#f3f4f6] p-5 text-[#18181b]">
              <h2 className={`${pairing.display.className} text-4xl leading-[1.1]`}>Dashboard</h2>
              <p className={`${pairing.sans.className} mt-2 text-sm text-[#52525b]`}>Light specimen for the same pairing.</p>
              <p className={`${pairing.display.className} mt-4 text-4xl tabular-nums`}>24 of 102</p>
              <p className={`${pairing.mono.className} mt-2 text-sm`}>P1-2627-0002</p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
