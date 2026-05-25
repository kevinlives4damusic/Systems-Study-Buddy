import { useState } from "react";
import { CheckCircle2, Eye, ChevronDown, ChevronUp, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProgress } from "@/contexts/ProgressContext";
import { EXAM_SCENARIOS, type SubQuestion } from "@/data/examQuestions";
import { cn } from "@/lib/utils";

function SubQuestionCard({ sq, scenarioId }: { sq: SubQuestion; scenarioId: string }) {
  const [answer, setAnswer] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState(false);
  const { saveExamAnswer, progress } = useProgress();

  const saved = progress.examAttempts[`${scenarioId}-${sq.id}`];

  function handleReveal() {
    if (answer.trim().length > 0) {
      saveExamAnswer(`${scenarioId}-${sq.id}`, answer);
    }
    setShowModel(true);
    setExpanded(true);
  }

  const coveredCount = Object.values(checked).filter(Boolean).length;

  return (
    <Card className="border-border">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(v => !v)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs shrink-0 font-mono">{sq.number}</Badge>
            <span className="text-xs text-muted-foreground">{sq.marks} mark{sq.marks !== 1 ? "s" : ""}</span>
            {saved?.attempted && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />}
        </div>
        <p className="text-sm text-foreground leading-relaxed mt-2">{sq.question}</p>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 pb-5">
          <Textarea
            data-testid={`exam-answer-${sq.id}`}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder={`Write your answer here. You have ${sq.marks} mark${sq.marks !== 1 ? "s" : ""} — aim for ${sq.marks} distinct, well-explained points.`}
            className="min-h-28 text-sm resize-none mb-3"
          />

          {!showModel ? (
            <Button
              data-testid={`btn-reveal-${sq.id}`}
              variant="outline"
              size="sm"
              onClick={handleReveal}
              disabled={answer.trim().length < 10}
              className="gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              Reveal Model Answer
            </Button>
          ) : (
            <div className="space-y-4">
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-sm text-primary flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Model Answer
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <pre className="text-xs leading-relaxed whitespace-pre-wrap text-foreground font-sans">
                    {sq.modelAnswer}
                  </pre>
                </CardContent>
              </Card>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Self-mark — tick each point you covered:
                </p>
                <div className="space-y-2">
                  {sq.keyPoints.map((kp, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Checkbox
                        id={`kp-${sq.id}-${i}`}
                        data-testid={`kp-check-${sq.id}-${i}`}
                        checked={checked[i] ?? false}
                        onCheckedChange={v => setChecked(prev => ({ ...prev, [i]: !!v }))}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={`kp-${sq.id}-${i}`}
                        className={cn(
                          "text-xs cursor-pointer leading-relaxed",
                          checked[i] ? "text-emerald-300" : "text-muted-foreground"
                        )}
                      >
                        {kp}
                      </label>
                    </div>
                  ))}
                </div>
                {sq.keyPoints.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {coveredCount}/{sq.keyPoints.length} key points covered
                    {coveredCount >= Math.ceil(sq.keyPoints.length * 0.6) ? " — well done" : " — review these points"}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function Exam() {
  const { progress } = useProgress();

  const attempted = EXAM_SCENARIOS.reduce((acc, sc) => {
    const count = sc.questions.reduce((a, q) =>
      a + q.subQuestions.filter(sq => progress.examAttempts[`${sc.id}-${sq.id}`]?.attempted).length, 0);
    return acc + count;
  }, 0);

  const total = EXAM_SCENARIOS.reduce((acc, sc) =>
    acc + sc.questions.reduce((a, q) => a + q.subQuestions.length, 0), 0);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Exam Simulator</h1>
        <p className="text-muted-foreground text-sm mt-1">Past-paper style questions with model answers and self-marking</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {attempted}/{total} questions attempted
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            2 hours for a full paper
          </span>
        </div>
      </div>

      <Card className="border-amber-500/20 bg-amber-500/5 mb-6">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-amber-300 font-semibold mb-1">How to use the exam simulator</p>
          <p className="text-xs text-muted-foreground">
            Read the scenario, write your answer in your own words, then click "Reveal Model Answer". 
            Compare your answer to the model and check off the key points you covered. 
            This teaches you to apply knowledge — not just recognise it.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue={EXAM_SCENARIOS[0].id}>
        <TabsList className="mb-6 w-full justify-start">
          {EXAM_SCENARIOS.map(sc => {
            const scAttempted = sc.questions.reduce((a, q) =>
              a + q.subQuestions.filter(sq => progress.examAttempts[`${sc.id}-${sq.id}`]?.attempted).length, 0);
            const scTotal = sc.questions.reduce((a, q) => a + q.subQuestions.length, 0);
            return (
              <TabsTrigger key={sc.id} value={sc.id} data-testid={`tab-scenario-${sc.id}`} className="text-xs">
                {sc.title}
                {scAttempted > 0 && (
                  <Badge variant="outline" className="ml-2 text-xs py-0 px-1.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    {scAttempted}/{scTotal}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {EXAM_SCENARIOS.map(sc => (
          <TabsContent key={sc.id} value={sc.id}>
            {/* Scenario header */}
            <Card className="border-border mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{sc.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{sc.year} · {sc.totalMarks} marks total</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-5">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Scenario</p>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-foreground">{sc.scenario}</p>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            {sc.questions.map(q => (
              <div key={q.id} className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-semibold text-sm">{q.number}</h3>
                  <Badge variant="outline" className="text-xs">{q.totalMarks} marks</Badge>
                </div>
                <ScrollArea className="space-y-3">
                  <div className="space-y-3">
                    {q.subQuestions.map(sq => (
                      <SubQuestionCard key={sq.id} sq={sq} scenarioId={sc.id} />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
