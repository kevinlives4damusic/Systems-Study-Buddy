import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DiagramSlotDef {
  id: string;
  correctLabel: string;
  hint?: string;
}

export interface DiagramLabelData {
  diagramType?: "class" | "usecase";
  diagramClassName?: string;
  diagramFixed?: { attributes?: string[]; methods?: string[] };
  diagramSlots?: DiagramSlotDef[];
  allLabels?: string[];
  diagramActors?: Array<{ id: string; x: number; y: number; name?: string; slotId?: string }>;
  diagramUseCases?: Array<{ id: string; x: number; y: number; name?: string; slotId?: string }>;
  diagramConnections?: Array<[string, string]>;
  diagramSystemLabel?: string;
}

export function StickFigure({ color = "#1e3a6e" }: { color?: string }) {
  return (
    <svg width={30} height={52} viewBox="0 0 30 52">
      <circle cx={15} cy={9} r={8} fill="none" stroke={color} strokeWidth={1.8} />
      <line x1={15} y1={17} x2={15} y2={34} stroke={color} strokeWidth={1.8} />
      <line x1={3} y1={23} x2={27} y2={23} stroke={color} strokeWidth={1.8} />
      <line x1={15} y1={34} x2={5} y2={48} stroke={color} strokeWidth={1.8} />
      <line x1={15} y1={34} x2={25} y2={48} stroke={color} strokeWidth={1.8} />
    </svg>
  );
}

export function SlotBox({
  slot, assignment, submitted, overSlot, onDragOver, onDragLeave, onDrop, onDragStart,
  compact, selectedLabel, onTap
}: {
  slot: DiagramSlotDef; assignment?: string; submitted: boolean;
  overSlot: string | null;
  onDragOver: (id: string) => void; onDragLeave: () => void;
  onDrop: (slotId: string, label: string, fromSlot: string) => void;
  onDragStart: (e: React.DragEvent, label: string, fromSlot: string) => void;
  compact?: boolean;
  selectedLabel?: string | null;
  onTap?: (slotId: string) => void;
}) {
  const isOver = overSlot === slot.id && !submitted;
  const isCorrect = submitted && assignment === slot.correctLabel;
  const isWrong = submitted && assignment !== undefined && assignment !== slot.correctLabel;
  const isEmpty = assignment === undefined;
  const readyToReceive = !submitted && selectedLabel !== null && isEmpty;
  const isSelectedFromHere = !submitted && selectedLabel !== null && assignment === selectedLabel;

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
      onClick={() => onTap?.(slot.id)}
      className={cn(
        "border-2 border-dashed rounded px-2 py-0.5 text-xs transition-all inline-flex items-center font-mono",
        compact ? "h-7 min-w-[7rem]" : "h-8 min-w-[12rem]",
        onTap ? "cursor-pointer" : "",
        submitted
          ? isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-700"
          : isWrong ? "border-red-400 bg-red-50 text-red-700"
          : isEmpty ? "border-slate-300 bg-slate-50 text-slate-400"
          : "border-amber-300 bg-amber-50 text-amber-700"
          : isSelectedFromHere ? "border-primary ring-2 ring-primary bg-primary/10"
          : readyToReceive ? "border-primary bg-primary/10 animate-pulse"
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
        <span className={cn("italic text-[10px]", readyToReceive ? "text-primary font-medium" : "text-muted-foreground/40")}>
          {readyToReceive ? "tap to place" : (slot.hint ?? "drop here")}
        </span>
      )}
    </div>
  );
}

