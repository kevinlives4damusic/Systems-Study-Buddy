import { useState, useCallback } from "react";
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

// ── Classify exercise ────────────────────────────────────────────
function ClassifyExercise({ exercise, unitId, onScore }: {
  exercise: Exercise; unitId: string;
  onScore: (correct: boolean) => void;
}) {
  const categories = exercise.categories ?? [];
  const items = exercise.items ?? [];
  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const correctMap: Record<number, string> = {};
  if (categories.length === 2) {
    items.forEach((_, i) => {
      correctMap[i] = i % 2 === 0 ? categories[0] : categories[1];
    });
  }

  const computeAnswers = () => {
    const correctAnswers: Record<number, string> = {};
    if (categories[0].includes("Analysis") || categories[0].includes("Functional") || categories[0].includes("Internal") || categories[0].includes("Visibility") || categories[0].includes("Unit")) {
      items.forEach((item, i) => {
        const c0 = categories[0];
        const c1 = categories[1];
        if (c0.includes("Analysis") && c1.includes("Design")) {
          const designWords = ["form", "table", "database", "layout", "encrypt", "hash", "field", "key", "foreign", "authentication", "bcrypt", "screen"];
          correctAnswers[i] = designWords.some(w => item.toLowerCase().includes(w)) ? c1 : c0;
        } else if (c0.includes("Functional") && c1.includes("Non-Functional")) {
          const nonFunc = ["24/7", "password", "response", "available", "secure", "encrypted", "protected", "performance", "2 second", "fast"];
          correctAnswers[i] = nonFunc.some(w => item.toLowerCase().includes(w)) ? c1 : c0;
        } else if (c0.includes("Internal") && c1.includes("External")) {
          const external = ["parent", "nanny", "client", "customer", "regulatory", "payment", "provider", "multi-national", "hiring"];
          correctAnswers[i] = external.some(w => item.toLowerCase().includes(w)) ? c1 : c0;
        } else if (c0.includes("Visibility") && c1.includes("Affordance")) {
          const affordance = ["styled as plain", "link", "clickable area", "text with no underline"];
          const good = ["prominently", "clearly", "visible", "tick"];
          if (good.some(w => item.toLowerCase().includes(w))) correctAnswers[i] = "Good Design";
          else if (affordance.some(w => item.toLowerCase().includes(w))) correctAnswers[i] = c1;
          else correctAnswers[i] = c0;
        } else if (c0.includes("Unit") || c0.includes("Integration")) {
          const testMap: Record<string, string> = {
            "calculateBookingFee": "Unit Testing",
            "booking module correctly updates": "Integration Testing",
            "stakeholders": "UAT",
            "5,000 simultaneous": "Performance Testing",
            "After fixing": "Regression Testing",
            "full integrated system": "System Testing",
          };
          let found = false;
          for (const [k, v] of Object.entries(testMap)) {
            if (item.includes(k)) { correctAnswers[i] = v; found = true; break; }
          }
          if (!found) correctAnswers[i] = categories[i % categories.length];
        } else {
          correctAnswers[i] = categories[i % categories.length];
        }
      });
    } else {
      items.forEach((_, i) => { correctAnswers[i] = categories[i % categories.length]; });
    }
    return correctAnswers;
  };

  const correctAnswers = computeAnswers();

  function handleDrop(cat: string) {
    if (draggingIdx === null) return;
    setAssignments(prev => ({ ...prev, [draggingIdx]: cat }));
    setDraggingIdx(null);
  }

  function handleSubmit() {
    setSubmitted(true);
    const total = items.length;
    const correct = items.filter((_, i) => assignments[i] === correctAnswers[i]).length;
    onScore(correct >= Math.ceil(total / 2));
  }

  const assigned = Object.keys(assignments).length;

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-5">{exercise.question}</p>

      {/* Items to drag */}
      {!submitted && (
        <div className="mb-5">
          <p className="text-xs text-muted-foreground mb-2">Click an item, then click a category to assign it:</p>
          <div className="flex flex-wrap gap-2">
            {items.map((item, i) => (
              <button
                key={i}
                data-testid={`classify-item-${i}`}
                onClick={() => setDraggingIdx(draggingIdx === i ? null : i)}
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-xs text-left transition-all",
                  assignments[i] ? "opacity-40 line-through" : "",
                  draggingIdx === i ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:border-primary/50"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category drop zones */}
      <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, 3)}, 1fr)` }}>
        {categories.map(cat => {
          const assignedItems = items.filter((_, i) => assignments[i] === cat);
          const isTarget = draggingIdx !== null;
          return (
            <div
              key={cat}
              data-testid={`category-${cat.replace(/\s/g, "-")}`}
              onClick={() => isTarget && handleDrop(cat)}
              className={cn(
                "border rounded-xl p-3 min-h-24 transition-all",
                isTarget && !submitted ? "border-primary/60 bg-primary/5 cursor-pointer" : "border-border bg-card/50"
              )}
            >
              <p className="text-xs font-semibold text-muted-foreground mb-2">{cat}</p>
              <div className="flex flex-wrap gap-1.5">
                {assignedItems.map((item, j) => {
                  const originalIdx = items.indexOf(item);
                  const isCorrect = submitted && assignments[originalIdx] === correctAnswers[originalIdx];
                  const isWrong = submitted && assignments[originalIdx] !== correctAnswers[originalIdx];
                  return (
                    <span
                      key={j}
                      onClick={e => { e.stopPropagation(); if (!submitted) { const newA = { ...assignments }; delete newA[originalIdx]; setAssignments(newA); } }}
                      className={cn(
                        "px-2 py-1 rounded text-xs border cursor-pointer",
                        isCorrect ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" :
                          isWrong ? "bg-red-500/20 border-red-500/40 text-red-300" :
                            "bg-secondary border-border text-foreground"
                      )}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submitted: show correct answers */}
      {submitted && (
        <Card className="border-border bg-card/50 mb-4">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Correct Answers:</p>
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs mb-1">
                {assignments[i] === correctAnswers[i]
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                <span className="text-foreground">{item}</span>
                <span className="text-muted-foreground ml-auto shrink-0">{correctAnswers[i]}</span>
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
          Submit ({assigned}/{items.length} assigned)
        </Button>
      )}
    </div>
  );
}

// ── Order exercise ────────────────────────────────────────────
function OrderExercise({ exercise, onScore }: { exercise: Exercise; onScore: (c: boolean) => void }) {
  const original = exercise.items ?? [];
  const [order, setOrder] = useState(() => [...original].sort(() => Math.random() - 0.5));
  const [submitted, setSubmitted] = useState(false);

  const correctOrder = ["Planning", "Analysis", "Design", "Implementation", "Support / Maintenance"];

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  }

  function handleSubmit() {
    setSubmitted(true);
    const isCorrect = order.every((item, i) => item === correctOrder[i]);
    onScore(isCorrect);
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-5">{exercise.question}</p>
      <div className="space-y-2 mb-5">
        {order.map((item, i) => (
          <div key={item} data-testid={`order-item-${i}`} className={cn(
            "flex items-center gap-3 border rounded-lg px-4 py-2.5 text-sm",
            submitted
              ? item === correctOrder[i] ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-300" : "border-red-500/40 bg-red-500/5 text-red-300"
              : "border-border bg-card"
          )}>
            <span className="text-muted-foreground text-xs w-4 shrink-0">{i + 1}.</span>
            <span className="flex-1">{item}</span>
            {!submitted && (
              <div className="flex gap-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-0.5">▲</button>
                <button onClick={() => move(i, 1)} disabled={i === order.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-0.5">▼</button>
              </div>
            )}
            {submitted && item !== correctOrder[i] && (
              <span className="text-xs text-muted-foreground shrink-0">→ should be: {correctOrder[i]}</span>
            )}
          </div>
        ))}
      </div>
      {!submitted && (
        <Button data-testid="btn-submit-order" size="sm" onClick={handleSubmit}>Check Order</Button>
      )}
      {submitted && (
        <p className="text-sm text-muted-foreground">Correct order: {correctOrder.join(" → ")}</p>
      )}
    </div>
  );
}

// ── Match exercise ────────────────────────────────────────────
function MatchExercise({ exercise, onScore }: { exercise: Exercise; onScore: (c: boolean) => void }) {
  const pairs = exercise.pairs ?? [];
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const shuffledDefs = [...pairs.map(p => p.definition)].sort(() => Math.random() - 0.5);
  const [defs] = useState(shuffledDefs);

  function handleTermClick(term: string) {
    if (submitted || Object.keys(matched).includes(term)) return;
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
      <p className="text-sm text-muted-foreground mb-2">{exercise.question}</p>
      <p className="text-xs text-muted-foreground mb-5">Click a term, then click its matching definition.</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Terms</p>
          {pairs.map(p => {
            const isMatched = matched[p.term] !== undefined;
            const isSelected = selected === p.term;
            const isCorrect = submitted && matched[p.term] === p.definition;
            const isWrong = submitted && matched[p.term] !== p.definition;
            return (
              <button
                key={p.term}
                data-testid={`match-term-${p.term.replace(/\s/g, "-")}`}
                onClick={() => handleTermClick(p.term)}
                className={cn(
                  "w-full text-left text-xs px-3 py-2.5 rounded-lg border transition-all",
                  isSelected ? "border-primary bg-primary/10 text-primary" :
                    isCorrect ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-300" :
                      isWrong ? "border-red-500/40 bg-red-500/5 text-red-300" :
                        isMatched ? "border-border opacity-60" :
                          "border-border bg-card hover:border-primary/40"
                )}
              >
                {p.term}
                {isMatched && <span className="text-muted-foreground ml-1">✓</span>}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Definitions</p>
          {defs.map(def => {
            const matchedTerm = Object.entries(matched).find(([, v]) => v === def)?.[0];
            const isUsed = matchedTerm !== undefined;
            const isTarget = selected !== null && !isUsed;
            const isCorrect = submitted && matchedTerm && matched[matchedTerm] === def && pairs.find(p => p.term === matchedTerm)?.definition === def;
            const isWrong = submitted && isUsed && !isCorrect;
            return (
              <button
                key={def}
                data-testid={`match-def-${def.slice(0, 20).replace(/\s/g, "-")}`}
                onClick={() => handleDefClick(def)}
                className={cn(
                  "w-full text-left text-xs px-3 py-2.5 rounded-lg border transition-all",
                  isTarget ? "border-primary/60 bg-primary/5 cursor-pointer hover:bg-primary/10" :
                    isCorrect ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-300" :
                      isWrong ? "border-red-500/40 bg-red-500/5 text-red-300" :
                        isUsed ? "border-border opacity-60" :
                          "border-border bg-card"
                )}
              >
                {def}
              </button>
            );
          })}
        </div>
      </div>

      {submitted && (
        <Card className="border-border bg-card/50 mb-4">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Correct Matches:</p>
            {pairs.map(p => (
              <div key={p.term} className="flex items-start gap-2 text-xs mb-1.5">
                {matched[p.term] === p.definition
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />}
                <span className="font-medium text-foreground shrink-0">{p.term}:</span>
                <span className="text-muted-foreground">{p.definition}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {!submitted && (
        <Button
          data-testid="btn-submit-match"
          size="sm"
          onClick={handleSubmit}
          disabled={Object.keys(matched).length < pairs.length}
        >
          Check Matches ({Object.keys(matched).length}/{pairs.length})
        </Button>
      )}
    </div>
  );
}

// ── Fill blank exercise ────────────────────────────────────────────
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
      <p className="text-sm text-muted-foreground mb-5">{exercise.question}</p>
      <div className="text-sm leading-loose bg-card border border-border rounded-xl p-5 mb-5">
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
                    "inline-block border-b-2 bg-transparent text-center text-sm px-2 min-w-20 outline-none mx-1",
                    isCorrect ? "border-emerald-500 text-emerald-300" :
                      isWrong ? "border-red-500 text-red-300" :
                        "border-primary/60 text-foreground"
                  )}
                  placeholder="..."
                />
              );
            })()}
          </span>
        ))}
      </div>

      {submitted && (
        <Card className="border-border bg-card/50 mb-4">
          <CardContent className="pt-3 pb-3">
            <div className="flex flex-wrap gap-2">
              {blanks.map(b => (
                <div key={b.blank} className="flex items-center gap-1.5 text-xs">
                  {answers[b.blank]?.toLowerCase().trim() === b.answer.toLowerCase().trim()
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  <span className="text-muted-foreground">{b.blank.replace("BLANK", "")}:</span>
                  <span className="text-foreground font-medium">{b.answer}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!submitted && (
        <Button
          data-testid="btn-submit-fill"
          size="sm"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < blanks.length}
        >
          Check Answers
        </Button>
      )}
    </div>
  );
}

// ── Short answer exercise ────────────────────────────────────────────
function ShortAnswerExercise({ exercise, unitId, onScore }: { exercise: Exercise; unitId: string; onScore: (c: boolean) => void }) {
  const [answer, setAnswer] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selfMark, setSelfMark] = useState<boolean | null>(null);

  function handleReveal() {
    setShowModel(true);
  }

  function handleSelfMark(correct: boolean) {
    setSelfMark(correct);
    onScore(correct);
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-4">
        <p className="text-sm text-foreground leading-relaxed">{exercise.question}</p>
      </div>

      {exercise.hint && (
        <div className="mb-4">
          <button
            data-testid="btn-show-hint"
            onClick={() => setShowHint(v => !v)}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {showHint ? "Hide hint" : "Show hint"}
          </button>
          {showHint && (
            <p className="text-xs text-amber-300/80 mt-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
              {exercise.hint}
            </p>
          )}
        </div>
      )}

      <Textarea
        data-testid="input-short-answer"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="Write your answer here. Try to be thorough — think about the key concepts and how they apply to the scenario..."
        className="min-h-32 text-sm mb-4 resize-none"
      />

      {!showModel && (
        <Button
          data-testid="btn-reveal-answer"
          variant="outline"
          size="sm"
          onClick={handleReveal}
          disabled={answer.trim().length < 20}
          className="gap-1.5"
        >
          <Eye className="w-4 h-4" />
          Reveal Model Answer
        </Button>
      )}

      {showModel && (
        <>
          <Card className="border-primary/30 bg-primary/5 mb-4">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm text-primary">Model Answer</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <pre className="text-xs leading-relaxed whitespace-pre-wrap text-foreground font-sans">
                {exercise.modelAnswer}
              </pre>
            </CardContent>
          </Card>

          {selfMark === null && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">How did you do?</p>
              <Button
                data-testid="btn-self-mark-correct"
                size="sm"
                onClick={() => handleSelfMark(true)}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                I covered the key points
              </Button>
              <Button
                data-testid="btn-self-mark-incorrect"
                variant="outline"
                size="sm"
                onClick={() => handleSelfMark(false)}
                className="gap-1.5 border-border"
              >
                <XCircle className="w-3.5 h-3.5" />
                I missed some points
              </Button>
            </div>
          )}

          {selfMark !== null && (
            <div className={cn("flex items-center gap-2 text-sm", selfMark ? "text-emerald-400" : "text-amber-400")}>
              {selfMark
                ? <><CheckCircle2 className="w-4 h-4" /> Great work! Review what you wrote vs the model answer.</>
                : <><BookOpen className="w-4 h-4" /> Review the model answer and try again on your next study session.</>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Practice page ────────────────────────────────────────────
export default function Practice() {
  const [, params] = useRoute("/practice/:unitId");
  const [, setLocation] = useLocation();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [scores, setScores] = useState<Record<number, boolean>>({});
  const { recordExerciseScore, getUnitProgress } = useProgress();

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
    "classify": "Classification",
    "order": "Ordering",
    "match": "Matching",
    "fill-blank": "Fill in the Blank",
    "short-answer": "Short Answer",
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <Badge variant="outline" className={`text-xs mb-2 ${unitAccents[actualIndex]}`}>
            LU{actualIndex + 1}
          </Badge>
          <h2 className="font-semibold text-sm leading-snug">{unit.shortTitle}</h2>
          <p className="text-xs text-muted-foreground mt-1">{done}/{unit.exercises.length} complete</p>
        </div>
        <div className="flex-1 p-2 space-y-0.5">
          {unit.exercises.map((ex, i) => (
            <button
              key={ex.id}
              data-testid={`exercise-nav-${i}`}
              onClick={() => setExerciseIndex(i)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-lg transition-colors",
                i === exerciseIndex ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs">{typeLabel[ex.type]}</span>
                {scores[i] !== undefined && (
                  scores[i]
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    : <XCircle className="w-3.5 h-3.5 text-red-400" />
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">
            Score: {score}/{done} correct
          </div>
          <Button
            variant="outline" size="sm" className="w-full text-xs"
            onClick={() => setLocation(`/learn/${unitId}`)}
          >
            Back to Learn
          </Button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="h-1 bg-secondary">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((done) / unit.exercises.length) * 100}%` }}
          />
        </div>

        <ScrollArea className="flex-1">
          <div className="max-w-2xl mx-auto px-8 py-8">
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="outline" className="text-xs">{typeLabel[exercise.type]}</Badge>
              <span className="text-xs text-muted-foreground">{exerciseIndex + 1} of {unit.exercises.length}</span>
            </div>

            <Card className="border-border">
              <CardContent className="pt-6 pb-6">
                {exercise.type === "classify" && (
                  <ClassifyExercise exercise={exercise} unitId={unitId} onScore={handleScore} />
                )}
                {exercise.type === "order" && (
                  <OrderExercise exercise={exercise} onScore={handleScore} />
                )}
                {exercise.type === "match" && (
                  <MatchExercise exercise={exercise} onScore={handleScore} />
                )}
                {exercise.type === "fill-blank" && (
                  <FillBlankExercise exercise={exercise} onScore={handleScore} />
                )}
                {exercise.type === "short-answer" && (
                  <ShortAnswerExercise exercise={exercise} unitId={unitId} onScore={handleScore} />
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="border-t border-border px-8 py-4 flex items-center justify-between bg-background">
          <Button
            variant="outline" size="sm"
            onClick={() => setExerciseIndex(i => Math.max(0, i - 1))}
            disabled={exerciseIndex === 0}
            className="gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (exerciseIndex < unit.exercises.length - 1) setExerciseIndex(i => i + 1);
              else setLocation("/");
            }}
            className="gap-1.5"
          >
            {exerciseIndex < unit.exercises.length - 1 ? <>Next <ChevronRight className="w-4 h-4" /></> : "Done"}
          </Button>
        </div>
      </div>
    </div>
  );
}
