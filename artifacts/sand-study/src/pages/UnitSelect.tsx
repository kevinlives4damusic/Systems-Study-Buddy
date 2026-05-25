import { Link } from "wouter";
import { BookOpen, FlaskConical, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/contexts/ProgressContext";
import { UNITS } from "@/data/studyData";

const unitColors = [
  "border-blue-200 hover:border-blue-400 hover:bg-blue-50/50",
  "border-violet-200 hover:border-violet-400 hover:bg-violet-50/50",
  "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50",
  "border-amber-200 hover:border-amber-400 hover:bg-amber-50/50",
  "border-rose-200 hover:border-rose-400 hover:bg-rose-50/50",
];
const unitBadge = [
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-rose-100 text-rose-700 border-rose-200",
];
const unitAccent = [
  "text-blue-600", "text-violet-600", "text-emerald-600", "text-amber-600", "text-rose-600",
];
const unitProgress = [
  "bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500",
];

export default function UnitSelect({ mode }: { mode: "learn" | "practice" }) {
  const { getUnitProgress, getTotalExerciseScore } = useProgress();
  const isLearn = mode === "learn";

  return (
    <div className="px-4 py-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-1.5">
        {isLearn
          ? <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          : <FlaskConical className="w-5 h-5 md:w-6 md:h-6 text-violet-600" />}
        <h1 className="text-xl md:text-2xl font-bold text-foreground">{isLearn ? "Learn" : "Practice"}</h1>
      </div>
      <p className="text-muted-foreground text-sm mb-6 md:mb-8">
        {isLearn
          ? "Choose a unit to study. Work through concepts, examples, and key points."
          : "Choose a unit to practise. Interactive exercises test your understanding."}
      </p>

      <div className="space-y-2.5 md:space-y-3">
        {UNITS.map((unit, i) => {
          const unitProg = getUnitProgress(unit.id);
          const { correct, total } = getTotalExerciseScore(unit.id);
          const isStudied = unitProg.studied;
          const href = `/${mode}/${unit.id}`;
          const exercisePct = unit.exercises.length > 0 ? (total / unit.exercises.length) * 100 : 0;
          return (
            <Link key={unit.id} href={href}>
              <Card className={`border cursor-pointer transition-all ${unitColors[i]} bg-card shadow-sm active:scale-[0.99]`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`text-xs ${unitBadge[i]}`}>LU{i + 1}</Badge>
                        {isStudied && isLearn && <CheckCircle2 className={`w-3.5 h-3.5 ${unitAccent[i]}`} />}
                        {!isLearn && total > 0 && (
                          <span className={`text-xs font-medium ${unitAccent[i]}`}>{correct}/{total} ✓</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm text-foreground leading-snug">{unit.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{unit.description}</p>
                      {exercisePct > 0 && !isLearn && (
                        <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${unitProgress[i]}`} style={{ width: `${exercisePct}%` }} />
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 flex items-center gap-2 md:gap-3">
                      <div className="text-right text-xs text-muted-foreground hidden md:block">
                        <div>{unit.concepts.length} concepts</div>
                        <div>{unit.exercises.length} exercises</div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1 h-9 md:h-8 text-xs px-3">
                        {isLearn ? (isStudied ? "Review" : "Start") : "Go"}
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

      <div className="mt-5 md:mt-6 text-xs text-muted-foreground text-center">
        {isLearn
          ? "Complete all concepts in a unit to earn 15 XP and unlock Practice."
          : "Each correct exercise earns 5 XP. Short-answer uses self-marking."}
      </div>
    </div>
  );
}
