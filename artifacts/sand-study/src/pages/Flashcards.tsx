import { useState, useEffect, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import {
  ChevronLeft, ChevronRight, RotateCcw, CheckCircle2,
  BookOpen, Lightbulb, Trophy, ArrowLeft, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UNITS } from "@/data/studyData";
import { cn } from "@/lib/utils";

const unitAccents = [
  { badge: "bg-blue-100 text-blue-700 border-blue-200", front: "from-blue-50 to-white", border: "border-blue-200", accent: "text-blue-600", ring: "ring-blue-300" },
  { badge: "bg-violet-100 text-violet-700 border-violet-200", front: "from-violet-50 to-white", border: "border-violet-200", accent: "text-violet-600", ring: "ring-violet-300" },
  { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", front: "from-emerald-50 to-white", border: "border-emerald-200", accent: "text-emerald-600", ring: "ring-emerald-300" },
  { badge: "bg-amber-100 text-amber-700 border-amber-200", front: "from-amber-50 to-white", border: "border-amber-200", accent: "text-amber-600", ring: "ring-amber-300" },
  { badge: "bg-rose-100 text-rose-700 border-rose-200", front: "from-rose-50 to-white", border: "border-rose-200", accent: "text-rose-600", ring: "ring-rose-300" },
];

type Rating = "got-it" | "review";

export default function Flashcards() {
  const [, params] = useRoute("/flashcards/:unitId");
  const [, setLocation] = useLocation();

  const unitId = params?.unitId ?? "lu1";
  const unitIndex = UNITS.findIndex(u => u.id === unitId);
  const unit = UNITS[unitIndex >= 0 ? unitIndex : 0];
  const actualIndex = unitIndex >= 0 ? unitIndex : 0;
  const theme = unitAccents[actualIndex];
  const concepts = unit.concepts;

  const [queue, setQueue] = useState<number[]>(() => concepts.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [ratings, setRatings] = useState<Record<number, Rating>>({});
  const [isReviewRound, setIsReviewRound] = useState(false);
  const [done, setDone] = useState(false);
  const [animDir, setAnimDir] = useState<"next" | "prev" | null>(null);

  const current = queue[pos];
  const concept = concepts[current];
  const totalCards = concepts.length;
  const doneCount = Object.keys(ratings).length;
  const masteredCount = Object.values(ratings).filter(r => r === "got-it").length;

  function advanceWithRatings(newRatings: Record<number, Rating>) {
    setFlipped(false);
    setAnimDir("next");
    setTimeout(() => setAnimDir(null), 300);

    const nextPos = pos + 1;
    if (nextPos >= queue.length) {
      const reviewIndices = queue.filter(i => newRatings[i] === "review");
      if (reviewIndices.length > 0 && !isReviewRound) {
        setTimeout(() => {
          setQueue(reviewIndices);
          setPos(0);
          setIsReviewRound(true);
        }, 200);
      } else {
        setTimeout(() => setDone(true), 200);
      }
    } else {
      setTimeout(() => setPos(nextPos), 200);
    }
  }

  function handleGotIt() {
    if (!flipped) { setFlipped(true); return; }
    const newRatings = { ...ratings, [current]: "got-it" as Rating };
    setRatings(newRatings);
    advanceWithRatings(newRatings);
  }

  function handleReview() {
    if (!flipped) { setFlipped(true); return; }
    const newRatings = { ...ratings, [current]: "review" as Rating };
    setRatings(newRatings);
    advanceWithRatings(newRatings);
  }

  function handlePrev() {
    if (pos === 0) return;
    setFlipped(false);
    setAnimDir("prev");
    setTimeout(() => { setPos(p => p - 1); setAnimDir(null); }, 200);
  }

  function handleSkip() {
    if (pos >= queue.length - 1) return;
    setFlipped(false);
    setAnimDir("next");
    setTimeout(() => { setPos(p => p + 1); setAnimDir(null); }, 200);
  }

  function handleRestart() {
    setQueue(concepts.map((_, i) => i));
    setPos(0);
    setFlipped(false);
    setRatings({});
    setIsReviewRound(false);
    setDone(false);
  }

  function handleRestartReview() {
    const reviewIndices = Object.entries(ratings)
      .filter(([, r]) => r === "review")
      .map(([i]) => Number(i));
    if (reviewIndices.length === 0) return;
    setQueue(reviewIndices);
    setPos(0);
    setFlipped(false);
    setRatings(prev => {
      const next = { ...prev };
      reviewIndices.forEach(i => delete next[i]);
      return next;
    });
    setIsReviewRound(true);
    setDone(false);
  }

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (done) return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped(v => !v); }
      if (e.key === "ArrowRight" && flipped) handleGotIt();
      if (e.key === "ArrowLeft" && flipped) handleReview();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flipped, done, pos, queue, ratings, isReviewRound]);

  const progressPct = queue.length > 0 ? (pos / queue.length) * 100 : 100;

  if (done) {
    const reviewCards = Object.entries(ratings).filter(([, r]) => r === "review");
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-primary" />
          </div>

          <Badge variant="outline" className={`text-xs mb-4 ${theme.badge}`}>LU{actualIndex + 1} · {unit.shortTitle}</Badge>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isReviewRound ? "Review Round Complete!" : "Flashcards Complete!"}
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            {isReviewRound
              ? `You reviewed ${queue.length} card${queue.length !== 1 ? "s" : ""} — keep it up!`
              : `You went through all ${totalCards} concepts in this unit.`}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="pt-5 pb-5 text-center">
                <p className="text-3xl font-bold text-emerald-600">{masteredCount}</p>
                <p className="text-xs text-emerald-700 mt-1 font-medium">Got it ✓</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-5 pb-5 text-center">
                <p className="text-3xl font-bold text-amber-600">{reviewCards.length}</p>
                <p className="text-xs text-amber-700 mt-1 font-medium">Need review 🔄</p>
              </CardContent>
            </Card>
          </div>

          {reviewCards.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-3">Cards to review again:</p>
              <div className="flex flex-wrap gap-2 justify-center mb-5">
                {reviewCards.map(([i]) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs border border-amber-200">
                    {concepts[Number(i)].title}
                  </span>
                ))}
              </div>
              <Button onClick={handleRestartReview} className="w-full gap-2 mb-3 h-11">
                <RotateCcw className="w-4 h-4" />
                Review {reviewCards.length} card{reviewCards.length !== 1 ? "s" : ""} again
              </Button>
            </div>
          )}

          <div className="space-y-2.5">
            <Button variant="outline" onClick={handleRestart} className="w-full gap-2 h-11">
              <Layers className="w-4 h-4" />
              Restart all cards
            </Button>
            <Button variant="outline" onClick={() => setLocation(`/practice/${unitId}`)} className="w-full gap-2 h-11">
              <BookOpen className="w-4 h-4" />
              Go to Practice
            </Button>
            <Button variant="ghost" onClick={() => setLocation(`/learn/${unitId}`)} className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Learn
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <button onClick={() => setLocation(`/learn/${unitId}`)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors py-1 pr-2">
          <ArrowLeft className="w-4 h-4" /> Learn
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs shrink-0 ${theme.badge}`}>LU{actualIndex + 1}</Badge>
            <span className="text-xs font-medium text-foreground truncate">{unit.shortTitle}</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground shrink-0 font-medium">
          {pos + 1}/{queue.length}
          {isReviewRound && <span className="ml-1 text-amber-500">🔄</span>}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-secondary">
        <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Round badge */}
      {isReviewRound && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs text-amber-700 font-medium">Review round — cards you marked for practice</span>
        </div>
      )}

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Dot progress */}
          <div className="flex justify-center gap-1.5 mb-6">
            {queue.map((conceptIdx, i) => {
              const rating = ratings[conceptIdx];
              return (
                <div key={i} className={cn(
                  "rounded-full transition-all duration-300",
                  i === pos ? "w-5 h-2 bg-primary" :
                  rating === "got-it" ? "w-2 h-2 bg-emerald-400" :
                  rating === "review" ? "w-2 h-2 bg-amber-400" :
                  i < pos ? "w-2 h-2 bg-primary/40" : "w-2 h-2 bg-border"
                )} />
              );
            })}
          </div>

          {/* Flashcard */}
          <div
            className={cn(
              "relative transition-all duration-300",
              animDir === "next" ? "opacity-0 translate-x-4" :
              animDir === "prev" ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
            )}
            style={{ perspective: "1200px" }}
          >
            <div
              onClick={() => setFlipped(v => !v)}
              className="relative cursor-pointer select-none"
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
                minHeight: 320,
              }}
            >
              {/* Front */}
              <div
                className={cn(
                  "absolute inset-0 rounded-3xl border-2 shadow-xl bg-gradient-to-br flex flex-col items-center justify-center p-8 text-center",
                  theme.border, theme.front
                )}
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className={cn("w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5", theme.accent)}>
                  <Layers className="w-6 h-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-4">{concept.title}</h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                  <span className="animate-bounce inline-block">👆</span> Tap to reveal definition
                </p>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 rounded-3xl border-2 border-slate-200 shadow-xl bg-white flex flex-col overflow-hidden"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  <h3 className={cn("text-sm font-bold mb-4 flex items-center gap-2", theme.accent)}>
                    <BookOpen className="w-4 h-4" /> {concept.title}
                  </h3>
                  <div className="prose prose-sm max-w-none mb-4">
                    {concept.description.split("\n\n").map((para, i) => (
                      <p key={i} className="text-sm leading-relaxed text-foreground mb-3 last:mb-0 whitespace-pre-line">{para}</p>
                    ))}
                  </div>

                  {concept.keyPoints && concept.keyPoints.length > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">Key Points</p>
                      <ul className="space-y-1.5">
                        {concept.keyPoints.map((kp, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                            <span className="text-foreground leading-relaxed">{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {concept.example && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1.5 flex items-center gap-1.5">
                        <Lightbulb className="w-3 h-3" /> Example
                      </p>
                      <p className="text-xs text-amber-800 leading-relaxed whitespace-pre-line">{concept.example}</p>
                    </div>
                  )}
                </div>

                {/* Rating buttons */}
                <div className="shrink-0 border-t border-border p-4 flex gap-3">
                  <button
                    onClick={e => { e.stopPropagation(); handleReview(); }}
                    className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 active:scale-95 transition-all">
                    <span className="text-xl">🔄</span>
                    <span className="text-xs font-semibold text-amber-700">Need review</span>
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleGotIt(); }}
                    className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 active:scale-95 transition-all">
                    <span className="text-xl">✅</span>
                    <span className="text-xs font-semibold text-emerald-700">Got it!</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card shadow stack effect */}
            {pos + 1 < queue.length && (
              <>
                <div className="absolute inset-0 rounded-3xl border-2 border-slate-100 bg-slate-50 -z-10"
                  style={{ transform: "translateY(6px) scale(0.97)" }} />
                {pos + 2 < queue.length && (
                  <div className="absolute inset-0 rounded-3xl border-2 border-slate-100 bg-slate-50 -z-20"
                    style={{ transform: "translateY(12px) scale(0.94)" }} />
                )}
              </>
            )}
          </div>

          {/* Keyboard hint */}
          <p className="hidden md:flex items-center justify-center gap-4 text-xs text-muted-foreground mt-6">
            <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px]">Space</kbd> flip</span>
            {flipped && (
              <>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px]">←</kbd> review</span>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px]">→</kbd> got it</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Footer nav */}
      <div className="px-4 py-3 border-t border-border bg-background/80 backdrop-blur-sm flex items-center justify-between sticky bottom-0 pb-safe"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))" }}>
        <Button variant="ghost" size="sm" onClick={handlePrev} disabled={pos === 0} className="gap-1.5 text-muted-foreground">
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <div className="text-center">
          {!flipped ? (
            <button onClick={() => setFlipped(true)}
              className="text-xs text-primary font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors">
              Tap card to flip
            </button>
          ) : (
            <p className="text-xs text-muted-foreground">Rate to continue</p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={handleSkip} disabled={pos >= queue.length - 1} className="gap-1.5 text-muted-foreground">
          Skip <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
