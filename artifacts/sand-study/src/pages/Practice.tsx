import { useState, useCallback, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, Eye, HelpCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProgress } from "@/contexts/ProgressContext";
import { UNITS, type Exercise } from "@/data/studyData";
import { cn } from "@/lib/utils";

const unitAccents = [
  "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "bg-rose-500/20 text-rose-300 border-rose-500/30",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function deriveCorrectAnswers(items: string[], categories: string[]): Record<number, string> {
  const result: Record<number, string> = {};
  const c0 = categories[0] ?? "";
  const c1 = categories[1] ?? c0;

  items.forEach((item, i) => {
    const low = item.toLowerCase();
    if (c0.includes("Analysis") && c1.includes("Design")) {
      const designWords = ["form", "table", "database", "layout", "encrypt", "hash", "field", "key", "foreign", "authentication", "bcrypt", "screen"];
      result[i] = designWords.some(w => low.includes(w)) ? c1 : c0;
    } else if (c0.includes("Functional") && c1.includes("Non-Functional")) {
      const nonFunc = ["24/7", "password", "response", "available", "secure", "encrypt", "protect", "performance", "2 second", "fast"];
      result[i] = nonFunc.some(w => low.includes(w)) ? c1 : c0;
    } else if (c0.includes("Internal") && c1.includes("External")) {
      const external = ["parent", "nanny", "client", "customer", "regulatory", "payment", "provider", "multi-national", "hiring"];
      result[i] = external.some(w => low.includes(w)) ? c1 : c0;
    } else if (c0.includes("Visibility") || c0.includes("Affordance")) {
      const affordance = ["styled as plain", "link", "clickable area", "text with no underline"];
      const good = ["prominently", "clearly", "visible at the top", "green tick", "placeholder"];
      if (good.some(w => low.includes(w))) result[i] = "Good Design";
      else if (affordance.some(w => low.includes(w))) result[i] = categories[1] ?? c0;
      else result[i] = categories[0] ?? c0;
    } else {
      const testMap: [string, string][] = [
        ["calculateBookingFee", "Unit Testing"],
        ["booking module correctly updates", "Integration Testing"],
        ["stakeholders from", "UAT"],
        ["5,000 simultaneous", "Performance Testing"],
        ["after fixing", "Regression Testing"],
        ["full integrated system", "System Testing"],
      ];
      let matched = false;
      for (const [k, v] of testMap) {
        if (low.includes(k.toLowerCase())) { result[i] = v; matched = true; break; }
      }
      if (!matched) result[i] = categories[i % categories.length];
    }
  });
  return result;
}

