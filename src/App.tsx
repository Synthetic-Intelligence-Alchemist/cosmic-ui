import { createContext, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Frame } from "@/components/ui/frame";
import { Button } from "@/components/ui/button";
import { Github, Atom, ExternalLink } from "lucide-react";
import { Outlet } from "react-router";
import type { Paths } from "@/utils/frame";

export const MobileMenuContext = createContext<{
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  showMenu: false,
  setShowMenu: () => {},
});

const NAV_FRAME_PATHS: Paths = [
  {
    show: true,
    style: {
      strokeWidth: "1",
      stroke: "var(--color-frame-1-stroke)",
      fill: "var(--color-frame-1-fill)",
    },
    path: [
      ["M", "28", "0"],
      ["L", "100% - 36", "0"],
      ["L", "100%", "36"],
      ["L", "100%", "100% - 32"],
      ["L", "100% - 32", "100%"],
      ["L", "32", "100%"],
      ["L", "0", "100% - 36"],
      ["L", "0", "32"],
      ["L", "28", "0"],
    ],
  },
  {
    show: true,
    style: {
      strokeWidth: "1",
      stroke: "var(--color-frame-2-stroke)",
      fill: "var(--color-frame-2-fill)",
    },
    path: [
      ["M", "18", "100% - 16"],
      ["L", "100% - 24", "100% - 16"],
      ["L", "100% - 34", "100%"],
      ["L", "30", "100%"],
      ["L", "18", "100% - 16"],
    ],
  },
];

function App() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <MobileMenuContext.Provider value={{ showMenu, setShowMenu }}>
      <div
        className={twMerge([
          "min-h-screen",
          "before:fixed before:inset-0 before:bg-noise before:opacity-60 before:pointer-events-none before:z-[-2]",
          "after:fixed after:inset-0 after:bg-temper after:opacity-10 after:pointer-events-none after:z-[-2]",
        ])}
      >
        <div className="relative">
          <div className="before:fixed before:inset-x-0 before:top-0 before:h-80 before:bg-gradient-to-b before:from-black/60 before:to-transparent before:z-[-1]" />
          <header className="pt-12">
            <div className="container mx-auto px-4">
              <div
                className={twMerge([
                  "relative backdrop-blur-xl",
                  "[--color-frame-1-stroke:var(--color-primary)]/70",
                  "[--color-frame-1-fill:var(--color-primary)]/12",
                  "[--color-frame-2-stroke:var(--color-accent)]/40",
                  "[--color-frame-2-fill:transparent]",
                ])}
              >
                <Frame
                  enableBackdropBlur
                  className="drop-shadow-2xl drop-shadow-primary/40"
                  paths={NAV_FRAME_PATHS}
                />
                <div className="relative flex flex-col gap-6 px-10 py-8 md:flex-row md:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex size-11 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <Atom className="size-5" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold tracking-[0.4em] uppercase text-shadow-lg text-shadow-primary">
                        Cosmic Molecule Lab
                      </div>
                      <div className="text-xs uppercase tracking-[0.3em] text-foreground/60">
                        4-Bromo-2,5-dimethoxyphenylethylamine Visualizer
                      </div>
                    </div>
                  </div>
                  <nav className="flex flex-1 flex-wrap justify-end gap-4 text-xs uppercase tracking-[0.35em] text-foreground/70">
                    <a className="hover:text-shadow-lg hover:text-shadow-primary" href="#visualizer">
                      Visualizer
                    </a>
                    <a className="hover:text-shadow-lg hover:text-shadow-primary" href="#insights">
                      Insights
                    </a>
                    <a className="hover:text-shadow-lg hover:text-shadow-primary" href="https://pubchem.ncbi.nlm.nih.gov/compound/98527" target="_blank" rel="noreferrer">
                      PubChem
                    </a>
                  </nav>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      shape="flat"
                      variant="secondary"
                      className="text-xs"
                      onClick={() => document.getElementById("visualizer")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      Engage Visualizer
                    </Button>
                    <Button
                      type="button"
                      variant="accent"
                      shape="flat"
                      className="text-xs"
                      onClick={() => window.open("https://github.com/rizkimuhammada/cosmic-ui", "_blank")}
                    >
                      <span className="flex items-center gap-2">
                        <Github className="size-4" />
                        Source
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 pt-28 pb-28">
            <Outlet />
          </main>

          <footer className="pb-20 text-center text-xs uppercase tracking-[0.35em] text-foreground/50">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="size-3" />
                <span>Data traced to PubChem CID 98527</span>
              </div>
              <div className="text-foreground/40">
                Crafted with Cosmic UI frames · Powered by Three.js · Deployed for exploratory research
              </div>
            </div>
          </footer>
        </div>
      </div>
    </MobileMenuContext.Provider>
  );
}

export default App;
