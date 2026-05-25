import { useState, useRef, useCallback, useEffect } from "react";
import { Plus, Trash2, Eye, EyeOff, RotateCcw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Attribute {
  id: string;
  visibility: "+" | "-" | "#";
  name: string;
  dataType: string;
}

interface Method {
  id: string;
  visibility: "+" | "-" | "#";
  name: string;
  params: string;
  returnType: string;
}

type ShapeType = "actor" | "usecase" | "activity" | "decision" | "start" | "end" | "note" | "swimlane-header";

interface BoardShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  label: string;
  width?: number;
  height?: number;
}

interface BoardArrow {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
  style: "solid" | "dashed";
}

const DATA_TYPES = ["String", "Integer", "Boolean", "Date", "Double", "Float", "Long", "char", "void"];
const VISIBILITIES = [
  { value: "+", label: "+ public" },
  { value: "-", label: "- private" },
  { value: "#", label: "# protected" },
];

const NANNY_EXAMPLE: { className: string; attributes: Attribute[]; methods: Method[] } = {
  className: "Nanny",
  attributes: [
    { id: "a1", visibility: "-", name: "name", dataType: "String" },
    { id: "a2", visibility: "-", name: "surname", dataType: "String" },
    { id: "a3", visibility: "-", name: "age", dataType: "Integer" },
    { id: "a4", visibility: "-", name: "qualifications", dataType: "String" },
    { id: "a5", visibility: "-", name: "availability", dataType: "Boolean" },
  ],
  methods: [
    { id: "m1", visibility: "+", name: "register", params: "", returnType: "void" },
    { id: "m2", visibility: "+", name: "getName", params: "", returnType: "String" },
    { id: "m3", visibility: "+", name: "getAvailability", params: "", returnType: "Boolean" },
    { id: "m4", visibility: "+", name: "setAvailability", params: "avail: Boolean", returnType: "void" },
    { id: "m5", visibility: "+", name: "getQualifications", params: "", returnType: "String" },
  ],
};