export function DiagramLabelInteractive({
  data, onComplete
}: {
  data: DiagramLabelData;
  onComplete?: (score: number, total: number) => void;
}) {
  const slots = data.diagramSlots ?? [];
  const [shuffledLabels] = useState(() => [...(data.allLabels ?? [])].sort(() => Math.random() - 0.5));
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [overSlot, setOverSlot] = useState<string | null>(null);
  const [overPool, setOverPool] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedFromSlot, setSelectedFromSlot] = useState<string | null>(null);

  const usedLabels = new Set(Object.values(assignments));
  const poolLabels = shuffledLabels.filter(l => !usedLabels.has(l));
  const allPlaced = slots.every(s => assignments[s.id] !== undefined);
  const placedCount = slots.filter(s => assignments[s.id] !== undefined).length;

  function handleLabelDragStart(e: React.DragEvent, label: string, fromSlot: string) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("label", label);
    e.dataTransfer.setData("fromSlot", fromSlot);
    setSelectedLabel(null); setSelectedFromSlot(null);
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
    if (fromSlot) setAssignments(prev => { const n = { ...prev }; delete n[fromSlot]; return n; });
    setOverPool(false);
  }

  // Tap handlers
  function handlePoolLabelTap(label: string) {
    if (submitted) return;
    if (selectedLabel === label && !selectedFromSlot) { setSelectedLabel(null); }
    else { setSelectedLabel(label); setSelectedFromSlot(null); }
  }
  function handleSlotTap(slotId: string) {
    if (submitted) return;
    const currentAssignment = assignments[slotId];
    if (selectedLabel !== null) {
      handleSlotDrop(slotId, selectedLabel, selectedFromSlot ?? "");
      setSelectedLabel(null); setSelectedFromSlot(null);
    } else if (currentAssignment) {
      setSelectedLabel(currentAssignment);
      setSelectedFromSlot(slotId);
      setAssignments(prev => { const n = { ...prev }; delete n[slotId]; return n; });
    }
  }

  function handleSubmit() {
    setSubmitted(true);
    const correct = slots.filter(s => assignments[s.id] === s.correctLabel).length;
    onComplete?.(correct, slots.length);
  }

  const slotProps = {
    submitted, overSlot,
    onDragOver: setOverSlot, onDragLeave: () => setOverSlot(null),
    onDrop: handleSlotDrop, onDragStart: handleLabelDragStart,
    selectedLabel, onTap: handleSlotTap
  };

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-5 flex items-center gap-1.5">
        <span className="hidden md:inline">Drag labels to slots, or</span>
        Tap a label to select it, then tap a slot in the diagram
      </p>

      {selectedLabel && !submitted && (
        <div className="mb-4 px-3 py-2 rounded-xl border-2 border-primary bg-primary/5 flex items-center justify-between">
          <p className="text-xs text-primary font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono">{selectedLabel}</span> — tap a slot to place it
          </p>
          <button onClick={() => { setSelectedLabel(null); setSelectedFromSlot(null); }}
            className="text-xs text-muted-foreground hover:text-foreground ml-2 p-1">✕</button>
        </div>
      )}

      {data.diagramType === "class" && (
        <ClassDiagramView data={data} assignments={assignments} slotProps={slotProps} />
      )}
      {data.diagramType === "usecase" && (
        <UseCaseDiagramView data={data} assignments={assignments} slotProps={slotProps} />
      )}

      {!submitted && (
        <>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Label pool:</p>
          <div
            onDragOver={e => { e.preventDefault(); setOverPool(true); }}
            onDragLeave={() => setOverPool(false)}
            onDrop={handlePoolDrop}
            className={cn("min-h-12 border-2 border-dashed rounded-xl p-3 mb-5 flex flex-wrap gap-2 transition-colors",
              overPool ? "border-primary bg-primary/5" : "border-border bg-slate-50")}
          >
            {poolLabels.length === 0
              ? <p className="text-xs text-muted-foreground italic">All labels placed — tap a placed label to move it</p>
              : poolLabels.map(label => (
                <div key={label}
                  draggable
                  onDragStart={e => handleLabelDragStart(e, label, "")}
                  onClick={() => handlePoolLabelTap(label)}
                  className={cn(
                    "px-2.5 py-2 rounded-lg border text-xs font-mono select-none transition-all min-h-[36px] flex items-center",
                    selectedLabel === label && !selectedFromSlot
                      ? "border-primary bg-primary/10 ring-2 ring-primary scale-105 cursor-pointer"
                      : "border-border bg-white hover:border-primary/60 cursor-grab shadow-sm active:cursor-grabbing"
                  )}>
                  {label}
                </div>
              ))}
          </div>
        </>
      )}

      {submitted && (
        <Card className="border-border bg-slate-50 mb-4">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Results: {slots.filter(s => assignments[s.id] === s.correctLabel).length}/{slots.length} correct
            </p>
            {slots.map(s => (
              <div key={s.id} className="flex items-center gap-2 text-xs mb-1.5">
                {assignments[s.id] === s.correctLabel
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                <span className="text-muted-foreground shrink-0">{s.hint ?? s.id}:</span>
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
        <Button size="sm" onClick={handleSubmit} disabled={!allPlaced} className="gap-1.5 h-10 md:h-8">
          Check Diagram ({placedCount}/{slots.length} placed)
        </Button>
      )}
    </div>
  );
}

function ClassDiagramView({ data, assignments, slotProps }: {
  data: DiagramLabelData;
  assignments: Record<string, string>;
  slotProps: {
    submitted: boolean; overSlot: string | null;
    onDragOver: (id: string) => void; onDragLeave: () => void;
    onDrop: (slotId: string, label: string, fromSlot: string) => void;
    onDragStart: (e: React.DragEvent, label: string, fromSlot: string) => void;
    selectedLabel?: string | null;
    onTap?: (slotId: string) => void;
  };
}) {
  const slots = data.diagramSlots ?? [];
  const fixedAttrs = data.diagramFixed?.attributes ?? [];
  const fixedMethods = data.diagramFixed?.methods ?? [];
  const attrSlots = slots.filter(s => s.id.startsWith("attr"));
  const methodSlots = slots.filter(s => s.id.startsWith("method"));

  return (
    <div className="flex gap-6 flex-wrap items-start mb-6">
      <div className="border-2 border-slate-700 rounded font-mono text-xs shadow-md bg-white" style={{ minWidth: 280 }}>
        <div className="border-b-2 border-slate-700 px-4 py-2.5 text-center font-bold text-sm bg-blue-50 text-slate-800">
          {data.diagramClassName ?? "ClassName"}
        </div>
        <div className="border-b-2 border-slate-700 px-3 py-2.5 space-y-2 min-h-14">
          {fixedAttrs.map(a => (
            <div key={a} className="flex items-center gap-1 text-xs">
              <span className="text-blue-700 font-bold w-3 shrink-0">{a[0]}</span>
              <span className="text-slate-700">{a.slice(1)}</span>
            </div>
          ))}
          {attrSlots.map(s => (
            <SlotBox key={s.id} slot={s} assignment={assignments[s.id]} {...slotProps} />
          ))}
        </div>
        <div className="px-3 py-2.5 space-y-2 min-h-14">
          {fixedMethods.map(m => (
            <div key={m} className="flex items-center gap-1 text-xs">
              <span className="text-amber-700 font-bold w-3 shrink-0">{m[0]}</span>
              <span className="text-slate-700">{m.slice(1)}</span>
            </div>
          ))}
          {methodSlots.map(s => (
            <SlotBox key={s.id} slot={s} assignment={assignments[s.id]} {...slotProps} />
          ))}
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground space-y-1.5 self-start pt-1">
        <p className="font-semibold text-xs text-foreground mb-2">UML Notation</p>
        <div className="flex items-center gap-1.5"><span className="text-blue-700 font-bold font-mono w-4">-</span>private</div>
        <div className="flex items-center gap-1.5"><span className="text-amber-700 font-bold font-mono w-4">+</span>public</div>
        <div className="flex items-center gap-1.5"><span className="font-mono w-4">#</span>protected</div>
        <div className="mt-2 pt-2 border-t border-border space-y-1">
          <div><span className="text-emerald-700 font-mono">String</span> = text</div>
          <div><span className="text-emerald-700 font-mono">Integer</span> = whole #</div>
          <div><span className="text-emerald-700 font-mono">Boolean</span> = true/false</div>
          <div><span className="text-emerald-700 font-mono">void</span> = no return</div>
          <div><span className="text-emerald-700 font-mono">Date</span> = date value</div>
        </div>
      </div>
    </div>
  );
}

function UseCaseDiagramView({ data, assignments, slotProps }: {
  data: DiagramLabelData;
  assignments: Record<string, string>;
  slotProps: {
    submitted: boolean; overSlot: string | null;
    onDragOver: (id: string) => void; onDragLeave: () => void;
    onDrop: (slotId: string, label: string, fromSlot: string) => void;
    onDragStart: (e: React.DragEvent, label: string, fromSlot: string) => void;
    selectedLabel?: string | null;
    onTap?: (slotId: string) => void;
  };
}) {
  const actors = data.diagramActors ?? [];
  const useCases = data.diagramUseCases ?? [];
  const connections = data.diagramConnections ?? [];
  const slots = data.diagramSlots ?? [];
  const W = 580, H = 340;

  function getCenter(id: string) {
    const a = actors.find(a => a.id === id);
    if (a) return { x: a.x, y: a.y };
    const u = useCases.find(u => u.id === id);
    if (u) return { x: u.x, y: u.y };
    return null;
  }
  function lineEndpoints(fromId: string, toId: string) {
    const from = getCenter(fromId); const to = getCenter(toId);
    if (!from || !to) return null;
    const dx = to.x - from.x, dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len, uy = dy / len;
    const isFA = actors.some(a => a.id === fromId), isTA = actors.some(a => a.id === toId);
    return {
      x1: from.x + ux * (isFA ? 20 : 64), y1: from.y + uy * (isFA ? 20 : 15),
      x2: to.x - ux * (isTA ? 20 : 64), y2: to.y - uy * (isTA ? 20 : 15),
      isUcUc: !isFA && !isTA
    };
  }

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="relative bg-white border border-border rounded-xl shadow-sm" style={{ width: W, height: H }}>
        <svg className="absolute inset-0 pointer-events-none" width={W} height={H}>
          <defs>
            <marker id="ucArrowShared" markerWidth={7} markerHeight={5} refX={7} refY={2.5} orient="auto">
              <polygon points="0 0, 7 2.5, 0 5" fill="#2563eb" />
            </marker>
          </defs>
          <rect x={85} y={8} width={W - 100} height={H - 16} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="6 3" />
          <text x={90} y={24} fill="#94a3b8" fontSize={10} fontFamily="Inter,sans-serif" fontWeight="600">{data.diagramSystemLabel}</text>
          {connections.map(([fId, tId], i) => {
            const ep = lineEndpoints(fId, tId);
            if (!ep) return null;
            return (
              <g key={i}>
                {ep.isUcUc ? (
                  <>
                    <line x1={ep.x1} y1={ep.y1} x2={ep.x2} y2={ep.y2} stroke="#2563eb" strokeWidth={1.3} strokeDasharray="4 2" markerEnd="url(#ucArrowShared)" />
                    <text x={(ep.x1 + ep.x2) / 2} y={(ep.y1 + ep.y2) / 2 - 4} textAnchor="middle" fill="#2563eb" fontSize={9} fontFamily="Inter,sans-serif">«include»</text>
                  </>
                ) : <line x1={ep.x1} y1={ep.y1} x2={ep.x2} y2={ep.y2} stroke="#94a3b8" strokeWidth={1.2} />}
              </g>
            );
          })}
        </svg>
        {actors.map(actor => {
          const slot = actor.slotId ? slots.find(s => s.id === actor.slotId) : null;
          return (
            <div key={actor.id} className="absolute flex flex-col items-center gap-0.5" style={{ left: actor.x - 30, top: actor.y - 40, width: 60 }}>
              <StickFigure color="#1e3a6e" />
              {actor.name && <span className="text-[10px] font-semibold text-slate-700 text-center whitespace-nowrap">{actor.name}</span>}
              {slot && <SlotBox slot={slot} assignment={assignments[slot.id]} {...slotProps} compact />}
            </div>
          );
        })}
        {useCases.map(uc => {
          const slot = uc.slotId ? slots.find(s => s.id === uc.slotId) : null;
          return (
            <div key={uc.id}
              className={cn("absolute flex items-center justify-center rounded-full border-2 text-[11px] font-medium text-slate-700 px-2 text-center",
                slot ? "border-dashed border-slate-400 bg-slate-50/80" : "border-blue-500 bg-blue-50")}
              style={{ left: uc.x - 64, top: uc.y - 16, width: 128, height: 32 }}>
              {uc.name && <span>{uc.name}</span>}
              {slot && <SlotBox slot={slot} assignment={assignments[slot.id]} {...slotProps} compact />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
