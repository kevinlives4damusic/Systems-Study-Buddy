import { useState, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, Eye, HelpCircle, BookOpen, GitBranch, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProgress } from "@/contexts/ProgressContext";
import { UNITS, type Exercise, type DiagramSlot } from "@/data/studyData";
import { cn } from "@/lib/utils";

const unitAccents = [
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-rose-100 text-rose-700 border-rose-200",
];

function deriveCorrectAnswers(items: string[], categories: string[]): Record<number, string> {
  const result: Record<number, string> = {};
  const c0 = categories[0] ?? "";
  const c1 = categories[1] ?? c0;

  items.forEach((item, i) => {
    const low = item.toLowerCase();
    if (c0.includes("Analysis") && c1.includes("Design")) {
      const designWords = ["form", "table", "database", "layout", "encrypt", "hash", "field", "key", "foreign", "authentication", "bcrypt", "screen", "page will display", "thumbnail", "scheduled job", "structured"];
      result[i] = designWords.some(w => low.includes(w)) ? c1 : c0;
    } else if (c0.includes("Functional") && c1.includes("Non-Functional")) {
      const nonFunc = ["24/7", "password", "response", "available", "secure", "encrypt", "protect", "performance", "2 second", "3 second", "fast", "within", "encrypted at rest", "uptime"];
      result[i] = nonFunc.some(w => low.includes(w)) ? c1 : c0;
    } else if (c0.includes("Internal") && c1.includes("External")) {
      const external = ["parent", "nanny", "client", "customer", "regulatory", "payment", "provider", "multi-national", "hiring", "patient", "insurance", "department of health", "general practitioner", "medical aid"];
      result[i] = external.some(w => low.includes(w)) ? c1 : c0;
    } else if (c0.includes("Visibility") || c0.includes("Affordance")) {
      const affordanceWords = ["styled as plain", "plain grey text", "plain black text", "no underline", "no border", "clickable area", "no visual"];
      const visibilityWords = ["buried", "hidden", "only visible after", "not visible", "inaccessible", "requires scrolling"];
      const goodWords = ["prominently", "clearly", "visible at the top", "green tick", "placeholder", "zoom icon", "dropdown arrow", "progress indicator", "step 2 of", "shows a"];
      if (goodWords.some(w => low.includes(w))) result[i] = "Good Design";
      else if (visibilityWords.some(w => low.includes(w))) result[i] = "Visibility Problem";
      else if (affordanceWords.some(w => low.includes(w))) result[i] = "Affordance Problem";
      else result[i] = categories[0];
    } else {
      const testMap: [string, string][] = [
        ["calculateinterest", "Unit Testing"],
        ["calculatebookingfee", "Unit Testing"],
        ["transfer module", "Integration Testing"],
        ["booking module", "Integration Testing"],
        ["compliance officer", "UAT"],
        ["stakeholder", "UAT"],
        ["10,000 simultaneous", "Performance Testing"],
        ["5,000 simultaneous", "Performance Testing"],
        ["after patching", "Regression Testing"],
        ["after fixing", "Regression Testing"],
        ["fully assembled", "System Testing"],
        ["full integrated", "System Testing"],
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

// ── CLASSIFY ──────────────────────────────────────────────────────────────────
function ClassifyExercise({ exercise, onScore }: { exercise: Exercise; onScore: (c: boolean) => void }) {
  const categories = exercise.categories ?? [];
  const items = exercise.items ?? [];
  const correctAnswers = deriveCorrectAnswers(items, categories);
  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [overCat, setOverCat] = useState<string | null>(null);

  const assigned = Object.keys(assignments).length;

  function handleDragStart(e: React.DragEvent, idx: number) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("itemIndex", String(idx));
    setDraggingIdx(idx);
  }
  function handleDragEnd() { setDraggingIdx(null); setOverCat(null); }
  function handleCatDragOver(e: React.DragEvent, cat: string) { e.preventDefault(); setOverCat(cat); }
  function handleCatDrop(e: React.DragEvent, cat: string) {
    e.preventDefault();
    setAssignments(prev => ({ ...prev, [Number(e.dataTransfer.getData("itemIndex"))]: cat }));
    setDraggingIdx(null); setOverCat(null);
  }
  function handlePoolDragOver(e: React.DragEvent) { e.preventDefault(); setOverCat("__pool__"); }
  function handlePoolDrop(e: React.DragEvent) {
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
      {!submitted && (
        <div className={cn("min-h-14 border-2 border-dashed rounded-xl p-3 mb-5 transition-colors",
          overCat === "__pool__" ? "border-primary bg-primary/5" : "border-border bg-slate-50")}
          onDragOver={handlePoolDragOver} onDragLeave={() => setOverCat(null)} onDrop={handlePoolDrop}>
          <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2">Items — drag to a category below</p>
          {items.every((_, i) => assignments[i] !== undefined) ? (
            <p className="text-xs text-muted-foreground italic text-center py-1">All items placed — drag back here to un-assign</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {items.map((item, i) => assignments[i] !== undefined ? null : (
                <div key={i} draggable onDragStart={e => handleDragStart(e, i)} onDragEnd={handleDragEnd}
                  className={cn("px-3 py-1.5 rounded-lg border text-xs select-none transition-all",
                    draggingIdx === i ? "opacity-40 scale-95 cursor-grabbing" : "border-border bg-white hover:border-primary/60 hover:bg-primary/5 cursor-grab shadow-sm")}>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, 3)}, 1fr)` }}>
        {categories.map(cat => {
          const catItems = items.map((item, i) => ({ item, i })).filter(({ i }) => assignments[i] === cat);
          const isOver = overCat === cat;
          return (
            <div key={cat} onDragOver={e => handleCatDragOver(e, cat)} onDragLeave={() => setOverCat(null)} onDrop={e => handleCatDrop(e, cat)}
              className={cn("border-2 rounded-xl p-3 min-h-28 transition-all",
                isOver && !submitted ? "border-primary bg-primary/5 scale-[1.01]" : "border-border bg-white")}>
              <p className="text-xs font-semibold text-muted-foreground mb-2.5 flex items-center gap-1.5">
                <span className={cn("w-1.5 h-1.5 rounded-full", isOver ? "bg-primary" : "bg-slate-300")} />
                {cat}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {catItems.map(({ item, i }) => {
                  const isCorrect = submitted && assignments[i] === correctAnswers[i];
                  const isWrong = submitted && !isCorrect;
                  return (
                    <div key={i} draggable={!submitted} onDragStart={e => !submitted && handleDragStart(e, i)} onDragEnd={handleDragEnd}
                      className={cn("px-2.5 py-1 rounded-lg text-xs border select-none",
                        submitted ? isCorrect ? "bg-emerald-50 border-emerald-300 text-emerald-700 cursor-default"
                          : "bg-red-50 border-red-300 text-red-700 cursor-default"
                          : "border-border bg-slate-50 cursor-grab hover:border-primary/40 active:cursor-grabbing")}>
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
        <Card className="border-border bg-slate-50 mb-4">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Correct answers:</p>
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs mb-1">
                {assignments[i] === correctAnswers[i] ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                <span className="text-foreground flex-1">{item}</span>
                <span className="text-muted-foreground shrink-0 font-medium">{correctAnswers[i]}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {!submitted && (
        <Button data-testid="btn-submit-classify" onClick={handleSubmit} disabled={assigned < items.length} size="sm">
          Check Answers ({assigned}/{items.length} placed)
        </Button>
      )}
    </div>
  );
}

// ── ORDER ─────────────────────────────────────────────────────────────────────
function OrderExercise({ exercise, onScore }: { exercise: Exercise; onScore: (c: boolean) => void }) {
  const original = exercise.items ?? [];
  const [order, setOrder] = useState(() => [...original].sort(() => Math.random() - 0.5));
  const [submitted, setSubmitted] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const correctOrder = ["Planning", "Analysis", "Design", "Implementation", "Support / Maintenance"];

  function handleDragStart(e: React.DragEvent, i: number) { e.dataTransfer.setData("orderIdx", String(i)); setDragIdx(i); }
  function handleDragOver(e: React.DragEvent, i: number) { e.preventDefault(); setOverIdx(i); }
  function handleDrop(e: React.DragEvent, toIdx: number) {
    const fromIdx = Number(e.dataTransfer.getData("orderIdx"));
    if (fromIdx !== toIdx) {
      const next = [...order]; const [moved] = next.splice(fromIdx, 1); next.splice(toIdx, 0, moved);
      setOrder(next);
    }
    setDragIdx(null); setOverIdx(null);
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{exercise.question}</p>
      <p className="text-xs text-muted-foreground mb-5 flex items-center gap-1.5">
        <span className="text-base">☝️</span> Drag items into the correct order (1 = first)
      </p>
      <div className="space-y-2 mb-5">
        {order.map((item, i) => {
          const isCorrect = submitted && item === correctOrder[i];
          const isWrong = submitted && !isCorrect;
          const isDragging = dragIdx === i;
          const isOver = overIdx === i && dragIdx !== i;
          return (
            <div key={item} draggable={!submitted}
              onDragStart={e => handleDragStart(e, i)} onDragOver={e => handleDragOver(e, i)}
              onDrop={e => handleDrop(e, i)} onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
              className={cn("flex items-center gap-3 border-2 rounded-xl px-4 py-3 text-sm transition-all select-none",
                submitted ? isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-700 cursor-default"
                  : "border-red-300 bg-red-50 text-red-700 cursor-default"
                  : isOver ? "border-primary bg-primary/5 scale-[1.01]"
                    : isDragging ? "border-border opacity-40 bg-slate-50 cursor-grabbing"
                      : "border-border bg-white hover:border-primary/40 cursor-grab shadow-sm")}>
              <span className={cn("w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shrink-0",
                submitted ? isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  : "bg-slate-100 text-muted-foreground")}>{i + 1}</span>
              <span className="flex-1 text-foreground">{item}</span>
              {!submitted && (
                <svg className="w-4 h-4 text-slate-300 shrink-0" fill="none" viewBox="0 0 16 16">
                  <path d="M5 4h1v1H5V4zm5 0h1v1h-1V4zM5 7h1v1H5V7zm5 0h1v1h-1V7zM5 10h1v1H5v-1zm5 0h1v1h-1v-1z" fill="currentColor" />
                </svg>
              )}
              {submitted && isWrong && <span className="text-xs text-muted-foreground shrink-0">→ {correctOrder[i]}</span>}
            </div>
          );
        })}
      </div>
      {!submitted && <Button data-testid="btn-submit-order" size="sm" onClick={() => { setSubmitted(true); onScore(order.every((item, i) => item === correctOrder[i])); }}>Check Order</Button>}
      {submitted && <p className="text-sm text-muted-foreground mt-2">Correct order: {correctOrder.join(" → ")}</p>}
    </div>
  );
}

// ── MATCH — click + drag-and-drop ─────────────────────────────────────────────
function MatchExercise({ exercise, onScore }: { exercise: Exercise; onScore: (c: boolean) => void }) {
  const pairs = exercise.pairs ?? [];
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [defs] = useState(() => [...pairs.map(p => p.definition)].sort(() => Math.random() - 0.5));
  const [draggingTerm, setDraggingTerm] = useState<string | null>(null);
  const [overDef, setOverDef] = useState<string | null>(null);

  function handleTermClick(term: string) {
    if (submitted || matched[term] !== undefined) return;
    setSelected(s => s === term ? null : term);
  }
  function handleDefClick(def: string) {
    if (submitted || Object.values(matched).includes(def) || !selected) return;
    setMatched(prev => ({ ...prev, [selected]: def })); setSelected(null);
  }
  function handleTermDragStart(e: React.DragEvent, term: string) {
    if (submitted || matched[term] !== undefined) return;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("term", term);
    setDraggingTerm(term);
    setSelected(null);
  }
  function handleDefDragOver(e: React.DragEvent, def: string) {
    if (!draggingTerm) return;
    e.preventDefault();
    setOverDef(def);
  }
  function handleDefDrop(e: React.DragEvent, def: string) {
    e.preventDefault();
    const term = e.dataTransfer.getData("term");
    if (term && !Object.values(matched).includes(def)) {
      setMatched(prev => ({ ...prev, [term]: def }));
    }
    setDraggingTerm(null); setOverDef(null);
  }
  function handleMatchedTermDragStart(e: React.DragEvent, term: string) {
    if (submitted) return;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("term", term);
    setMatched(prev => { const n = { ...prev }; delete n[term]; return n; });
    setDraggingTerm(term);
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{exercise.question}</p>
      <p className="text-xs text-muted-foreground mb-5 flex items-center gap-1.5">
        <span className="text-base">☝️</span> Click a term then click its definition, or drag a term onto a definition
      </p>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Terms</p>
          {pairs.map(p => {
            const isMatched = matched[p.term] !== undefined;
            const isSel = selected === p.term;
            const isDragging = draggingTerm === p.term;
            const isCorrect = submitted && matched[p.term] === p.definition;
            const isWrong = submitted && isMatched && !isCorrect;
            return (
              <div
                key={p.term}
                draggable={!submitted && !isMatched}
                onClick={() => handleTermClick(p.term)}
                onDragStart={e => isMatched ? handleMatchedTermDragStart(e, p.term) : handleTermDragStart(e, p.term)}
                onDragEnd={() => { setDraggingTerm(null); setOverDef(null); }}
                className={cn(
                  "w-full text-left text-xs px-3 py-2.5 rounded-xl border-2 transition-all select-none",
                  isDragging ? "opacity-40 cursor-grabbing" :
                  isSel ? "border-primary bg-primary/10 text-primary cursor-pointer" :
                    isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-700" :
                      isWrong ? "border-red-300 bg-red-50 text-red-700" :
                        isMatched ? "border-border opacity-60 cursor-grab" :
                          "border-border bg-white hover:border-primary/50 cursor-grab shadow-sm")}>
                {p.term}
              </div>
            );
          })}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Definitions</p>
          {defs.map(def => {
            const matchedTerm = Object.entries(matched).find(([, v]) => v === def)?.[0];
            const isUsed = matchedTerm !== undefined;
            const isDropTarget = draggingTerm !== null && !isUsed && !submitted;
            const isOver = overDef === def && isDropTarget;
            const isClickTarget = selected !== null && !isUsed && !submitted;
            const correctPair = pairs.find(p => p.term === matchedTerm)?.definition === def;
            const isCorrect = submitted && isUsed && correctPair;
            const isWrong = submitted && isUsed && !isCorrect;
            return (
              <div
                key={def}
                onClick={() => handleDefClick(def)}
                onDragOver={e => handleDefDragOver(e, def)}
                onDragLeave={() => setOverDef(null)}
                onDrop={e => handleDefDrop(e, def)}
                className={cn(
                  "w-full text-left text-xs px-3 py-2.5 rounded-xl border-2 transition-all",
                  isOver ? "border-primary bg-primary/10 scale-[1.01]" :
                  isClickTarget ? "border-primary/60 bg-primary/5 cursor-pointer hover:bg-primary/10" :
                    isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-700" :
                      isWrong ? "border-red-300 bg-red-50 text-red-700" :
                        isUsed ? "border-border opacity-60" :
                          isDropTarget ? "border-dashed border-slate-400 bg-slate-50" :
                          "border-border bg-white")}>
                {matchedTerm && !submitted && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium mb-1 mr-1.5">
                    {matchedTerm}
                  </span>
                )}
                {def}
              </div>
            );
          })}
        </div>
      </div>
      {submitted && (
        <Card className="border-border bg-slate-50 mb-4">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Correct matches:</p>
            {pairs.map(p => (
              <div key={p.term} className="flex items-start gap-2 text-xs mb-1.5">
                {matched[p.term] === p.definition ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />}
                <span className="font-medium text-foreground shrink-0">{p.term}:</span>
                <span className="text-muted-foreground">{p.definition}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {!submitted && (
        <Button data-testid="btn-submit-match" size="sm"
          onClick={() => { setSubmitted(true); onScore(pairs.filter(p => matched[p.term] === p.definition).length >= Math.ceil(pairs.length / 2)); }}
          disabled={Object.keys(matched).length < pairs.length}>
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

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{exercise.question}</p>
      <div className="text-sm leading-loose bg-white border-2 border-border rounded-xl p-5 mb-5 shadow-sm">
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
                <input type="text" value={val}
                  onChange={e => !submitted && setAnswers(prev => ({ ...prev, [blankKey]: e.target.value }))}
                  className={cn("inline-block border-b-2 bg-transparent text-center text-sm px-2 min-w-24 outline-none mx-1 transition-colors",
                    isCorrect ? "border-emerald-500 text-emerald-700" : isWrong ? "border-red-500 text-red-700" : "border-primary/60 text-foreground")}
                  placeholder="___" />
              );
            })()}
          </span>
        ))}
      </div>
      {submitted && (
        <Card className="border-border bg-slate-50 mb-4">
          <CardContent className="pt-3 pb-3">
            <div className="flex flex-wrap gap-3">
              {blanks.map(b => (
                <div key={b.blank} className="flex items-center gap-1.5 text-xs">
                  {answers[b.blank]?.toLowerCase().trim() === b.answer.toLowerCase().trim()
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-red-500" />}
                  <span className="text-foreground font-medium">{b.answer}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {!submitted && (
        <Button data-testid="btn-submit-fill" size="sm"
          onClick={() => { setSubmitted(true); onScore(blanks.filter(b => answers[b.blank]?.toLowerCase().trim() === b.answer.toLowerCase().trim()).length >= Math.ceil(blanks.length / 2)); }}
          disabled={Object.keys(answers).length < blanks.length}>
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

  return (
    <div>
      <p className="text-sm text-foreground leading-relaxed mb-4">{exercise.question}</p>
      {exercise.hint && (
        <div className="mb-4">
          <button data-testid="btn-show-hint" onClick={() => setShowHint(v => !v)} className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-500">
            <HelpCircle className="w-3.5 h-3.5" />{showHint ? "Hide hint" : "Show hint"}
          </button>
          {showHint && <p className="text-xs text-amber-700 mt-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">{exercise.hint}</p>}
        </div>
      )}
      <Textarea data-testid="input-short-answer" value={answer} onChange={e => setAnswer(e.target.value)}
        placeholder="Write your answer here — aim to cover all the key concepts and relate them to the scenario..." className="min-h-32 text-sm mb-4 resize-none bg-white" />
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
              <Button data-testid="btn-self-mark-correct" size="sm" onClick={() => { setSelfMark(true); onScore(true); }} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Covered the key points
              </Button>
              <Button data-testid="btn-self-mark-incorrect" variant="outline" size="sm" onClick={() => { setSelfMark(false); onScore(false); }} className="gap-1.5">
                <XCircle className="w-3.5 h-3.5" /> Missed some points
              </Button>
            </div>
          )}
          {selfMark !== null && (
            <div className={cn("flex items-center gap-2 text-sm", selfMark ? "text-emerald-600" : "text-amber-600")}>
              {selfMark ? <><CheckCircle2 className="w-4 h-4" /> Great — compare your wording to the model.</> : <><BookOpen className="w-4 h-4" /> Review the model answer and retry next session.</>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── DIAGRAM LABEL — shared slot box ──────────────────────────────────────────
function DiagramSlotBox({
  slot, assignment, submitted, overSlot, onDragOver, onDragLeave, onDrop, onDragStart, compact
}: {
  slot: DiagramSlot; assignment?: string; submitted: boolean;
  overSlot: string | null;
  onDragOver: (id: string) => void; onDragLeave: () => void;
  onDrop: (slotId: string, label: string, fromSlot: string) => void;
  onDragStart: (e: React.DragEvent, label: string, fromSlot: string) => void;
  compact?: boolean;
}) {
  const isOver = overSlot === slot.id && !submitted;
  const isCorrect = submitted && assignment === slot.correctLabel;
  const isWrong = submitted && assignment !== undefined && assignment !== slot.correctLabel;
  const isEmpty = assignment === undefined;

  return (
    <div
      onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragOver(slot.id); }}
      onDragLeave={() => onDragLeave()}
      onDrop={e => {
        e.preventDefault(); e.stopPropagation();
        const label = e.dataTransfer.getData("label");
        const fromSlot = e.dataTransfer.getData("fromSlot");
        if (label) onDrop(slot.id, label, fromSlot);
      }}
      className={cn(
        "border-2 border-dashed rounded px-2 py-0.5 text-xs transition-all inline-flex items-center font-mono",
        compact ? "h-6 min-w-[7rem]" : "h-7 min-w-[12rem]",
        submitted
          ? isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-700 cursor-default"
          : isWrong ? "border-red-400 bg-red-50 text-red-700 cursor-default"
          : isEmpty ? "border-slate-300 bg-slate-50 text-slate-400"
          : "border-amber-300 bg-amber-50 text-amber-700 cursor-default"
          : isOver ? "border-primary bg-primary/10 scale-[1.02]"
          : isEmpty ? "border-slate-300 bg-white/80 text-slate-400"
          : "border-primary/40 bg-primary/5"
      )}
    >
      {assignment ? (
        <span
          draggable={!submitted}
          onDragStart={e => !submitted && onDragStart(e, assignment, slot.id)}
          className={cn("truncate", !submitted && "cursor-grab")}
        >
          {submitted && isCorrect && <span className="mr-1">✓</span>}
          {submitted && isWrong && <span className="mr-1">✗</span>}
          {assignment}
        </span>
      ) : (
        <span className="text-muted-foreground/40 italic text-[10px]">{slot.hint ?? "drop here"}</span>
      )}
    </div>
  );
}

// ── DIAGRAM LABEL — stick figure SVG ─────────────────────────────────────────
function StickFigure({ color = "#1e3a6e", size = 1 }: { color?: string; size?: number }) {
  const s = size;
  return (
    <svg width={30 * s} height={52 * s} viewBox="0 0 30 52">
      <circle cx={15} cy={9} r={8} fill="none" stroke={color} strokeWidth={1.8} />
      <line x1={15} y1={17} x2={15} y2={34} stroke={color} strokeWidth={1.8} />
      <line x1={3} y1={23} x2={27} y2={23} stroke={color} strokeWidth={1.8} />
      <line x1={15} y1={34} x2={5} y2={48} stroke={color} strokeWidth={1.8} />
      <line x1={15} y1={34} x2={25} y2={48} stroke={color} strokeWidth={1.8} />
    </svg>
  );
}

// ── DIAGRAM LABEL — class diagram renderer ────────────────────────────────────
function ClassDiagramRenderer({
  exercise, slots, assignments, submitted, overSlot, onDragOver, onDragLeave, onDrop, onDragStart
}: {
  exercise: Exercise; slots: DiagramSlot[]; assignments: Record<string, string>;
  submitted: boolean; overSlot: string | null;
  onDragOver: (id: string) => void; onDragLeave: () => void;
  onDrop: (slotId: string, label: string, fromSlot: string) => void;
  onDragStart: (e: React.DragEvent, label: string, fromSlot: string) => void;
}) {
  const className = exercise.diagramClassName ?? "ClassName";
  const fixedAttrs = exercise.diagramFixed?.attributes ?? [];
  const fixedMethods = exercise.diagramFixed?.methods ?? [];
  const attrSlots = slots.filter(s => s.id.startsWith("attr"));
  const methodSlots = slots.filter(s => s.id.startsWith("method"));

  return (
    <div className="flex gap-8 flex-wrap items-start mb-6">
      <div className="border-2 border-slate-700 rounded font-mono text-xs shadow-md bg-white" style={{ minWidth: 300 }}>
        <div className="border-b-2 border-slate-700 px-4 py-2.5 text-center font-bold text-sm bg-blue-50 text-slate-800 tracking-wide">
          {className}
        </div>
        <div className="border-b-2 border-slate-700 px-3 py-2.5 space-y-2 min-h-16">
          {fixedAttrs.map(a => (
            <div key={a} className="flex items-center gap-1 text-xs">
              <span className="text-blue-700 font-bold w-3 shrink-0">{a[0]}</span>
              <span className="text-slate-700">{a.slice(1)}</span>
            </div>
          ))}
          {attrSlots.map(s => (
            <DiagramSlotBox key={s.id} slot={s} assignment={assignments[s.id]} submitted={submitted}
              overSlot={overSlot} onDragOver={onDragOver} onDragLeave={onDragLeave}
              onDrop={onDrop} onDragStart={onDragStart} />
          ))}
        </div>
        <div className="px-3 py-2.5 space-y-2 min-h-16">
          {fixedMethods.map(m => (
            <div key={m} className="flex items-center gap-1 text-xs">
              <span className="text-amber-700 font-bold w-3 shrink-0">{m[0]}</span>
              <span className="text-slate-700">{m.slice(1)}</span>
            </div>
          ))}
          {methodSlots.map(s => (
            <DiagramSlotBox key={s.id} slot={s} assignment={assignments[s.id]} submitted={submitted}
              overSlot={overSlot} onDragOver={onDragOver} onDragLeave={onDragLeave}
              onDrop={onDrop} onDragStart={onDragStart} />
          ))}
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground space-y-1.5 self-start pt-1">
        <p className="font-semibold text-xs text-foreground mb-2">UML Notation</p>
        <div className="flex items-center gap-1.5"><span className="text-blue-700 font-bold font-mono w-4">-</span>private (attributes)</div>
        <div className="flex items-center gap-1.5"><span className="text-amber-700 font-bold font-mono w-4">+</span>public (methods)</div>
        <div className="flex items-center gap-1.5"><span className="font-mono w-4">#</span>protected</div>
        <div className="mt-2 pt-2 border-t border-border space-y-1">
          <div><span className="text-emerald-700 font-mono">String</span> = text</div>
          <div><span className="text-emerald-700 font-mono">Integer</span> = whole #</div>
          <div><span className="text-emerald-700 font-mono">Boolean</span> = true/false</div>
          <div><span className="text-emerald-700 font-mono">void</span> = returns nothing</div>
        </div>
      </div>
    </div>
  );
}

// ── DIAGRAM LABEL — use case renderer ────────────────────────────────────────
function UseCaseDiagramRenderer({
  exercise, slots, assignments, submitted, overSlot, onDragOver, onDragLeave, onDrop, onDragStart
}: {
  exercise: Exercise; slots: DiagramSlot[]; assignments: Record<string, string>;
  submitted: boolean; overSlot: string | null;
  onDragOver: (id: string) => void; onDragLeave: () => void;
  onDrop: (slotId: string, label: string, fromSlot: string) => void;
  onDragStart: (e: React.DragEvent, label: string, fromSlot: string) => void;
}) {
  const actors = exercise.diagramActors ?? [];
  const useCases = exercise.diagramUseCases ?? [];
  const connections = exercise.diagramConnections ?? [];
  const W = 580, H = 340;

  function getCenter(id: string): { x: number; y: number } | null {
    const a = actors.find(a => a.id === id);
    if (a) return { x: a.x, y: a.y };
    const u = useCases.find(u => u.id === id);
    if (u) return { x: u.x, y: u.y };
    return null;
  }

  function lineEndpoints(fromId: string, toId: string) {
    const from = getCenter(fromId);
    const to = getCenter(toId);
    if (!from || !to) return null;
    const dx = to.x - from.x, dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len, uy = dy / len;
    const isFromActor = actors.some(a => a.id === fromId);
    const isToActor = actors.some(a => a.id === toId);
    const fromOff = isFromActor ? 20 : 64;
    const toOff = isToActor ? 20 : 64;
    return {
      x1: from.x + ux * fromOff, y1: from.y + uy * (isFromActor ? 20 : 15),
      x2: to.x - ux * toOff, y2: to.y - uy * (isToActor ? 20 : 15),
      isUcUc: !isFromActor && !isToActor
    };
  }

  return (
    <div className="mb-6">
      <div className="relative bg-white border border-border rounded-xl overflow-hidden shadow-sm" style={{ width: W, height: H, maxWidth: "100%" }}>
        <svg className="absolute inset-0 pointer-events-none" width={W} height={H}>
          <defs>
            <marker id="ucArrowPractice" markerWidth={7} markerHeight={5} refX={7} refY={2.5} orient="auto">
              <polygon points="0 0, 7 2.5, 0 5" fill="#2563eb" />
            </marker>
          </defs>
          <rect x={85} y={8} width={W - 100} height={H - 16} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="6 3" />
          <text x={90} y={24} fill="#94a3b8" fontSize={10} fontFamily="Inter,sans-serif" fontWeight="600">{exercise.diagramSystemLabel}</text>
          {connections.map(([fromId, toId], i) => {
            const ep = lineEndpoints(fromId, toId);
            if (!ep) return null;
            return (
              <g key={i}>
                {ep.isUcUc ? (
                  <>
                    <line x1={ep.x1} y1={ep.y1} x2={ep.x2} y2={ep.y2}
                      stroke="#2563eb" strokeWidth={1.3} strokeDasharray="4 2"
                      markerEnd="url(#ucArrowPractice)" />
                    <text x={(ep.x1 + ep.x2) / 2} y={(ep.y1 + ep.y2) / 2 - 4}
                      textAnchor="middle" fill="#2563eb" fontSize={9} fontFamily="Inter,sans-serif">«include»</text>
                  </>
                ) : (
                  <line x1={ep.x1} y1={ep.y1} x2={ep.x2} y2={ep.y2} stroke="#94a3b8" strokeWidth={1.2} />
                )}
              </g>
            );
          })}
        </svg>

        {actors.map(actor => {
          const slot = actor.slotId ? slots.find(s => s.id === actor.slotId) : null;
          return (
            <div key={actor.id} className="absolute flex flex-col items-center gap-0.5" style={{ left: actor.x - 30, top: actor.y - 40, width: 60 }}>
              <StickFigure color="#1e3a6e" />
              {actor.name && (
                <span className="text-[10px] font-semibold text-slate-700 text-center whitespace-nowrap">{actor.name}</span>
              )}
              {slot && (
                <DiagramSlotBox slot={slot} assignment={assignments[slot.id]} submitted={submitted}
                  overSlot={overSlot} onDragOver={onDragOver} onDragLeave={onDragLeave}
                  onDrop={onDrop} onDragStart={onDragStart} compact />
              )}
            </div>
          );
        })}

        {useCases.map(uc => {
          const slot = uc.slotId ? slots.find(s => s.id === uc.slotId) : null;
          return (
            <div key={uc.id} className={cn(
              "absolute flex items-center justify-center rounded-full border-2 text-[11px] font-medium text-slate-700 px-3 text-center",
              slot ? "border-dashed border-slate-400 bg-slate-50/80" : "border-blue-500 bg-blue-50"
            )} style={{ left: uc.x - 64, top: uc.y - 16, width: 128, height: 32 }}>
              {uc.name && <span>{uc.name}</span>}
              {slot && (
                <DiagramSlotBox slot={slot} assignment={assignments[slot.id]} submitted={submitted}
                  overSlot={overSlot} onDragOver={onDragOver} onDragLeave={onDragLeave}
                  onDrop={onDrop} onDragStart={onDragStart} compact />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── DIAGRAM LABEL — main exercise ─────────────────────────────────────────────
function DiagramLabelExercise({ exercise, onScore }: { exercise: Exercise; onScore: (c: boolean) => void }) {
  const slots = exercise.diagramSlots ?? [];
  const [shuffledLabels] = useState(() => [...(exercise.allLabels ?? [])].sort(() => Math.random() - 0.5));
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [overSlot, setOverSlot] = useState<string | null>(null);
  const [overPool, setOverPool] = useState(false);

  const usedLabels = new Set(Object.values(assignments));
  const poolLabels = shuffledLabels.filter(l => !usedLabels.has(l));
  const allPlaced = slots.every(s => assignments[s.id] !== undefined);

  function handleLabelDragStart(e: React.DragEvent, label: string, fromSlot: string) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("label", label);
    e.dataTransfer.setData("fromSlot", fromSlot);
  }
  function handleSlotDrop(slotId: string, label: string, fromSlot: string) {
    setAssignments(prev => {
      const next = { ...prev };
      if (fromSlot) delete next[fromSlot];
      next[slotId] = label;
      return next;
    });
    setOverSlot(null);
  }
  function handlePoolDrop(e: React.DragEvent) {
    e.preventDefault();
    const fromSlot = e.dataTransfer.getData("fromSlot");
    if (fromSlot) {
      setAssignments(prev => { const n = { ...prev }; delete n[fromSlot]; return n; });
    }
    setOverPool(false);
  }
  function handleSubmit() {
    setSubmitted(true);
    const correct = slots.filter(s => assignments[s.id] === s.correctLabel).length;
    onScore(correct >= Math.ceil(slots.length * 0.6));
  }

  const rendererProps = {
    exercise, slots, assignments, submitted, overSlot,
    onDragOver: setOverSlot, onDragLeave: () => setOverSlot(null),
    onDrop: handleSlotDrop, onDragStart: handleLabelDragStart
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{exercise.question}</p>

      {exercise.diagramType === "class" && <ClassDiagramRenderer {...rendererProps} />}
      {exercise.diagramType === "usecase" && <UseCaseDiagramRenderer {...rendererProps} />}

      {!submitted && (
        <>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Label pool — drag to a slot in the diagram:</p>
          <div
            onDragOver={e => { e.preventDefault(); setOverPool(true); }}
            onDragLeave={() => setOverPool(false)}
            onDrop={handlePoolDrop}
            className={cn("min-h-12 border-2 border-dashed rounded-xl p-3 mb-5 flex flex-wrap gap-2 transition-colors",
              overPool ? "border-primary bg-primary/5" : "border-border bg-slate-50")}
          >
            {poolLabels.length === 0
              ? <p className="text-xs text-muted-foreground italic">All labels placed — drag back here to un-assign</p>
              : poolLabels.map(label => (
                <div key={label}
                  draggable
                  onDragStart={e => handleLabelDragStart(e, label, "")}
                  className="px-2.5 py-1 rounded-lg border text-xs font-mono select-none cursor-grab border-border bg-white hover:border-primary/60 hover:bg-primary/5 shadow-sm active:cursor-grabbing transition-all active:scale-95">
                  {label}
                </div>
              ))}
          </div>
        </>
      )}

      {submitted && (
        <Card className="border-border bg-slate-50 mb-4">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Correct answers:</p>
            {slots.map(s => (
              <div key={s.id} className="flex items-center gap-2 text-xs mb-1.5">
                {assignments[s.id] === s.correctLabel
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                <span className="text-muted-foreground shrink-0 capitalize">{s.hint ?? s.id}:</span>
                <span className="font-mono text-foreground">{s.correctLabel}</span>
                {assignments[s.id] !== s.correctLabel && assignments[s.id] && (
                  <span className="text-red-400 font-mono text-[10px]">(you: {assignments[s.id]})</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {!submitted && (
        <Button size="sm" onClick={handleSubmit} disabled={!allPlaced}>
          Check Diagram ({slots.filter(s => assignments[s.id] !== undefined).length}/{slots.length} placed)
        </Button>
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
    "classify": "Drag & Drop",
    "order": "Drag to Order",
    "match": "Match (Drag or Click)",
    "fill-blank": "Fill in the Blank",
    "short-answer": "Short Answer",
    "diagram-label": "Diagram Labelling",
  };
  const typeColors: Record<Exercise["type"], string> = {
    "classify": "bg-blue-100 text-blue-700 border-blue-200",
    "order": "bg-violet-100 text-violet-700 border-violet-200",
    "match": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "fill-blank": "bg-amber-100 text-amber-700 border-amber-200",
    "short-answer": "bg-rose-100 text-rose-700 border-rose-200",
    "diagram-label": "bg-cyan-100 text-cyan-700 border-cyan-200",
  };
  const typeIcons: Record<Exercise["type"], React.ReactNode> = {
    "classify": <Network className="w-3 h-3" />,
    "order": <ChevronRight className="w-3 h-3" />,
    "match": <GitBranch className="w-3 h-3" />,
    "fill-blank": <BookOpen className="w-3 h-3" />,
    "short-answer": <BookOpen className="w-3 h-3" />,
    "diagram-label": <GitBranch className="w-3 h-3" />,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <Badge variant="outline" className={`text-xs mb-2 ${unitAccents[actualIndex]}`}>LU{actualIndex + 1}</Badge>
          <h2 className="font-semibold text-sm leading-snug text-foreground">{unit.shortTitle}</h2>
          <p className="text-xs text-muted-foreground mt-1">{done}/{unit.exercises.length} done · {score} correct</p>
        </div>
        <div className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {unit.exercises.map((ex, i) => (
            <button key={ex.id} data-testid={`exercise-nav-${i}`} onClick={() => setExerciseIndex(i)}
              className={cn("w-full text-left px-3 py-2.5 rounded-lg transition-colors",
                i === exerciseIndex ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}>
              <div className="flex items-center justify-between">
                <span className="text-xs">{typeLabel[ex.type]}</span>
                {scores[i] !== undefined && (scores[i] ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-red-500" />)}
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
        <div className="h-1.5 bg-secondary">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(done / unit.exercises.length) * 100}%` }} />
        </div>
        <ScrollArea className="flex-1">
          <div className="max-w-2xl mx-auto px-8 py-8">
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="outline" className={cn("text-xs gap-1 flex items-center", typeColors[exercise.type])}>
                {typeIcons[exercise.type]}
                {typeLabel[exercise.type]}
              </Badge>
              <span className="text-xs text-muted-foreground">{exerciseIndex + 1} of {unit.exercises.length}</span>
              {scores[exerciseIndex] !== undefined && (
                scores[exerciseIndex]
                  ? <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200 border">✓ Correct</Badge>
                  : <Badge className="text-xs bg-red-100 text-red-700 border-red-200 border">✗ Needs review</Badge>
              )}
            </div>
            <Card className="border-border shadow-sm">
              <CardContent className="pt-6 pb-6">
                {exercise.type === "classify" && <ClassifyExercise key={`${unitId}-${exerciseIndex}`} exercise={exercise} onScore={handleScore} />}
                {exercise.type === "order" && <OrderExercise key={`${unitId}-${exerciseIndex}`} exercise={exercise} onScore={handleScore} />}
                {exercise.type === "match" && <MatchExercise key={`${unitId}-${exerciseIndex}`} exercise={exercise} onScore={handleScore} />}
                {exercise.type === "fill-blank" && <FillBlankExercise key={`${unitId}-${exerciseIndex}`} exercise={exercise} onScore={handleScore} />}
                {exercise.type === "short-answer" && <ShortAnswerExercise key={`${unitId}-${exerciseIndex}`} exercise={exercise} onScore={handleScore} />}
                {exercise.type === "diagram-label" && <DiagramLabelExercise key={`${unitId}-${exerciseIndex}`} exercise={exercise} onScore={handleScore} />}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        <div className="border-t border-border px-8 py-4 flex items-center justify-between bg-background">
          <Button variant="outline" size="sm" onClick={() => setExerciseIndex(i => Math.max(0, i - 1))} disabled={exerciseIndex === 0} className="gap-1.5">
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <div className="flex gap-1.5">
            {unit.exercises.map((_, i) => (
              <button key={i} onClick={() => setExerciseIndex(i)}
                className={cn("w-2 h-2 rounded-full transition-colors",
                  i === exerciseIndex ? "bg-primary" :
                  scores[i] !== undefined ? (scores[i] ? "bg-emerald-400" : "bg-red-400") :
                  "bg-border hover:bg-primary/40")} />
            ))}
          </div>
          <Button size="sm" onClick={() => exerciseIndex < unit.exercises.length - 1 ? setExerciseIndex(i => i + 1) : setLocation("/practice")} className="gap-1.5">
            {exerciseIndex < unit.exercises.length - 1 ? <>Next <ChevronRight className="w-4 h-4" /></> : "All Units"}
          </Button>
        </div>
      </div>
    </div>
  );
}
