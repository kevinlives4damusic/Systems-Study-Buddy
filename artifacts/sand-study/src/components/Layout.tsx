import { Link, useLocation } from "wouter";
import { BookOpen, FlaskConical, PenLine, LayoutTemplate, GraduationCap, RotateCcw } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";
import { UNITS } from "@/data/studyData";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: LayoutTemplate },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: FlaskConical },
  { href: "/diagrams", label: "Diagrams", icon: PenLine },
  { href: "/exam", label: "Exam", icon: GraduationCap },
];

function XPBar({ xp }: { xp: number }) {
  const levels = [0, 100, 250, 500, 1000];
  let level = 1;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i]) { level = i + 1; break; }
  }
  const current = levels[level - 1] ?? 0;
  const next = levels[level] ?? levels[levels.length - 1];
  const pct = next > current ? Math.min(100, ((xp - current) / (next - current)) * 100) : 100;
  return (
    <div className="px-4 pb-4">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>Level {level}</span>
        <span>{xp} XP</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MobileNav() {
  const [location] = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="flex">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? location === "/" : location.startsWith(href);
          return (
            <Link key={href} href={href} className="flex-1">
              <div className={cn(
                "flex flex-col items-center py-2 gap-0.5 transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}>
                <Icon className={cn("w-5 h-5 transition-transform", active && "scale-110")} />
                <span className="text-[9px] font-medium">{label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { progress } = useProgress();
  const studiedCount = Object.values(progress.units).filter(u => u.studied).length;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 border-r border-border flex-col bg-sidebar">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm tracking-wide text-sidebar-foreground">SAND Study</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 pl-9">Systems Analysis &amp; Design</p>
        </div>
        <div className="px-3 py-3 border-b border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1 px-1">
            <span>Units studied</span>
            <span className="text-foreground font-semibold">{studiedCount}/{UNITS.length}</span>
          </div>
          {progress.streak > 0 && (
            <div className="flex items-center gap-1.5 px-1 text-xs text-amber-400 mt-1">
              <RotateCcw className="w-3 h-3" />
              <span>{progress.streak}-day streak</span>
            </div>
          )}
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link key={href} href={href}>
                <div
                  data-testid={`nav-${label.toLowerCase().replace(/\s/g, "-")}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors",
                    active
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>
        <XPBar xp={progress.xp} />
      </aside>

      {/* Main content — adds bottom padding on mobile for the nav bar */}
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