// ─── Class Diagram Builder ────────────────────────────────────────────────────
function ClassDiagramBuilder() {
  const [className, setClassName] = useState("MyClass");
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [methods, setMethods] = useState<Method[]>([]);
  const [showExample, setShowExample] = useState(false);

  const display = showExample ? NANNY_EXAMPLE : { className, attributes, methods };

  function addAttr() {
    setAttributes(prev => [...prev, { id: Math.random().toString(36).slice(2), visibility: "-", name: "attribute", dataType: "String" }]);
  }
  function removeAttr(id: string) { setAttributes(prev => prev.filter(a => a.id !== id)); }
  function updateAttr(id: string, field: keyof Attribute, value: string) {
    setAttributes(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  }
  function addMethod() {
    setMethods(prev => [...prev, { id: Math.random().toString(36).slice(2), visibility: "+", name: "method", params: "", returnType: "void" }]);
  }
  function removeMethod(id: string) { setMethods(prev => prev.filter(m => m.id !== id)); }
  function updateMethod(id: string, field: keyof Method, value: string) {
    setMethods(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  }

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="space-y-5 pr-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Class Name</label>
            <Input data-testid="input-class-name" value={className} onChange={e => setClassName(e.target.value)} className="font-semibold" placeholder="ClassName" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Attributes</label>
              <Button data-testid="btn-add-attribute" variant="outline" size="sm" onClick={addAttr} className="h-7 gap-1 text-xs"><Plus className="w-3 h-3" /> Add</Button>
            </div>
            <div className="space-y-2">
              {attributes.map(attr => (
                <div key={attr.id} className="flex items-center gap-2">
                  <Select value={attr.visibility} onValueChange={v => updateAttr(attr.id, "visibility", v)}>
                    <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{VISIBILITIES.map(v => <SelectItem key={v.value} value={v.value} className="text-xs">{v.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input data-testid={`attr-name-${attr.id}`} value={attr.name} onChange={e => updateAttr(attr.id, "name", e.target.value)} className="h-8 text-xs flex-1" placeholder="name" />
                  <Select value={attr.dataType} onValueChange={v => updateAttr(attr.id, "dataType", v)}>
                    <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{DATA_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeAttr(attr.id)}><Trash2 className="w-3.5 h-3.5 text-muted-foreground" /></Button>
                </div>
              ))}
              {attributes.length === 0 && <p className="text-xs text-muted-foreground italic">No attributes yet.</p>}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Methods</label>
              <Button data-testid="btn-add-method" variant="outline" size="sm" onClick={addMethod} className="h-7 gap-1 text-xs"><Plus className="w-3 h-3" /> Add</Button>
            </div>
            <div className="space-y-2">
              {methods.map(method => (
                <div key={method.id} className="grid grid-cols-[7rem_1fr_1fr_7rem_2rem] gap-1.5 items-center">
                  <Select value={method.visibility} onValueChange={v => updateMethod(method.id, "visibility", v)}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{VISIBILITIES.map(v => <SelectItem key={v.value} value={v.value} className="text-xs">{v.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input data-testid={`method-name-${method.id}`} value={method.name} onChange={e => updateMethod(method.id, "name", e.target.value)} className="h-8 text-xs" placeholder="methodName" />
                  <Input data-testid={`method-params-${method.id}`} value={method.params} onChange={e => updateMethod(method.id, "params", e.target.value)} className="h-8 text-xs" placeholder="param: Type" />
                  <Select value={method.returnType} onValueChange={v => updateMethod(method.id, "returnType", v)}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{DATA_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeMethod(method.id)}><Trash2 className="w-3.5 h-3.5 text-muted-foreground" /></Button>
                </div>
              ))}
              {methods.length === 0 && <p className="text-xs text-muted-foreground italic">No methods yet.</p>}
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Legend: <span className="text-foreground font-mono">+</span> public · <span className="text-foreground font-mono">-</span> private · <span className="text-foreground font-mono">#</span> protected</p>
          </div>
        </div>
      </ScrollArea>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Live Preview</h3>
          <Button data-testid="btn-toggle-example" variant="outline" size="sm" className="gap-1.5 text-xs h-7" onClick={() => setShowExample(v => !v)}>
            {showExample ? <><EyeOff className="w-3.5 h-3.5" /> Your Diagram</> : <><Eye className="w-3.5 h-3.5" /> Nanny Example</>}
          </Button>
        </div>
        {showExample && <Badge variant="outline" className="text-xs mb-3 bg-amber-500/10 text-amber-300 border-amber-500/30">Worked example — Nanny class</Badge>}

        {/* SVG class diagram */}
        <ClassDiagramSVG data={display} />

        <Card className="mt-4 border-border">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Notation reminder:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="text-foreground font-mono">- name: String</span> — private attribute</p>
              <p><span className="text-foreground font-mono">+ getName(): String</span> — public method</p>
              <p><span className="text-foreground font-mono">+ setAge(age: Integer): void</span> — method with param</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ClassDiagramSVG({ data }: { data: { className: string; attributes: Attribute[]; methods: Method[] } }) {
  const ROW_H = 22;
  const PAD = 14;
  const MIN_W = 220;

  const attrLines = data.attributes.map(a => `${a.visibility} ${a.name || "?"}: ${a.dataType}`);
  const methLines = data.methods.map(m => `${m.visibility} ${m.name || "?"}(${m.params}): ${m.returnType}`);

  const allLines = [data.className || "ClassName", ...attrLines, ...methLines];
  const charW = 7.5;
  const contentW = Math.max(MIN_W, ...allLines.map(l => l.length * charW + PAD * 2));

  const headerH = ROW_H + 10;
  const attrH = data.attributes.length > 0 ? data.attributes.length * ROW_H + 8 : ROW_H;
  const methH = data.methods.length > 0 ? data.methods.length * ROW_H + 8 : ROW_H;
  const totalH = headerH + attrH + methH;
  const W = contentW;

  let y = 0;
  const nameY = headerH / 2;
  y += headerH;
  const attrStartY = y;
  y += attrH;
  const methStartY = y;

  return (
    <svg
      width={W}
      height={totalH}
      viewBox={`0 0 ${W} ${totalH}`}
      className="rounded-lg overflow-hidden border border-border"
      style={{ background: "hsl(222 47% 11%)" }}
    >
      {/* Header */}
      <rect x={0} y={0} width={W} height={headerH} fill="hsl(221 83% 30% / 0.4)" />
      <text x={W / 2} y={nameY + 6} textAnchor="middle" fill="white" fontSize={13} fontWeight="bold" fontFamily="Inter, sans-serif">
        {data.className || "ClassName"}
      </text>

      {/* Attr section */}
      <rect x={0} y={attrStartY} width={W} height={attrH} fill="hsl(222 47% 13%)" />
      <line x1={0} y1={attrStartY} x2={W} y2={attrStartY} stroke="hsl(216 34% 22%)" strokeWidth={1} />
      {data.attributes.length === 0 ? (
        <text x={PAD} y={attrStartY + ROW_H * 0.65} fill="hsl(215 20% 50%)" fontSize={11} fontFamily="Inter, sans-serif" fontStyle="italic">— no attributes —</text>
      ) : (
        data.attributes.map((a, i) => (
          <text key={a.id} x={PAD} y={attrStartY + 8 + (i + 0.7) * ROW_H} fontSize={12} fontFamily="'Menlo', monospace" fill="white">
            <tspan fill="hsl(217 91% 70%)">{a.visibility}</tspan>
            <tspan fill="white"> {a.name || "?"}</tspan>
            <tspan fill="hsl(215 20% 65%)">: </tspan>
            <tspan fill="hsl(152 60% 62%)">{a.dataType}</tspan>
          </text>
        ))
      )}

      {/* Method section */}
      <rect x={0} y={methStartY} width={W} height={methH} fill="hsl(222 47% 11%)" />
      <line x1={0} y1={methStartY} x2={W} y2={methStartY} stroke="hsl(216 34% 22%)" strokeWidth={1} />
      {data.methods.length === 0 ? (
        <text x={PAD} y={methStartY + ROW_H * 0.65} fill="hsl(215 20% 50%)" fontSize={11} fontFamily="Inter, sans-serif" fontStyle="italic">— no methods —</text>
      ) : (
        data.methods.map((m, i) => (
          <text key={m.id} x={PAD} y={methStartY + 8 + (i + 0.7) * ROW_H} fontSize={12} fontFamily="'Menlo', monospace" fill="white">
            <tspan fill="hsl(217 91% 70%)">{m.visibility}</tspan>
            <tspan fill="hsl(43 96% 72%)"> {m.name || "?"}</tspan>
            <tspan fill="hsl(215 20% 65%)">({m.params}): </tspan>
            <tspan fill="hsl(152 60% 62%)">{m.returnType}</tspan>
          </text>
        ))
      )}

      {/* Border */}
      <rect x={0} y={0} width={W} height={totalH} fill="none" stroke="hsl(216 34% 22%)" strokeWidth={1} rx={4} />
    </svg>
  );
}

// ─── Use Case SVG Diagram ─────────────────────────────────────────────────────
function UseCaseDiagram() {
  const W = 720;
  const H = 480;
  const uc = [
    { id: "uc1", x: 280, y: 80, label: "Search Nanny" },
    { id: "uc2", x: 280, y: 155, label: "Make Booking" },
    { id: "uc3", x: 280, y: 230, label: "Track Booking" },
    { id: "uc4", x: 280, y: 305, label: "Update Profile" },
    { id: "uc5", x: 440, y: 155, label: "Authenticate User" },
    { id: "uc6", x: 440, y: 305, label: "Manage Availability" },
    { id: "uc7", x: 440, y: 380, label: "View Bookings" },
    { id: "uc8", x: 560, y: 80, label: "Generate Reports" },
  ];

  const actors = [
    { id: "a1", x: 60, y: 175, label: "Parent" },
    { id: "a2", x: 60, y: 340, label: "Nanny" },
    { id: "a3", x: 660, y: 80, label: "Manager" },
  ];

  const associations = [
    { from: "a1", to: "uc1" }, { from: "a1", to: "uc2" }, { from: "a1", to: "uc3" }, { from: "a1", to: "uc4" },
    { from: "a2", to: "uc6" }, { from: "a2", to: "uc7" },
    { from: "a3", to: "uc8" },
  ];

  const includes = [
    { from: "uc2", to: "uc5", label: "«include»" },
  ];

  function getUcPos(id: string) { return uc.find(u => u.id === id); }
  function getActorPos(id: string) { return actors.find(a => a.id === id); }

  function actorPath(ax: number, ay: number) {
    const headR = 9, bodyTop = ay + headR + 2;
    const legY = ay + 52;
    return (
      <g>
        <circle cx={ax} cy={ay} r={headR} fill="none" stroke="hsl(217 91% 70%)" strokeWidth={1.5} />
        <line x1={ax} y1={bodyTop} x2={ax} y2={ay + 36} stroke="hsl(217 91% 70%)" strokeWidth={1.5} />
        <line x1={ax - 13} y1={ay + 22} x2={ax + 13} y2={ay + 22} stroke="hsl(217 91% 70%)" strokeWidth={1.5} />
        <line x1={ax} y1={ay + 36} x2={ax - 11} y2={legY} stroke="hsl(217 91% 70%)" strokeWidth={1.5} />
        <line x1={ax} y1={ay + 36} x2={ax + 11} y2={legY} stroke="hsl(217 91% 70%)" strokeWidth={1.5} />
      </g>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Hire-a-Nanny — Use Case Diagram</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-border" style={{ background: "hsl(224 71% 4%)" }}>
        {/* System boundary */}
        <rect x={170} y={40} width={470} height={415} rx={6} fill="none" stroke="hsl(216 34% 25%)" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={185} y={32} fill="hsl(215 20% 55%)" fontSize={11} fontFamily="Inter, sans-serif">Hire-a-Nanny System</text>

        {/* Association lines */}
        {associations.map((assoc, i) => {
          const a = getActorPos(assoc.from) ?? getUcPos(assoc.from);
          const u = getUcPos(assoc.to);
          if (!a || !u) return null;
          const ax2 = (assoc.from.startsWith("a") && (a as typeof actors[0]).x < 200) ? (a as typeof actors[0]).x + 22 : (a as typeof actors[0]).x - 22;
          return (
            <line key={i} x1={ax2} y1={a.y} x2={u.x - 55} y2={u.y}
              stroke="hsl(215 20% 40%)" strokeWidth={1.2} />
          );
        })}

        {/* Manager line */}
        <line x1={actors[2].x - 22} y1={actors[2].y} x2={uc[7].x + 55} y2={uc[7].y} stroke="hsl(215 20% 40%)" strokeWidth={1.2} />

        {/* Include arrow */}
        {includes.map((inc, i) => {
          const from = getUcPos(inc.from)!;
          const to = getUcPos(inc.to)!;
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;
          return (
            <g key={i}>
              <line x1={from.x + 55} y1={from.y} x2={to.x - 55} y2={to.y}
                stroke="hsl(217 91% 60%)" strokeWidth={1.2} strokeDasharray="4 2"
                markerEnd="url(#arrowBlue)" />
              <text x={mx} y={my - 5} textAnchor="middle" fill="hsl(217 91% 60%)" fontSize={9} fontFamily="Inter, sans-serif">{inc.label}</text>
            </g>
          );
        })}

        {/* Use cases */}
        {uc.map(u => (
          <g key={u.id}>
            <ellipse cx={u.x} cy={u.y} rx={55} ry={22} fill="hsl(221 83% 20% / 0.5)" stroke="hsl(221 83% 53%)" strokeWidth={1.3} />
            <text x={u.x} y={u.y + 4} textAnchor="middle" fill="white" fontSize={11} fontFamily="Inter, sans-serif">{u.label}</text>
          </g>
        ))}

        {/* Actors */}
        {actors.map(a => (
          <g key={a.id}>
            {actorPath(a.x, a.y - 20)}
            <text x={a.x} y={a.y + 42} textAnchor="middle" fill="hsl(215 20% 75%)" fontSize={11} fontFamily="Inter, sans-serif">{a.label}</text>
          </g>
        ))}

        <defs>
          <marker id="arrowBlue" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="hsl(217 91% 60%)" />
          </marker>
        </defs>
      </svg>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { symbol: "oval", label: "Use Case — a system function (oval)" },
          { symbol: "stick", label: "Actor — a user role (stick figure)" },
          { symbol: "include", label: "«include» — always calls the sub-use case (dashed arrow)" },
        ].map((item, i) => (
          <Card key={i} className="border-border">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <svg width={32} height={20}>
                  {item.symbol === "oval" && <ellipse cx={16} cy={10} rx={14} ry={8} fill="none" stroke="hsl(221 83% 53%)" strokeWidth={1.5} />}
                  {item.symbol === "stick" && <>
                    <circle cx={16} cy={5} r={4} fill="none" stroke="hsl(217 91% 70%)" strokeWidth={1.2} />
                    <line x1={16} y1={9} x2={16} y2={16} stroke="hsl(217 91% 70%)" strokeWidth={1.2} />
                    <line x1={10} y1={12} x2={22} y2={12} stroke="hsl(217 91% 70%)" strokeWidth={1.2} />
                    <line x1={16} y1={16} x2={11} y2={20} stroke="hsl(217 91% 70%)" strokeWidth={1.2} />
                    <line x1={16} y1={16} x2={21} y2={20} stroke="hsl(217 91% 70%)" strokeWidth={1.2} />
                  </>}
                  {item.symbol === "include" && <>
                    <line x1={2} y1={10} x2={24} y2={10} stroke="hsl(217 91% 60%)" strokeWidth={1.2} strokeDasharray="3 2" />
                    <polygon points="22,7 30,10 22,13" fill="hsl(217 91% 60%)" />
                  </>}
                </svg>
                <span className="text-xs font-medium text-foreground">{item.symbol === "oval" ? "Use Case" : item.symbol === "stick" ? "Actor" : "«include»"}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-tight">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4 border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-3 pb-3">
          <p className="text-xs font-semibold text-amber-300 mb-1">Exam tip — «include» vs «extend»</p>
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">«include»</strong> = MANDATORY sub-flow. The base use case ALWAYS calls it (e.g., every booking requires authentication).
            <br />
            <strong className="text-foreground">«extend»</strong> = OPTIONAL addition. It only happens under certain conditions (e.g., cancel booking optionally extends view booking).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Activity SVG Diagram ─────────────────────────────────────────────────────
function ActivityDiagram() {
  const W = 720;
  const H = 580;
  const LANE_W = 220;
  const LANE_HEADER = 40;
  const lanes = ["Help Desk\nConsultant", "Technical\nConsultant", "Supervisor"];
  const laneX = (i: number) => 10 + i * LANE_W + LANE_W / 2;

  const nodes: Array<{ id: string; lane: number; y: number; type: "start" | "end" | "activity" | "decision" | "merge"; label?: string }> = [
    { id: "n0", lane: 0, y: 100, type: "start" },
    { id: "n1", lane: 0, y: 155, type: "activity", label: "Collect customer details" },
    { id: "n2", lane: 0, y: 215, type: "activity", label: "Register incident" },
    { id: "n3", lane: 1, y: 285, type: "activity", label: "Initial troubleshooting" },
    { id: "n4", lane: 1, y: 350, type: "decision", label: "Resolved?" },
    { id: "n5", lane: 1, y: 415, type: "activity", label: "Compile tech report" },
    { id: "n6", lane: 2, y: 440, type: "activity", label: "Confirm details" },
    { id: "n7", lane: 2, y: 510, type: "activity", label: "Approve report" },
    { id: "n8", lane: 2, y: 555, type: "end" },
  ];

  const arrows: Array<{ from: string; to: string; label?: string; bend?: number }> = [
    { from: "n0", to: "n1" },
    { from: "n1", to: "n2" },
    { from: "n2", to: "n3" },
    { from: "n3", to: "n4" },
    { from: "n4", to: "n5", label: "No" },
    { from: "n5", to: "n6" },
    { from: "n6", to: "n7" },
    { from: "n7", to: "n8" },
  ];

  function nodeX(n: typeof nodes[0]) { return laneX(n.lane); }
  function nodeY(n: typeof nodes[0]) { return n.y; }

  function getNode(id: string) { return nodes.find(n => n.id === id); }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Help Desk Workflow — Activity Diagram (with Swimlanes)</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-border" style={{ background: "hsl(224 71% 4%)" }}>
        <defs>
          <marker id="arrowGrey" markerWidth={7} markerHeight={6} refX={7} refY={3} orient="auto">
            <polygon points="0 0, 7 3, 0 6" fill="hsl(215 20% 55%)" />
          </marker>
          <marker id="arrowWhite" markerWidth={7} markerHeight={6} refX={7} refY={3} orient="auto">
            <polygon points="0 0, 7 3, 0 6" fill="hsl(215 20% 75%)" />
          </marker>
        </defs>

        {/* Swimlane columns */}
        {lanes.map((lane, i) => {
          const x = 10 + i * LANE_W;
          return (
            <g key={i}>
              <rect x={x} y={LANE_HEADER} width={LANE_W} height={H - LANE_HEADER - 10} fill={i % 2 === 0 ? "hsl(222 47% 7%)" : "hsl(222 47% 9%)"} />
              <rect x={x} y={0} width={LANE_W} height={LANE_HEADER} fill="hsl(221 83% 25% / 0.3)" />
              <line x1={x} y1={0} x2={x} y2={H - 10} stroke="hsl(216 34% 20%)" strokeWidth={1} />
              {lane.split("\n").map((part, j) => (
                <text key={j} x={x + LANE_W / 2} y={14 + j * 16} textAnchor="middle" fill="hsl(215 20% 70%)" fontSize={11} fontFamily="Inter, sans-serif" fontWeight="600">{part}</text>
              ))}
            </g>
          );
        })}
        <rect x={10} y={0} width={LANE_W * 3} height={H - 10} fill="none" stroke="hsl(216 34% 22%)" strokeWidth={1} rx={4} />

        {/* Arrows */}
        {arrows.map((arrow, i) => {
          const from = getNode(arrow.from);
          const to = getNode(arrow.to);
          if (!from || !to) return null;
          const fx = nodeX(from), fy = nodeY(from);
          const tx = nodeX(to), ty = nodeY(to);
          const crossLane = from.lane !== to.lane;

          let y1 = fy + (from.type === "activity" ? 18 : from.type === "decision" ? 14 : from.type === "start" ? 8 : 8);
          let y2 = ty - (to.type === "activity" ? 18 : to.type === "decision" ? 14 : to.type === "end" ? 12 : 8);

          if (crossLane) {
            const midY = (y1 + y2) / 2;
            return (
              <g key={i}>
                <polyline points={`${fx},${y1} ${fx},${midY} ${tx},${midY} ${tx},${y2}`}
                  fill="none" stroke="hsl(215 20% 50%)" strokeWidth={1.3} markerEnd="url(#arrowGrey)" />
                {arrow.label && <text x={(fx + tx) / 2} y={midY - 4} textAnchor="middle" fill="hsl(215 20% 60%)" fontSize={10} fontFamily="Inter, sans-serif">{arrow.label}</text>}
              </g>
            );
          }

          return (
            <g key={i}>
              <line x1={fx} y1={y1} x2={tx} y2={y2} stroke="hsl(215 20% 50%)" strokeWidth={1.3} markerEnd="url(#arrowGrey)" />
              {arrow.label && <text x={fx + 6} y={(y1 + y2) / 2} fill="hsl(152 60% 55%)" fontSize={10} fontFamily="Inter, sans-serif">{arrow.label}</text>}
            </g>
          );
        })}

        {/* Yes branch off decision back up */}
        <g>
          <polyline points={`${laneX(1) + 14},350 ${laneX(1) + 70},350 ${laneX(1) + 70},155 ${laneX(0) + 70},155 ${laneX(0) + 70},155`}
            fill="none" stroke="hsl(215 20% 40%)" strokeWidth={1.2} strokeDasharray="4 2" />
          <text x={laneX(1) + 73} y={255} fill="hsl(215 20% 55%)" fontSize={10} fontFamily="Inter, sans-serif">Yes</text>
          <text x={laneX(1) + 30} y={340} fill="hsl(215 20% 55%)" fontSize={9} fontFamily="Inter, sans-serif">(re-register)</text>
        </g>

        {/* Nodes */}
        {nodes.map(node => {
          const x = nodeX(node), y = nodeY(node);
          if (node.type === "start") return (
            <g key={node.id}>
              <circle cx={x} cy={y} r={8} fill="white" />
            </g>
          );
          if (node.type === "end") return (
            <g key={node.id}>
              <circle cx={x} cy={y} r={11} fill="none" stroke="white" strokeWidth={2} />
              <circle cx={x} cy={y} r={6} fill="white" />
            </g>
          );
          if (node.type === "activity") return (
            <g key={node.id}>
              <rect x={x - 78} y={y - 18} width={156} height={36} rx={18} fill="hsl(221 83% 25% / 0.6)" stroke="hsl(221 83% 53%)" strokeWidth={1.3} />
              <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize={11} fontFamily="Inter, sans-serif">{node.label}</text>
            </g>
          );
          if (node.type === "decision") return (
            <g key={node.id}>
              <polygon points={`${x},${y - 14} ${x + 48},${y} ${x},${y + 14} ${x - 48},${y}`} fill="hsl(43 96% 30% / 0.4)" stroke="hsl(43 96% 60%)" strokeWidth={1.3} />
              <text x={x} y={y + 4} textAnchor="middle" fill="hsl(43 96% 72%)" fontSize={10} fontFamily="Inter, sans-serif">{node.label}</text>
            </g>
          );
          return null;
        })}
      </svg>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        {[
          { type: "start", label: "Initial Node — start of flow" },
          { type: "activity", label: "Activity — a step/action (rounded rect)" },
          { type: "decision", label: "Decision — a branch point (diamond)" },
          { type: "end", label: "Final Node — end of flow (bull's-eye)" },
        ].map((item) => (
          <Card key={item.type} className="border-border">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <svg width={28} height={22}>
                  {item.type === "start" && <circle cx={12} cy={11} r={8} fill="white" />}
                  {item.type === "activity" && <rect x={2} y={5} width={24} height={12} rx={6} fill="none" stroke="hsl(221 83% 53%)" strokeWidth={1.5} />}
                  {item.type === "decision" && <polygon points="14,3 26,11 14,19 2,11" fill="none" stroke="hsl(43 96% 60%)" strokeWidth={1.5} />}
                  {item.type === "end" && <>
                    <circle cx={12} cy={11} r={9} fill="none" stroke="white" strokeWidth={2} />
                    <circle cx={12} cy={11} r={5} fill="white" />
                  </>}
                </svg>
                <span className="text-xs font-medium text-foreground capitalize">{item.type === "start" ? "Initial" : item.type === "end" ? "Final" : item.type}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-tight">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4 border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="pt-3 pb-3">
          <p className="text-xs font-semibold text-emerald-300 mb-1">Exam tip — Swimlanes</p>
          <p className="text-xs text-muted-foreground">
            Always use swimlanes when multiple roles are involved. Each actor/role gets their own lane. Activities go in the lane of whoever performs them. Arrows cross lanes when work is handed off between roles.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Drag-and-Drop Drawing Board ──────────────────────────────────────────────
const PALETTE: Array<{ type: ShapeType; label: string }> = [
  { type: "actor", label: "Actor" },
  { type: "usecase", label: "Use Case" },
  { type: "activity", label: "Activity" },
  { type: "decision", label: "Decision" },
  { type: "start", label: "Start Node" },
  { type: "end", label: "End Node" },
  { type: "note", label: "Note / Text" },
];

const SHAPE_DEFAULTS: Record<ShapeType, { width: number; height: number }> = {
  actor: { width: 40, height: 64 },
  usecase: { width: 120, height: 44 },
  activity: { width: 140, height: 40 },
  decision: { width: 90, height: 50 },
  start: { width: 20, height: 20 },
  end: { width: 24, height: 24 },
  note: { width: 120, height: 36 },
  "swimlane-header": { width: 140, height: 36 },
};

function ShapePreview({ type }: { type: ShapeType }) {
  return (
    <svg width={52} height={36} viewBox="0 0 52 36">
      {type === "actor" && <>
        <circle cx={26} cy={9} r={6} fill="none" stroke="hsl(217 91% 70%)" strokeWidth={1.5} />
        <line x1={26} y1={15} x2={26} y2={26} stroke="hsl(217 91% 70%)" strokeWidth={1.5} />
        <line x1={18} y1={20} x2={34} y2={20} stroke="hsl(217 91% 70%)" strokeWidth={1.5} />
        <line x1={26} y1={26} x2={20} y2={34} stroke="hsl(217 91% 70%)" strokeWidth={1.5} />
        <line x1={26} y1={26} x2={32} y2={34} stroke="hsl(217 91% 70%)" strokeWidth={1.5} />
      </>}
      {type === "usecase" && <ellipse cx={26} cy={18} rx={22} ry={12} fill="none" stroke="hsl(221 83% 53%)" strokeWidth={1.5} />}
      {type === "activity" && <rect x={4} y={10} width={44} height={16} rx={8} fill="none" stroke="hsl(221 83% 53%)" strokeWidth={1.5} />}
      {type === "decision" && <polygon points="26,4 48,18 26,32 4,18" fill="none" stroke="hsl(43 96% 60%)" strokeWidth={1.5} />}
      {type === "start" && <circle cx={26} cy={18} r={9} fill="white" />}
      {type === "end" && <>
        <circle cx={26} cy={18} r={11} fill="none" stroke="white" strokeWidth={2} />
        <circle cx={26} cy={18} r={6} fill="white" />
      </>}
      {type === "note" && <>
        <rect x={4} y={8} width={44} height={20} rx={3} fill="none" stroke="hsl(215 20% 55%)" strokeWidth={1.3} strokeDasharray="3 2" />
        <line x1={8} y1={14} x2={44} y2={14} stroke="hsl(215 20% 40%)" strokeWidth={1} />
        <line x1={8} y1={20} x2={36} y2={20} stroke="hsl(215 20% 40%)" strokeWidth={1} />
      </>}
    </svg>
  );
}

function BoardShapeRender({ shape, selected, onPointerDown }: {
  shape: BoardShape;
  selected: boolean;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
}) {
  const { type, x, y, label, width = 120, height = 40 } = shape;
  const strokeSel = selected ? "hsl(43 96% 60%)" : undefined;

  const inner = (() => {
    if (type === "actor") {
      const cx = x + width / 2, cy = y + 9;
      return (
        <g>
          <circle cx={cx} cy={cy} r={9} fill="none" stroke={strokeSel ?? "hsl(217 91% 70%)"} strokeWidth={1.8} />
          <line x1={cx} y1={cy + 9} x2={cx} y2={cy + 28} stroke={strokeSel ?? "hsl(217 91% 70%)"} strokeWidth={1.8} />
          <line x1={cx - 14} y1={cy + 18} x2={cx + 14} y2={cy + 18} stroke={strokeSel ?? "hsl(217 91% 70%)"} strokeWidth={1.8} />
          <line x1={cx} y1={cy + 28} x2={cx - 11} y2={cy + 42} stroke={strokeSel ?? "hsl(217 91% 70%)"} strokeWidth={1.8} />
          <line x1={cx} y1={cy + 28} x2={cx + 11} y2={cy + 42} stroke={strokeSel ?? "hsl(217 91% 70%)"} strokeWidth={1.8} />
          <text x={cx} y={cy + 58} textAnchor="middle" fill="hsl(215 20% 75%)" fontSize={11} fontFamily="Inter, sans-serif">{label}</text>
        </g>
      );
    }
    if (type === "usecase") return (
      <g>
        <ellipse cx={x + width / 2} cy={y + height / 2} rx={width / 2} ry={height / 2} fill="hsl(221 83% 20% / 0.5)" stroke={strokeSel ?? "hsl(221 83% 53%)"} strokeWidth={1.5} />
        <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" fill="white" fontSize={12} fontFamily="Inter, sans-serif">{label}</text>
      </g>
    );
    if (type === "activity") return (
      <g>
        <rect x={x} y={y} width={width} height={height} rx={height / 2} fill="hsl(221 83% 20% / 0.5)" stroke={strokeSel ?? "hsl(221 83% 53%)"} strokeWidth={1.5} />
        <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" fill="white" fontSize={12} fontFamily="Inter, sans-serif">{label}</text>
      </g>
    );
    if (type === "decision") return (
      <g>
        <polygon points={`${x + width / 2},${y} ${x + width},${y + height / 2} ${x + width / 2},${y + height} ${x},${y + height / 2}`}
          fill="hsl(43 96% 20% / 0.4)" stroke={strokeSel ?? "hsl(43 96% 60%)"} strokeWidth={1.5} />
        <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" fill="hsl(43 96% 72%)" fontSize={11} fontFamily="Inter, sans-serif">{label}</text>
      </g>
    );
    if (type === "start") return (
      <circle cx={x + width / 2} cy={y + height / 2} r={width / 2} fill={selected ? "hsl(43 96% 80%)" : "white"} />
    );
    if (type === "end") return (
      <g>
        <circle cx={x + width / 2} cy={y + height / 2} r={width / 2} fill="none" stroke={selected ? "hsl(43 96% 60%)" : "white"} strokeWidth={2} />
        <circle cx={x + width / 2} cy={y + height / 2} r={width / 2 - 5} fill={selected ? "hsl(43 96% 70%)" : "white"} />
      </g>
    );
    if (type === "note") return (
      <g>
        <rect x={x} y={y} width={width} height={height} rx={4} fill="hsl(215 20% 12%)" stroke={strokeSel ?? "hsl(215 20% 40%)"} strokeWidth={1.3} strokeDasharray="4 2" />
        <text x={x + 8} y={y + height / 2 + 4} fill="hsl(215 20% 75%)" fontSize={11} fontFamily="Inter, sans-serif">{label}</text>
      </g>
    );
    return null;
  })();

  return (
    <g
      style={{ cursor: "move", userSelect: "none" }}
      onPointerDown={e => onPointerDown(e, shape.id)}
    >
      {/* Invisible hit area */}
      <rect x={x - 4} y={y - 4} width={(width ?? 40) + 8} height={(height ?? 40) + 8} fill="transparent" />
      {inner}
      {selected && (
        <rect x={x - 5} y={y - 5} width={(width ?? 40) + 10} height={(height ?? 40) + 10}
          fill="none" stroke="hsl(43 96% 60%)" strokeWidth={1} strokeDasharray="4 2" rx={4} />
      )}
    </g>
  );
}

function DrawingBoard() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [shapes, setShapes] = useState<BoardShape[]>([]);
  const [arrows, setArrows] = useState<BoardArrow[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; ox: number; oy: number } | null>(null);
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [arrowStyle, setArrowStyle] = useState<"solid" | "dashed">("solid");
  const [editLabel, setEditLabel] = useState<string | null>(null);
  const [labelInput, setLabelInput] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const getSVGPoint = useCallback((e: React.PointerEvent | PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  function handlePaletteDragStart(e: React.DragEvent, type: ShapeType) {
    e.dataTransfer.setData("shapeType", type);
  }

  function handleBoardDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const type = e.dataTransfer.getData("shapeType") as ShapeType;
    if (!type) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left - SHAPE_DEFAULTS[type].width / 2;
    const y = e.clientY - rect.top - SHAPE_DEFAULTS[type].height / 2;
    const defaults: Record<ShapeType, string> = {
      actor: "Actor", usecase: "Use Case", activity: "Activity",
      decision: "Yes/No?", start: "", end: "", note: "Note",
      "swimlane-header": "Lane",
    };
    const newShape: BoardShape = {
      id: Math.random().toString(36).slice(2),
      type,
      x: Math.max(0, x),
      y: Math.max(0, y),
      label: defaults[type],
      ...SHAPE_DEFAULTS[type],
    };
    setShapes(prev => [...prev, newShape]);
    setSelected(newShape.id);
  }

  function handlePointerDown(e: React.PointerEvent, id: string) {
    e.stopPropagation();
    if (connectMode) {
      if (!connectFrom) {
        setConnectFrom(id);
        setSelected(id);
      } else if (connectFrom !== id) {
        setArrows(prev => [...prev, {
          id: Math.random().toString(36).slice(2),
          fromId: connectFrom,
          toId: id,
          style: arrowStyle,
          label: "",
        }]);
        setConnectFrom(null);
        setSelected(null);
      }
      return;
    }
    setSelected(id);
    const shape = shapes.find(s => s.id === id);
    if (!shape) return;
    const pt = getSVGPoint(e);
    setDragging({ id, ox: pt.x - shape.x, oy: pt.y - shape.y });
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const pt = getSVGPoint(e);
    setShapes(prev => prev.map(s =>
      s.id === dragging.id ? { ...s, x: pt.x - dragging.ox, y: pt.y - dragging.oy } : s
    ));
  }

  function handlePointerUp() { setDragging(null); }

  function handleBoardClick(e: React.MouseEvent) {
    if ((e.target as Element).tagName === "svg") {
      setSelected(null);
      if (connectMode) setConnectFrom(null);
    }
  }

  function deleteSelected() {
    if (!selected) return;
    setShapes(prev => prev.filter(s => s.id !== selected));
    setArrows(prev => prev.filter(a => a.fromId !== selected && a.toId !== selected));
    setSelected(null);
  }

  function startEditLabel(id: string) {
    const shape = shapes.find(s => s.id === id);
    if (!shape) return;
    setEditLabel(id);
    setLabelInput(shape.label);
  }

  function commitLabel() {
    if (!editLabel) return;
    setShapes(prev => prev.map(s => s.id === editLabel ? { ...s, label: labelInput } : s));
    setEditLabel(null);
  }

  function clearBoard() {
    setShapes([]);
    setArrows([]);
    setSelected(null);
    setConnectFrom(null);
  }

  const selectedShape = shapes.find(s => s.id === selected);

  function getShapeCenter(id: string) {
    const s = shapes.find(sh => sh.id === id);
    if (!s) return { x: 0, y: 0 };
    return { x: s.x + (s.width ?? 40) / 2, y: s.y + (s.height ?? 40) / 2 };
  }

  return (
    <div className="flex gap-4 h-[600px]">
      {/* Palette */}
      <div className="w-32 shrink-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Shapes</p>
        <p className="text-xs text-muted-foreground mb-3 leading-tight">Drag onto the board →</p>
        <div className="space-y-2">
          {PALETTE.map(({ type, label }) => (
            <div
              key={type}
              draggable
              onDragStart={e => handlePaletteDragStart(e, type)}
              className="flex flex-col items-center gap-1 border border-border rounded-lg p-2 cursor-grab active:cursor-grabbing hover:border-primary/50 hover:bg-primary/5 transition-colors select-none"
            >
              <ShapePreview type={type} />
              <span className="text-xs text-muted-foreground text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Board area */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant={connectMode ? "default" : "outline"}
            className="h-7 text-xs gap-1.5"
            onClick={() => { setConnectMode(v => !v); setConnectFrom(null); }}
          >
            {connectMode ? `${connectFrom ? "Click target…" : "Click source shape"}` : "Connect"}
          </Button>
          {connectMode && (
            <Select value={arrowStyle} onValueChange={v => setArrowStyle(v as "solid" | "dashed")}>
              <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="solid" className="text-xs">Solid line</SelectItem>
                <SelectItem value="dashed" className="text-xs">Dashed (include)</SelectItem>
              </SelectContent>
            </Select>
          )}
          {selectedShape && !connectMode && (
            <>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => startEditLabel(selectedShape.id)}>
                Edit Label
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={deleteSelected}>
                <Trash2 className="w-3 h-3" /> Delete
              </Button>
            </>
          )}
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 ml-auto" onClick={clearBoard}>
            <RotateCcw className="w-3 h-3" /> Clear
          </Button>
        </div>

        {editLabel && (
          <div className="flex gap-2 items-center">
            <Input
              autoFocus
              value={labelInput}
              onChange={e => setLabelInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") commitLabel(); if (e.key === "Escape") setEditLabel(null); }}
              className="h-7 text-xs flex-1 max-w-xs"
              placeholder="Enter label..."
            />
            <Button size="sm" className="h-7 text-xs" onClick={commitLabel}>OK</Button>
          </div>
        )}

        {/* SVG Board */}
        <div
          className={cn(
            "flex-1 border rounded-xl overflow-hidden transition-colors relative",
            dragOver ? "border-primary bg-primary/5" : "border-border",
            connectMode ? "cursor-crosshair" : ""
          )}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleBoardDrop}
        >
          {shapes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-sm">Drag shapes from the palette onto the board</p>
              <p className="text-muted-foreground text-xs mt-1">Then use Connect to draw arrows between them</p>
            </div>
          )}

          <svg
            ref={svgRef}
            className="w-full h-full"
            style={{ background: "hsl(224 71% 4%)" }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={handleBoardClick}
            onDoubleClick={e => {
              if (selected) startEditLabel(selected);
            }}
          >
            <defs>
              <marker id="boardArrow" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="hsl(215 20% 65%)" />
              </marker>
              <marker id="boardArrowDash" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="hsl(217 91% 60%)" />
              </marker>
            </defs>

            {/* Grid dots */}
            <defs>
              <pattern id="grid" x={0} y={0} width={24} height={24} patternUnits="userSpaceOnUse">
                <circle cx={1} cy={1} r={0.8} fill="hsl(216 34% 18%)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Arrows */}
            {arrows.map(arrow => {
              const from = getShapeCenter(arrow.fromId);
              const to = getShapeCenter(arrow.toId);
              const isDash = arrow.style === "dashed";
              return (
                <g key={arrow.id}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isDash ? "hsl(217 91% 60%)" : "hsl(215 20% 65%)"}
                    strokeWidth={1.5}
                    strokeDasharray={isDash ? "5 3" : undefined}
                    markerEnd={isDash ? "url(#boardArrowDash)" : "url(#boardArrow)"}
                  />
                  {isDash && (
                    <text x={(from.x + to.x) / 2 + 4} y={(from.y + to.y) / 2 - 5} fill="hsl(217 91% 60%)" fontSize={10} fontFamily="Inter, sans-serif">«include»</text>
                  )}
                </g>
              );
            })}

            {/* Shapes */}
            {shapes.map(shape => (
              <BoardShapeRender
                key={shape.id}
                shape={shape}
                selected={selected === shape.id}
                onPointerDown={handlePointerDown}
              />
            ))}

            {/* Connect mode highlight */}
            {connectFrom && shapes.map(s => s.id !== connectFrom ? (
              <rect key={s.id}
                x={s.x - 6} y={s.y - 6}
                width={(s.width ?? 40) + 12} height={(s.height ?? 40) + 12}
                fill="none" stroke="hsl(152 60% 50%)" strokeWidth={1.5}
                strokeDasharray="4 2" rx={4}
                style={{ pointerEvents: "none" }}
              />
            ) : null)}
          </svg>
        </div>

        <p className="text-xs text-muted-foreground">
          Drag to move shapes · Click Connect to draw arrows · Double-click to edit label · Delete to remove selected
        </p>
      </div>
    </div>
  );
}

// ─── Main Diagrams Page ───────────────────────────────────────────────────────
export default function Diagrams() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Diagram Builder &amp; Reference</h1>
        <p className="text-muted-foreground text-sm mt-1">Build class diagrams · Study reference diagrams · Practice on the drawing board</p>
      </div>

      <Tabs defaultValue="board">
        <TabsList className="mb-6">
          <TabsTrigger value="board" data-testid="tab-board">Drawing Board</TabsTrigger>
          <TabsTrigger value="class" data-testid="tab-class-diagram">UML Class Builder</TabsTrigger>
          <TabsTrigger value="usecase" data-testid="tab-usecase-diagram">Use Case Reference</TabsTrigger>
          <TabsTrigger value="activity" data-testid="tab-activity-diagram">Activity Reference</TabsTrigger>
        </TabsList>

        <TabsContent value="board">
          <DrawingBoard />
        </TabsContent>

        <TabsContent value="class">
          <ClassDiagramBuilder />
        </TabsContent>

        <TabsContent value="usecase">
          <UseCaseDiagram />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityDiagram />
        </TabsContent>
      </Tabs>
    </div>
  );
}
