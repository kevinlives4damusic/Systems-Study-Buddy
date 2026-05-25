import { Link } from "wouter";
import { CheckCircle2, Circle, BookOpen, FlaskConical, Trophy, RotateCcw, GraduationCap, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/contexts/ProgressContext";
import { UNITS } from "@/data/studyData";

const unitColors = [
  "border-blue-200 bg-blue-50/40 hover:border-blue-300",
  "border-violet-200 bg-violet-50/40 hover:border-violet-300",
  "border-emerald-200 bg-emerald-50/40 hover:border-emerald-300",
  "border-amber-200 bg-amber-50/40 hover:border-amber-300",
  "border-rose-200 bg-rose-50/40 hover:border-rose-300",
];

const unitAccents = [
  "text-blue-600",
  "text-violet-600",
  "text-emerald-600",
  "text-amber-600",
  "text-rose-600",
];

const unitBadgeColors = [
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-rose-100 text-rose-700 border-rose-200",
];

function getLevel(xp: number) {
  if (xp >= 1000) return { level: 5, title: "Expert", next: null };
  if (xp >= 500) return { level: 4, title: "Advanced", next: 1000 };
  if (xp >= 250) return { level: 3, title: "Proficient", next: 500 };
  if (xp >= 100) return { level: 2, title: "Learner", next: 250 };
  return { level: 1, title: "Beginner", next: 100 };
}

export default function Dashboard() {
  const { progress, getTotalExerciseScore } = useProgress();
  const { xp, streak } = progress;
  const { level, title, next } = getLevel(xp);
  const levelFloor = [0, 100, 250, 500][level - 1] ?? 0;
  const levelPct = next ? Math.min(100, ((xp - levelFloor) / (next - levelFloor)) * 100) : 100;

  const studiedCount = Object.values(progress.units).filter(u => u.studied).length;
  const totalExercises = UNITS.reduce((s, u) => s + u.exercises.length, 0);
  const completedExercises = UNITS.reduce((s, u) => s + getTotalExerciseScore(u.id).total, 0);
  const examAttempted = Object.keys(progress.examAttempts).length;
  const lastStudied = UNITS.find(u => progress.units[u.id]?.studiedAt);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Study Dashboard</h1>
        <p className="text-muted-foreground mt-1">Systems Analysis &amp; Design — SAND6211/6221</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-border shadow-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Level</p>
                <p className="text-2xl font-bold mt-0.5 text-foreground">{level}</p>
                <p className="text-xs text-primary mt-0.5">{title}</p>
              </div>
              <Trophy className="w-5 h-5 text-amber-500 mt-0.5" />
            </div>
            <Progress value={levelPct} className="mt-3 h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">{xp} XP{next ? ` / ${next}` : ""}</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Units Studied</p>
                <p className="text-2xl font-bold mt-0.5 text-foreground">{studiedCount}<span className="text-sm text-muted-foreground font-normal">/{UNITS.length}</span></p>
                <p className="text-xs text-muted-foreground mt-0.5">{UNITS.length - studiedCount} remaining</p>
              </div>
              <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />
            </div>
            <Progress value={(studiedCount / UNITS.length) * 100} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Exercises Done</p>
                <p className="text-2xl font-bold mt-0.5 text-foreground">{completedExercises}<span className="text-sm text-muted-foreground font-normal">/{totalExercises}</span></p>
                <p className="text-xs text-muted-foreground mt-0.5">Interactive practice</p>
              </div>
              <FlaskConical className="w-5 h-5 text-violet-500 mt-0.5" />
            </div>
            <Progress value={(completedExercises / totalExercises) * 100} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Streak</p>
                <p className="text-2xl font-bold mt-0.5 text-foreground">{streak}<span className="text-sm text-muted-foreground font-normal"> days</span></p>
                <p className="text-xs text-muted-foreground mt-0.5">{examAttempted} exam Qs done</p>
              </div>
              <RotateCcw className="w-5 h-5 text-emerald-500 mt-0.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {lastStudied ? (
          <Link href={`/learn/${lastStudied.id}`}>
            <Button data-testid="btn-continue-learning" size="sm" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Continue: {lastStudied.shortTitle}
            </Button>
          </Link>
        ) : (
          <Link href="/learn/lu1">
            <Button data-testid="btn-start-learning" size="sm" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Start Learning
            </Button>
          </Link>
        )}
        <Link href="/exam">
          <Button data-testid="btn-start-exam" variant="outline" size="sm" className="gap-2">
            <GraduationCap className="w-4 h-4" />
            Exam Simulator
          </Button>
        </Link>
      </div>

      {/* Units grid */}
      <h2 className="text-lg font-semibold mb-4 text-foreground">Learning Units</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {UNITS.map((unit, i) => {
          const unitProg = progress.units[unit.id];
          const { correct, total } = getTotalExerciseScore(unit.id);
          const isStudied = unitProg?.studied ?? false;
          const exercisePct = unit.exercises.length > 0 ? (total / unit.exercises.length) * 100 : 0;

          return (
            <Card key={unit.id} data-testid={`unit-card-${unit.id}`}
              className={`border ${unitColors[i]} transition-all shadow-sm`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-xs px-2 py-0 ${unitBadgeColors[i]}`}>LU{i + 1}</Badge>
                      {isStudied && <CheckCircle2 className={`w-4 h-4 ${unitAccents[i]}`} />}
                    </div>
                    <CardTitle className="text-base font-semibold leading-snug text-foreground">{unit.shortTitle}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{unit.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Circle className="w-3 h-3" />
                  <span>{unit.concepts.length} concepts</span>
                  <span className="text-border">·</span>
                  <span>{unit.exercises.length} exercises</span>
                  {total > 0 && (
                    <>
                      <span className="text-border">·</span>
                      <span className={unitAccents[i]}>{correct}/{total} correct</span>
                    </>
                  )}
                </div>
                {exercisePct > 0 && <Progress value={exercisePct} className="h-1.5 mb-3" />}
                <div className="flex gap-2">
                  <Link href={`/learn/${unit.id}`}>
                    <Button data-testid={`btn-learn-${unit.id}`} variant={isStudied ? "outline" : "default"} size="sm" className="gap-1.5 h-8 text-xs">
                      <BookOpen className="w-3.5 h-3.5" />
                      {isStudied ? "Review" : "Learn"}
                    </Button>
                  </Link>
                  <Link href={`/practice/${unit.id}`}>
                    <Button data-testid={`btn-practice-${unit.id}`} variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                      <FlaskConical className="w-3.5 h-3.5" />
                      Practice
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 border-primary/30 bg-primary/5">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-foreground">Ready for the real thing?</h3>
              <p className="text-xs text-muted-foreground mt-0.5">3 full past-paper exam scenarios with model answers and self-marking</p>
            </div>
            <Link href="/exam">
              <Button data-testid="btn-exam-teaser" size="sm" variant="outline" className="gap-1.5 shrink-0">
                Exam Simulator <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
