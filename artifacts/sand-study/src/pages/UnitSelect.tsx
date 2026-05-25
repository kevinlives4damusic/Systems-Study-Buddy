import { Link, useLocation } from "wouter";
import { BookOpen, FlaskConical, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/contexts/ProgressContext";
import { UNITS } from "@/data/studyData";

const unitColors = [
  "border-blue-500/30 hover:border-blue-500/60",
  "border-violet-500/30 hover:border-violet-500/60",
  "border-emerald-500/30 hover:border-emerald-500/60",
  "border-amber-500/30 hover:border-amber-500/60",
  "border-rose-500/30 hover:border-rose-500/60",
];
const unitBadge = [
  "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "bg-rose-500/20 text-rose-300 border-rose-500/30",
];

export default function UnitSelect({ mode }: { mode: "learn" | "practice" }) {
  const { getUnitProgress, getTotalExerciseScore } = useProgress();
  const isLearn = mode === "learn";

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        {isLearn
          ? <BookOpen className="w-6 h-6 text-primary" />
          : <FlaskConical className="w-6 h-6 text-violet-400" />}
        <h1 className="text-2xl font-bold">{isLearn ? "Learn" : "Practice"}</h1>
      </div>
      <p className="text-muted-foreground text-sm mb-8">
        {isLearn
          ? "Choose a unit to study. Work through concepts, examples, and key points."
          : "Choose a unit to practise. Interactive exercises test your understanding."}
      </p>

      <div className="space-y-3">
        {UNITS.map((unit, i) => {
          const unitProg = getUnitProgress(unit.id);
          const { correct, total } = getTotalExerciseScore(unit.id);
          const isStudied = unitProg.studied;
          const href = `/${mode}/${unit.id}`;

          return (
            <Link key={unit.id} href={href}>
              <Card className={`border cursor-pointer transition-all ${unitColors[i]} bg-card/60`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`text-xs ${unitBadge[i]}`}>LU{i + 1}</Badge>
                        {isStudied && isLearn && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {!isLearn && total > 0 && (
                          <span className="text-xs text-muted-foreground">{correct}/{total} correct</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm">{unit.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{unit.description}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                      <div className="text-right text-xs text-muted-foreground">
                        <div>{unit.concepts.length} concepts</div>
                        <div>{unit.exercises.length} exercises</div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                        {isLearn ? (isStudied ? "Review" : "Start") : "Practise"}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 text-xs text-muted-foreground text-center">
        {isLearn
          ? "Tip: Complete all concepts in a unit to earn 15 XP and unlock the Practice exercises."
          : "Tip: Each correct exercise earns 5 XP. Short-answer exercises use self-marking."}
      </div>
    </div>
  );
}
