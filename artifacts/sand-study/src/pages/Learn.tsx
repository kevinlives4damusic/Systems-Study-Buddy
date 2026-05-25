import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { ChevronLeft, ChevronRight, CheckCircle2, BookOpen, Lightbulb, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProgress } from "@/contexts/ProgressContext";
import { UNITS } from "@/data/studyData";
import { cn } from "@/lib/utils";

const unitAccents = [
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-rose-100 text-rose-700 border-rose-200",
];

const unitBorders = [
  "border-blue-200",
  "border-violet-200",
  "border-emerald-200",
  "border-amber-200",
  "border-rose-200",
];

export default function Learn() {
  const [, params] = useRoute("/learn/:unitId");
  const [, setLocation] = useLocation();
  const [conceptIndex, setConceptIndex] = useState(0);
  const [showKeyPoints, setShowKeyPoints] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const { markUnitStudied, getUnitProgress } = useProgress();

  const unitId = params?.unitId ?? "lu1";
  const unitIndex = UNITS.findIndex(u => u.id === unitId);
  const unit = UNITS[unitIndex] ?? UNITS[0];
  const actualIndex = unitIndex >= 0 ? unitIndex : 0;
  const concept = unit.concepts[conceptIndex];
  const isLast = conceptIndex === unit.concepts.length - 1;
  const isStudied = getUnitProgress(unitId).studied;

  function handleNext() {
    if (isLast) { markUnitStudied(unitId); setLocation(`/practice/${unitId}`); }
    else { setConceptIndex(i => i + 1); setShowKeyPoints(false); setShowExample(false); }
  }

  function handlePrev() {
    if (conceptIndex > 0) { setConceptIndex(i => i - 1); setShowKeyPoints(false); setShowExample(false); }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <Badge variant="outline" className={`text-xs mb-2 ${unitAccents[actualIndex]}`}>LU{actualIndex + 1}</Badge>
          <h2 className="font-semibold text-sm leading-snug text-foreground">{unit.shortTitle}</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {unit.concepts.map((c, i) => (
              <button key={c.id} data-testid={`concept-item-${i}`}
                onClick={() => { setConceptIndex(i); setShowKeyPoints(false); setShowExample(false); }}
                className={cn("w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors",
                  i === conceptIndex ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}>
                <span className="opacity-60 mr-1.5">{i + 1}.</span>{c.title}
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-border">
          {isStudied && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" /><span>Unit studied</span>
            </div>
          )}
          <Button variant="outline" size="sm" className="w-full text-xs"
            onClick={() => setLocation(`/practice/${unitId}`)} data-testid="btn-go-to-practice">
            Practice Exercises
          </Button>
          <Button variant="ghost" size="sm" className="w-full text-xs mt-1"
            onClick={() => setLocation("/learn")}>
            All Units
          </Button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-1.5 bg-secondary">
          <div className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((conceptIndex + 1) / unit.concepts.length) * 100}%` }} />
        </div>

        <ScrollArea className="flex-1">
          <div className="max-w-2xl mx-auto px-8 py-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Concept {conceptIndex + 1} of {unit.concepts.length}</span>
            </div>

            <h1 className="text-2xl font-bold mb-5 text-foreground">{concept.title}</h1>

            <Card className={`border ${unitBorders[actualIndex]} bg-card mb-4 shadow-sm`}>
              <CardContent className="pt-5 pb-5">
                <div className="prose prose-sm max-w-none">
                  {concept.description.split("\n\n").map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed text-foreground mb-3 last:mb-0 whitespace-pre-line">{para}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {concept.example && (
              <div className="mb-4">
                <button data-testid="btn-toggle-example"
                  onClick={() => setShowExample(v => !v)}
                  className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-500 transition-colors mb-2">
                  <Lightbulb className="w-4 h-4" />
                  {showExample ? "Hide example" : "Show real-world example"}
                </button>
                {showExample && (
                  <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-4 pb-4">
                      <div className="text-sm leading-relaxed whitespace-pre-line text-foreground">{concept.example}</div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {concept.keyPoints && concept.keyPoints.length > 0 && (
              <div className="mb-6">
                <button data-testid="btn-toggle-keypoints"
                  onClick={() => setShowKeyPoints(v => !v)}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-2">
                  <KeyRound className="w-4 h-4" />
                  {showKeyPoints ? "Hide key points" : "Show key points to remember"}
                </button>
                {showKeyPoints && (
                  <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="pt-4 pb-4">
                      <ul className="space-y-2">
                        {concept.keyPoints.map((kp, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-foreground">{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border px-8 py-4 flex items-center justify-between bg-background">
          <Button variant="outline" size="sm" onClick={handlePrev} disabled={conceptIndex === 0}
            data-testid="btn-prev-concept" className="gap-1.5">
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <div className="flex gap-1.5">
            {unit.concepts.map((_, i) => (
              <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all",
                i === conceptIndex ? "bg-primary w-4" : i < conceptIndex ? "bg-primary/60" : "bg-secondary")} />
            ))}
          </div>
          <Button size="sm" onClick={handleNext} data-testid="btn-next-concept" className="gap-1.5">
            {isLast ? <>Practice Now <ChevronRight className="w-4 h-4" /></> : <>Next <ChevronRight className="w-4 h-4" /></>}
          </Button>
        </div>
      </div>
    </div>
  );
}