// ── CLASSIFY — full HTML5 drag & drop ────────────────────────────────────────
function ClassifyExercise({ exercise, onScore }: { exercise: Exercise; onScore: (c: boolean) => void }) {
  const categories = exercise.categories ?? [];
  const items = exercise.items ?? [];
  const correctAnswers = deriveCorrectAnswers(items, categories);

  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [overCat, setOverCat] = useState<string | null>(null);

  const unassigned = items.filter((_, i) => assignments[i] === undefined);
  const assigned = Object.keys(assignments).length;

  function handleDragStart(e: React.DragEvent, idx: number) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("itemIndex", String(idx));
    setDraggingIdx(idx);
  }

  function handleDragEnd() {
    setDraggingIdx(null);
    setOverCat(null);
  }

  function handleCatDragOver(e: React.DragEvent, cat: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverCat(cat);
  }

  function handleCatDrop(e: React.DragEvent, cat: string) {
    e.preventDefault();
    const idx = Number(e.dataTransfer.getData("itemIndex"));
    setAssignments(prev => ({ ...prev, [idx]: cat }));
    setDraggingIdx(null);
    setOverCat(null);
  }

  function handleUnassignedDragOver(e: React.DragEvent) {
    e.preventDefault();
    setOverCat("__unassigned__");
  }

  function handleUnassignedDrop(e: React.DragEvent) {
    e.preventDefault();
    const idx = Number(e.dataTransfer.getData("itemIndex"));
    setAssignments(prev => { const n = { ...prev }; delete n[idx]; return n; });
    setOverCat(null);
  }

  function handleSubmit() {
    setSubmitted(true);
    const correct = items.filter((_, i) => assignments[i] === correctAnswers[i]).length;
    onScore(correct >= Math.ceil(items.length / 2));
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{exercise.question}</p>

      {/* Unassigned pool */}
      {!submitted && (
        <div
          className={cn(
            "min-h-14 border-2 border-dashed rounded-xl p-3 mb-5 transition-colors",
            overCat === "__unassigned__" ? "border-primary bg-primary/5" : "border-border bg-card/30"
          )}
          onDragOver={handleUnassignedDragOver}
          onDragLeave={() => setOverCat(null)}
          onDrop={handleUnassignedDrop}
        >
          {unassigned.length === 0 && assigned > 0 ? (
            <p className="text-xs text-muted-foreground italic text-center">All items assigned — drag back here to unassign</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {items.map((item, i) => {
                if (assignments[i] !== undefined) return null;
                return (
                  <div
                    key={i}
                    draggable
                    onDragStart={e => handleDragStart(e, i)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs cursor-grab active:cursor-grabbing select-none transition-all",
                      draggingIdx === i ? "opacity-40 scale-95" : "border-border bg-card hover:border-primary/60 hover:bg-primary/5"
                    )}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Category drop zones */}
      <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, 3)}, 1fr)` }}>
        {categories.map(cat => {
          const assignedItems = items.map((item, i) => ({ item, i })).filter(({ i }) => assignments[i] === cat);
          const isOver = overCat === cat;
          return (
            <div
              key={cat}
              onDragOver={e => handleCatDragOver(e, cat)}
              onDragLeave={() => setOverCat(null)}
              onDrop={e => handleCatDrop(e, cat)}
              className={cn(
                "border-2 rounded-xl p-3 min-h-28 transition-all",
                isOver && !submitted ? "border-primary bg-primary/10 scale-[1.01]" : "border-border bg-card/40"
              )}
            >
              <p className="text-xs font-semibold text-muted-foreground mb-2.5 flex items-center gap-1.5">
                <span className={cn("w-1.5 h-1.5 rounded-full", isOver ? "bg-primary" : "bg-muted-foreground")} />
                {cat}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {assignedItems.map(({ item, i }) => {
                  const isCorrect = submitted && assignments[i] === correctAnswers[i];
                  const isWrong = submitted && assignments[i] !== correctAnswers[i];
                  return (
                    <div
                      key={i}
                      draggable={!submitted}
                      onDragStart={e => !submitted && handleDragStart(e, i)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs border select-none",
                        submitted
                          ? isCorrect ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 cursor-default"
                            : isWrong ? "bg-red-500/15 border-red-500/40 text-red-300 cursor-default"
                              : "border-border bg-secondary"
                          : "border-border bg-secondary cursor-grab active:cursor-grabbing hover:border-primary/40"
                      )}
                    >
                      {isCorrect && "✓ "}{isWrong && "✗ "}{item}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {submitted && (
        <Card className="border-border bg-card/50 mb-4">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Correct answers:</p>
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs mb-1">
                {assignments[i] === correctAnswers[i]
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                <span className="text-foreground flex-1">{item}</span>
                <span className="text-muted-foreground shrink-0">{correctAnswers[i]}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {!submitted && (
        <Button
          data-testid="btn-submit-classify"
          onClick={handleSubmit}
          disabled={assigned < items.length}
          size="sm"
        >
          Check Answers ({assigned}/{items.length} placed)
        </Button>
      )}
    </div>
  );
}

// ── ORDER — drag to reorder ───────────────────────────────────────────────────
function OrderExercise({ exercise, onScore }: { exercise: Exercise; onScore: (c: boolean) => void }) {
  const original = exercise.items ?? [];
  const [order, setOrder] = useState(() => [...original].sort(() => Math.random() - 0.5));
  const [submitted, setSubmitted] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const correctOrder = ["Planning", "Analysis", "Design", "Implementation", "Support / Maintenance"];

  function handleDragStart(e: React.DragEvent, i: number) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("orderIdx", String(i));
    setDragIdx(i);
  }

  function handleDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIdx(i);
  }

  function handleDrop(e: React.DragEvent, toIdx: number) {
    e.preventDefault();
    const fromIdx = Number(e.dataTransfer.getData("orderIdx"));
    if (fromIdx === toIdx) { setDragIdx(null); setOverIdx(null); return; }
    const next = [...order];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setOrder(next);
    setDragIdx(null);
    setOverIdx(null);
  }

  function handleDragEnd() { setDragIdx(null); setOverIdx(null); }

  function handleSubmit() {
    setSubmitted(true);
    onScore(order.every((item, i) => item === correctOrder[i]));
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{exercise.question}</p>
      <p className="text-xs text-muted-foreground mb-5">Drag items into the correct order (1 = first).</p>

      <div className="space-y-2 mb-5">
        {order.map((item, i) => {
          const isCorrect = submitted && item === correctOrder[i];
          const isWrong = submitted && item !== correctOrder[i];
          const isDragging = dragIdx === i;
          const isOver = overIdx === i && dragIdx !== i;
          return (
            <div
              key={item}
              draggable={!submitted}
              onDragStart={e => handleDragStart(e, i)}
              onDragOver={e => handleDragOver(e, i)}
              onDrop={e => handleDrop(e, i)}
              onDragEnd={handleDragEnd}
              className={cn(
                "flex items-center gap-3 border-2 rounded-xl px-4 py-3 text-sm transition-all select-none",
                submitted
                  ? isCorrect ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 cursor-default"
                    : "border-red-500/50 bg-red-500/10 text-red-300 cursor-default"
                  : isOver ? "border-primary bg-primary/10 scale-[1.01]"
                    : isDragging ? "border-border opacity-40 bg-card/30 cursor-grabbing"
                      : "border-border bg-card hover:border-primary/40 cursor-grab"
              )}
            >
              <span className={cn(
                "w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shrink-0",
                submitted ? isCorrect ? "bg-emerald-500/30 text-emerald-300" : "bg-red-500/30 text-red-300"
                  : "bg-secondary text-muted-foreground"
              )}>{i + 1}</span>
              <span className="flex-1">{item}</span>
              {!submitted && (
                <svg className="w-4 h-4 text-muted-foreground/50 shrink-0" fill="none" viewBox="0 0 16 16">
                  <path d="M5 4h1v1H5V4zm5 0h1v1h-1V4zM5 7h1v1H5V7zm5 0h1v1h-1V7zM5 10h1v1H5v-1zm5 0h1v1h-1v-1z" fill="currentColor" />
                </svg>
              )}
              {submitted && isWrong && (
                <span className="text-xs text-muted-foreground shrink-0">→ {correctOrder[i]}</span>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <Button data-testid="btn-submit-order" size="sm" onClick={handleSubmit}>Check Order</Button>
      )}
      {submitted && (
        <p className="text-sm text-muted-foreground mt-2">Correct order: {correctOrder.join(" → ")}</p>
      )}
    </div>
  );
}

// ── MATCH — click to pair ─────────────────────────────────────────────────────
function MatchExercise({ exercise, onScore }: { exercise: Exercise; onScore: (c: boolean) => void }) {
  const pairs = exercise.pairs ?? [];
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [defs] = useState(() => [...pairs.map(p => p.definition)].sort(() => Math.random() - 0.5));

  function handleTermClick(term: string) {
    if (submitted || matched[term] !== undefined) return;
    setSelected(s => s === term ? null : term);
  }

  function handleDefClick(def: string) {
    if (submitted || Object.values(matched).includes(def) || !selected) return;
    setMatched(prev => ({ ...prev, [selected]: def }));
    setSelected(null);
  }

  function handleSubmit() {
    setSubmitted(true);
    const correct = pairs.filter(p => matched[p.term] === p.definition).length;
    onScore(correct >= Math.ceil(pairs.length / 2));
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{exercise.question}</p>
      <p className="text-xs text-muted-foreground mb-5">Click a term, then click its matching definition.</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Terms</p>
          {pairs.map(p => {
            const isMatched = matched[p.term] !== undefined;
            const isSelected = selected === p.term;
            const isCorrect = submitted && matched[p.term] === p.definition;
            const isWrong = submitted && isMatched && !isCorrect;
            return (
              <button key={p.term} onClick={() => handleTermClick(p.term)} className={cn(
                "w-full text-left text-xs px-3 py-2.5 rounded-xl border-2 transition-all",
                isSelected ? "border-primary bg-primary/10 text-primary" :
                  isCorrect ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" :
                    isWrong ? "border-red-500/50 bg-red-500/10 text-red-300" :
                      isMatched ? "border-border opacity-50 cursor-default" :
                        "border-border bg-card hover:border-primary/50 cursor-pointer"
              )}>
                {p.term}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Definitions</p>
          {defs.map(def => {
            const matchedTerm = Object.entries(matched).find(([, v]) => v === def)?.[0];
            const isUsed = matchedTerm !== undefined;
            const isTarget = selected !== null && !isUsed && !submitted;
            const correctPair = pairs.find(p => p.term === matchedTerm)?.definition === def;
            const isCorrect = submitted && isUsed && correctPair;
            const isWrong = submitted && isUsed && !isCorrect;
            return (
              <button key={def} onClick={() => handleDefClick(def)} className={cn(
                "w-full text-left text-xs px-3 py-2.5 rounded-xl border-2 transition-all",
                isTarget ? "border-primary/60 bg-primary/5 cursor-pointer hover:bg-primary/10" :
                  isCorrect ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" :
                    isWrong ? "border-red-500/50 bg-red-500/10 text-red-300" :
                      isUsed ? "border-border opacity-50 cursor-default" :
                        "border-border bg-card cursor-default"
              )}>
                {def}
              </button>
            );
          })}
        </div>
      </div>

      {submitted && (
        <Card className="border-border bg-card/50 mb-4">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Correct matches:</p>
            {pairs.map(p => (
              <div key={p.term} className="flex items-start gap-2 text-xs mb-1.5">
                {matched[p.term] === p.definition ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />}
                <span className="font-medium text-foreground shrink-0">{p.term}:</span>
                <span className="text-muted-foreground">{p.definition}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {!submitted && (
        <Button data-testid="btn-submit-match" size="sm" onClick={handleSubmit} disabled={Object.keys(matched).length < pairs.length}>
          Check Matches ({Object.keys(matched).length}/{pairs.length})
        </Button>
      )}
    </div>
  );
}

// ── FILL BLANK ────────────────────────────────────────────────────────────────
function FillBlankExercise({ exercise, onScore }: { exercise: Exercise; onScore: (c: boolean) => void }) {
  const blanks = exercise.blanks ?? [];
  const sentence = exercise.sentence ?? "";
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const parts = sentence.split(/\[BLANK\d+\]/);
  const blankMatches = sentence.match(/\[BLANK\d+\]/g) ?? [];

  function handleSubmit() {
    setSubmitted(true);
    const correct = blanks.filter(b => answers[b.blank]?.toLowerCase().trim() === b.answer.toLowerCase().trim()).length;
    onScore(correct >= Math.ceil(blanks.length / 2));
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{exercise.question}</p>
      <div className="text-sm leading-loose bg-card border-2 border-border rounded-xl p-5 mb-5">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < blankMatches.length && (() => {
              const blankKey = blankMatches[i].replace(/[\[\]]/g, "");
              const blank = blanks.find(b => b.blank === blankKey);
              const val = answers[blankKey] ?? "";
              const isCorrect = submitted && val.toLowerCase().trim() === (blank?.answer ?? "").toLowerCase().trim();
              const isWrong = submitted && !isCorrect;
              return (
                <input
                  data-testid={`fill-${blankKey}`}
                  type="text"
                  value={val}
                  onChange={e => !submitted && setAnswers(prev => ({ ...prev, [blankKey]: e.target.value }))}
                  className={cn(
                    "inline-block border-b-2 bg-transparent text-center text-sm px-2 min-w-24 outline-none mx-1 transition-colors",
                    isCorrect ? "border-emerald-500 text-emerald-300" :
                      isWrong ? "border-red-500 text-red-300" :
                        "border-primary/60 text-foreground"
                  )}
                  placeholder="___"
                />
              );
            })()}
          </span>
        ))}
      </div>

      {submitted && (
        <Card className="border-border bg-card/50 mb-4">
          <CardContent className="pt-3 pb-3">
            <div className="flex flex-wrap gap-3">
              {blanks.map(b => (
                <div key={b.blank} className="flex items-center gap-1.5 text-xs">
                  {answers[b.blank]?.toLowerCase().trim() === b.answer.toLowerCase().trim()
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  <span className="text-foreground font-medium">{b.answer}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!submitted && (
        <Button data-testid="btn-submit-fill" size="sm" onClick={handleSubmit} disabled={Object.keys(answers).length < blanks.length}>
          Check Answers
        </Button>
      )}
    </div>
  );
}

// ── SHORT ANSWER ──────────────────────────────────────────────────────────────
function ShortAnswerExercise({ exercise, onScore }: { exercise: Exercise; onScore: (c: boolean) => void }) {
  const [answer, setAnswer] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selfMark, setSelfMark] = useState<boolean | null>(null);

  function handleSelfMark(correct: boolean) { setSelfMark(correct); onScore(correct); }

  return (
    <div>
      <p className="text-sm text-foreground leading-relaxed mb-4">{exercise.question}</p>

      {exercise.hint && (
        <div className="mb-4">
          <button data-testid="btn-show-hint" onClick={() => setShowHint(v => !v)} className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300">
            <HelpCircle className="w-3.5 h-3.5" />
            {showHint ? "Hide hint" : "Show hint"}
          </button>
          {showHint && <p className="text-xs text-amber-300/80 mt-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">{exercise.hint}</p>}
        </div>
      )}

      <Textarea data-testid="input-short-answer" value={answer} onChange={e => setAnswer(e.target.value)}
        placeholder="Write your answer here. Be thorough — think about key concepts and how they apply to the scenario..." className="min-h-32 text-sm mb-4 resize-none" />

      {!showModel && (
        <Button data-testid="btn-reveal-answer" variant="outline" size="sm" onClick={() => setShowModel(true)} disabled={answer.trim().length < 20} className="gap-1.5">
          <Eye className="w-4 h-4" /> Reveal Model Answer
        </Button>
      )}

      {showModel && (
        <>
          <Card className="border-primary/30 bg-primary/5 mb-4">
            <CardHeader className="pb-2 pt-4"><CardTitle className="text-sm text-primary">Model Answer</CardTitle></CardHeader>
            <CardContent className="pb-4">
              <pre className="text-xs leading-relaxed whitespace-pre-wrap text-foreground font-sans">{exercise.modelAnswer}</pre>
            </CardContent>
          </Card>

          {selfMark === null && (
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm text-muted-foreground">How did you do?</p>
              <Button data-testid="btn-self-mark-correct" size="sm" onClick={() => handleSelfMark(true)} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> I covered the key points
              </Button>
              <Button data-testid="btn-self-mark-incorrect" variant="outline" size="sm" onClick={() => handleSelfMark(false)} className="gap-1.5">
                <XCircle className="w-3.5 h-3.5" /> Missed some points
              </Button>
            </div>
          )}
          {selfMark !== null && (
            <div className={cn("flex items-center gap-2 text-sm", selfMark ? "text-emerald-400" : "text-amber-400")}>
              {selfMark ? <><CheckCircle2 className="w-4 h-4" /> Great — compare your wording to the model.</> : <><BookOpen className="w-4 h-4" /> Review the model answer and retry next session.</>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Practice Page ────────────────────────────────────────────────────────
export default function Practice() {
  const [, params] = useRoute("/practice/:unitId");
  const [, setLocation] = useLocation();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [scores, setScores] = useState<Record<number, boolean>>({});
  const { recordExerciseScore } = useProgress();

  const unitId = params?.unitId ?? "lu1";
  const unitIndex = UNITS.findIndex(u => u.id === unitId);
  const unit = UNITS[unitIndex >= 0 ? unitIndex : 0];
  const actualIndex = unitIndex >= 0 ? unitIndex : 0;

  const exercise = unit.exercises[exerciseIndex];

  const handleScore = useCallback((correct: boolean) => {
    setScores(prev => ({ ...prev, [exerciseIndex]: correct }));
    recordExerciseScore(unitId, exercise.id, correct);
  }, [exerciseIndex, exercise?.id, unitId, recordExerciseScore]);

  const score = Object.values(scores).filter(Boolean).length;
  const done = Object.keys(scores).length;

  const typeLabel: Record<Exercise["type"], string> = {
    "classify": "Drag & Drop", "order": "Drag to Order",
    "match": "Matching", "fill-blank": "Fill in the Blank", "short-answer": "Short Answer",
  };

  const typeColors: Record<Exercise["type"], string> = {
    "classify": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "order": "bg-violet-500/20 text-violet-300 border-violet-500/30",
    "match": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    "fill-blank": "bg-amber-500/20 text-amber-300 border-amber-500/30",
    "short-answer": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <Badge variant="outline" className={`text-xs mb-2 ${unitAccents[actualIndex]}`}>LU{actualIndex + 1}</Badge>
          <h2 className="font-semibold text-sm leading-snug">{unit.shortTitle}</h2>
          <p className="text-xs text-muted-foreground mt-1">{done}/{unit.exercises.length} complete · {score} correct</p>
        </div>
        <div className="flex-1 p-2 space-y-0.5">
          {unit.exercises.map((ex, i) => (
            <button key={ex.id} data-testid={`exercise-nav-${i}`}
              onClick={() => setExerciseIndex(i)}
              className={cn("w-full text-left px-3 py-2.5 rounded-lg transition-colors", i === exerciseIndex ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}>
              <div className="flex items-center justify-between">
                <span className="text-xs">{typeLabel[ex.type]}</span>
                {scores[i] !== undefined && (scores[i] ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />)}
              </div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-border space-y-2">
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setLocation(`/learn/${unitId}`)}>Back to Learn</Button>
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setLocation("/practice")}>All Units</Button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="h-1 bg-secondary">
          <div className="h-full bg-primary transition-all" style={{ width: `${(done / unit.exercises.length) * 100}%` }} />
        </div>

        <ScrollArea className="flex-1">
          <div className="max-w-2xl mx-auto px-8 py-8">
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="outline" className={`text-xs ${typeColors[exercise.type]}`}>{typeLabel[exercise.type]}</Badge>
              <span className="text-xs text-muted-foreground">{exerciseIndex + 1} of {unit.exercises.length}</span>
            </div>

            <Card className="border-border">
              <CardContent className="pt-6 pb-6">
                {exercise.type === "classify" && <ClassifyExercise key={`${unitId}-${exerciseIndex}`} exercise={exercise} onScore={handleScore} />}
                {exercise.type === "order" && <OrderExercise key={`${unitId}-${exerciseIndex}`} exercise={exercise} onScore={handleScore} />}
                {exercise.type === "match" && <MatchExercise key={`${unitId}-${exerciseIndex}`} exercise={exercise} onScore={handleScore} />}
                {exercise.type === "fill-blank" && <FillBlankExercise key={`${unitId}-${exerciseIndex}`} exercise={exercise} onScore={handleScore} />}
                {exercise.type === "short-answer" && <ShortAnswerExercise key={`${unitId}-${exerciseIndex}`} exercise={exercise} onScore={handleScore} />}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="border-t border-border px-8 py-4 flex items-center justify-between bg-background">
          <Button variant="outline" size="sm" onClick={() => setExerciseIndex(i => Math.max(0, i - 1))} disabled={exerciseIndex === 0} className="gap-1.5">
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <Button size="sm"
            onClick={() => { if (exerciseIndex < unit.exercises.length - 1) setExerciseIndex(i => i + 1); else setLocation("/practice"); }}
            className="gap-1.5">
            {exerciseIndex < unit.exercises.length - 1 ? <>Next <ChevronRight className="w-4 h-4" /></> : "All Units"}
          </Button>
        </div>
      </div>
    </div>
  );
}
