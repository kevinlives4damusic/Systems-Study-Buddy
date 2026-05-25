import { useState, useRef, useCallback, useEffect } from "react";
import { Plus, Trash2, Eye, EyeOff, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Attribute { id: string; visibility: "+" | "-" | "#"; name: string; dataType: string; }
interface Method { id: string; visibility: "+" | "-" | "#"; name: string; params: string; returnType: string; }
type ShapeType = "actor" | "usecase" | "activity" | "decision" | "start" | "end" | "note";
interface BoardShape { id: string; type: ShapeType; x: number; y: number; label: string; width: number; height: number; }
interface BoardArrow { id: string; fromId: string; toId: string; style: "solid" | "dashed"; }
interface BoardState { shapes: BoardShape[]; arrows: BoardArrow[]; }

const DATA_TYPES = ["String", "Integer", "Boolean", "Date", "Double", "Float", "Long", "char", "void"];
const VISIBILITIES = [{ value: "+", label: "+ public" }, { value: "-", label: "- private" }, { value: "#", label: "# protected" }];
const NANNY = {
  className: "Nanny",
  attributes: [
    { id: "a1", visibility: "-" as const, name: "name", dataType: "String" },
    { id: "a2", visibility: "-" as const, name: "surname", dataType: "String" },
    { id: "a3", visibility: "-" as const, name: "age", dataType: "Integer" },
    { id: "a4", visibility: "-" as const, name: "qualifications", dataType: "String" },
    { id: "a5", visibility: "-" as const, name: "availability", dataType: "Boolean" },
  ],
  methods: [
    { id: "m1", visibility: "+" as const, name: "register", params: "", returnType: "void" },
    { id: "m2", visibility: "+" as const, name: "getName", params: "", returnType: "String" },
    { id: "m3", visibility: "+" as const, name: "getAvailability", params: "", returnType: "Boolean" },
    { id: "m4", visibility: "+" as const, name: "setAvailability", params: "avail: Boolean", returnType: "void" },
    { id: "m5", visibility: "+" as const, name: "getQualifications", params: "", returnType: "String" },
  ],
};

const SHAPE_DEFAULTS: Record<ShapeType, { width: number; height: number }> = {
  actor: { width: 44, height: 68 }, usecase: { width: 130, height: 46 },
  activity: { width: 150, height: 42 }, decision: { width: 96, height: 54 },
  start: { width: 20, height: 20 }, end: { width: 26, height: 26 }, note: { width: 130, height: 38 },
};

// ─── Class Diagram Builder ────────────────────────────────────────────────────
function ClassDiagramBuilder() {
  const [className, setClassName] = useState("MyClass");
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [methods, setMethods] = useState<Method[]>([]);
  const [showExample, setShowExample] = useState(false);
  const data = showExample ? NANNY : { className, attributes, methods };

  const addAttr = () => setAttributes(p => [...p, { id: Math.random().toString(36).slice(2), visibility: "-", name: "attribute", dataType: "String" }]);
  const removeAttr = (id: string) => setAttributes(p => p.filter(a => a.id !== id));
  const updateAttr = (id: string, f: keyof Attribute, v: string) => setAttributes(p => p.map(a => a.id === id ? { ...a, [f]: v } : a));
  const addMethod = () => setMethods(p => [...p, { id: Math.random().toString(36).slice(2), visibility: "+", name: "method", params: "", returnType: "void" }]);
  const removeMethod = (id: string) => setMethods(p => p.filter(m => m.id !== id));
  const updateMethod = (id: string, f: keyof Method, v: string) => setMethods(p => p.map(m => m.id === id ? { ...m, [f]: v } : m));

  const ROW_H = 22, PAD = 14, MIN_W = 230;
  const attrLines = data.attributes.map(a => `${a.visibility} ${a.name}: ${a.dataType}`);
  const methLines = data.methods.map(m => `${m.visibility} ${m.name}(${m.params}): ${m.returnType}`);
  const W = Math.max(MIN_W, ...[data.className, ...attrLines, ...methLines].map(l => l.length * 7.4 + PAD * 2));
  const headerH = ROW_H + 12, attrH = data.attributes.length > 0 ? data.attributes.length * ROW_H + 10 : ROW_H + 4, methH = data.methods.length > 0 ? data.methods.length * ROW_H + 10 : ROW_H + 4;
  const totalH = headerH + attrH + methH;

  return (
    <div className="grid grid-cols-2 gap-6">
      <ScrollArea className="h-[calc(100vh-230px)]">
        <div className="space-y-5 pr-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Class Name</label>
            <Input data-testid="input-class-name" value={className} onChange={e => setClassName(e.target.value)} className="font-semibold" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Attributes</label>
              <Button variant="outline" size="sm" onClick={addAttr} className="h-7 gap-1 text-xs"><Plus className="w-3 h-3" /> Add</Button>
            </div>
            <div className="space-y-2">
              {attributes.map(a => (
                <div key={a.id} className="flex items-center gap-2">
                  <Select value={a.visibility} onValueChange={v => updateAttr(a.id, "visibility", v)}>
                    <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{VISIBILITIES.map(v => <SelectItem key={v.value} value={v.value} className="text-xs">{v.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input value={a.name} onChange={e => updateAttr(a.id, "name", e.target.value)} className="h-8 text-xs flex-1" placeholder="name" />
                  <Select value={a.dataType} onValueChange={v => updateAttr(a.id, "dataType", v)}>
                    <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{DATA_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeAttr(a.id)}><Trash2 className="w-3.5 h-3.5 text-muted-foreground" /></Button>
                </div>
              ))}
              {attributes.length === 0 && <p className="text-xs text-muted-foreground italic">No attributes. Click Add.</p>}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Methods</label>
              <Button variant="outline" size="sm" onClick={addMethod} className="h-7 gap-1 text-xs"><Plus className="w-3 h-3" /> Add</Button>
            </div>
            <div className="space-y-2">
              {methods.map(m => (
                <div key={m.id} className="grid grid-cols-[7rem_1fr_1fr_7rem_2rem] gap-1.5 items-center">
                  <Select value={m.visibility} onValueChange={v => updateMethod(m.id, "visibility", v)}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{VISIBILITIES.map(v => <SelectItem key={v.value} value={v.value} className="text-xs">{v.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input value={m.name} onChange={e => updateMethod(m.id, "name", e.target.value)} className="h-8 text-xs" placeholder="methodName" />
                  <Input value={m.params} onChange={e => updateMethod(m.id, "params", e.target.value)} className="h-8 text-xs" placeholder="param: Type" />
                  <Select value={m.returnType} onValueChange={v => updateMethod(m.id, "returnType", v)}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{DATA_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeMethod(m.id)}><Trash2 className="w-3.5 h-3.5 text-muted-foreground" /></Button>
                </div>
              ))}
              {methods.length === 0 && <p className="text-xs text-muted-foreground italic">No methods. Click Add.</p>}
            </div>
          </div>
          <p className="text-xs text-muted-foreground pt-2 border-t border-border"><span className="text-foreground font-mono">+</span> public · <span className="text-foreground font-mono">-</span> private · <span className="text-foreground font-mono">#</span> protected</p>
        </div>
      </ScrollArea>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Live Preview</h3>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7" onClick={() => setShowExample(v => !v)}>
            {showExample ? <><EyeOff className="w-3.5 h-3.5" /> Your Diagram</> : <><Eye className="w-3.5 h-3.5" /> Nanny Example</>}
          </Button>
        </div>
        {showExample && <Badge variant="outline" className="text-xs mb-3 bg-amber-500/10 text-amber-300 border-amber-500/30">Worked example — Nanny class</Badge>}

        <svg width={W} height={totalH} viewBox={`0 0 ${W} ${totalH}`} className="rounded-xl overflow-hidden border border-border" style={{ background: "hsl(222 47% 11%)" }}>
          <rect x={0} y={0} width={W} height={headerH} fill="hsl(221 83% 28%/0.5)" />
          <text x={W / 2} y={headerH / 2 + 5} textAnchor="middle" fill="white" fontSize={13} fontWeight="bold" fontFamily="Inter,sans-serif">{data.className || "ClassName"}</text>
          <rect x={0} y={headerH} width={W} height={attrH} fill="hsl(222 47% 13%)" />
          <line x1={0} y1={headerH} x2={W} y2={headerH} stroke="hsl(216 34% 22%)" strokeWidth={1} />
          {data.attributes.length === 0
            ? <text x={PAD} y={headerH + ROW_H * 0.72} fill="hsl(215 20% 45%)" fontSize={11} fontFamily="Inter,sans-serif" fontStyle="italic">— no attributes —</text>
            : data.attributes.map((a, i) => (
              <text key={a.id} x={PAD} y={headerH + 8 + (i + 0.7) * ROW_H} fontSize={12} fontFamily="'Menlo',monospace">
                <tspan fill="hsl(217 91% 70%)">{a.visibility}</tspan>
                <tspan fill="white"> {a.name || "?"}</tspan>
                <tspan fill="hsl(215 20% 60%)">: </tspan>
                <tspan fill="hsl(152 60% 60%)">{a.dataType}</tspan>
              </text>
            ))}
          <rect x={0} y={headerH + attrH} width={W} height={methH} fill="hsl(222 47% 11%)" />
          <line x1={0} y1={headerH + attrH} x2={W} y2={headerH + attrH} stroke="hsl(216 34% 22%)" strokeWidth={1} />
          {data.methods.length === 0
            ? <text x={PAD} y={headerH + attrH + ROW_H * 0.72} fill="hsl(215 20% 45%)" fontSize={11} fontFamily="Inter,sans-serif" fontStyle="italic">— no methods —</text>
            : data.methods.map((m, i) => (
              <text key={m.id} x={PAD} y={headerH + attrH + 8 + (i + 0.7) * ROW_H} fontSize={12} fontFamily="'Menlo',monospace">
                <tspan fill="hsl(217 91% 70%)">{m.visibility}</tspan>
                <tspan fill="hsl(43 96% 68%)"> {m.name || "?"}</tspan>
                <tspan fill="hsl(215 20% 60%)">({m.params}): </tspan>
                <tspan fill="hsl(152 60% 60%)">{m.returnType}</tspan>
              </text>
            ))}
          <rect x={0} y={0} width={W} height={totalH} fill="none" stroke="hsl(216 34% 22%)" strokeWidth={1} rx={4} />
        </svg>
      </div>
    </div>
  );
}

// ─── Use Case SVG Reference ───────────────────────────────────────────────────
function UseCaseDiagram() {
  const W = 680, H = 460;
  const uc = [
    { id: "u1", x: 270, y: 80, label: "Search Nanny" }, { id: "u2", x: 270, y: 150, label: "Make Booking" },
    { id: "u3", x: 270, y: 220, label: "Track Booking" }, { id: "u4", x: 270, y: 290, label: "Update Profile" },
    { id: "u5", x: 430, y: 150, label: "Authenticate" }, { id: "u6", x: 430, y: 290, label: "Manage Availability" },
    { id: "u7", x: 430, y: 360, label: "View Bookings" }, { id: "u8", x: 550, y: 80, label: "Reports" },
  ];
  const actors = [{ id: "p", x: 60, y: 170, label: "Parent" }, { id: "n", x: 60, y: 340, label: "Nanny" }, { id: "m", x: 630, y: 80, label: "Manager" }];
  const assoc = [["p","u1"],["p","u2"],["p","u3"],["p","u4"],["n","u6"],["n","u7"],["m","u8"]];
  const getU = (id: string) => uc.find(u => u.id === id)!;
  const getA = (id: string) => actors.find(a => a.id === id)!;
  function stick(ax: number, ay: number, color = "#1e3a6e") {
    return <g key={`${ax}${ay}`}>
      <circle cx={ax} cy={ay - 18} r={8} fill="none" stroke={color} strokeWidth={1.5}/>
      <line x1={ax} y1={ay-10} x2={ax} y2={ay+10} stroke={color} strokeWidth={1.5}/>
      <line x1={ax-12} y1={ay-2} x2={ax+12} y2={ay-2} stroke={color} strokeWidth={1.5}/>
      <line x1={ax} y1={ay+10} x2={ax-10} y2={ay+26} stroke={color} strokeWidth={1.5}/>
      <line x1={ax} y1={ay+10} x2={ax+10} y2={ay+26} stroke={color} strokeWidth={1.5}/>
    </g>;
  }
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Hire-a-Nanny — Use Case Diagram</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-gray-200 bg-white">
        <defs><marker id="ucArrow" markerWidth={7} markerHeight={5} refX={7} refY={2.5} orient="auto"><polygon points="0 0, 7 2.5, 0 5" fill="#2563eb"/></marker></defs>
        {/* System boundary */}
        <rect x={160} y={40} width={450} height={400} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="6 3"/>
        <text x={174} y={32} fill="#64748b" fontSize={11} fontFamily="Inter,sans-serif" fontWeight="600">Hire-a-Nanny System</text>
        {/* Assoc lines */}
        {assoc.map(([aid,uid],i) => {
          const a = getA(aid), u = getU(uid);
          const fromX = a.x < 200 ? a.x + 20 : a.x - 20;
          return <line key={i} x1={fromX} y1={a.y} x2={u.x - 52} y2={u.y} stroke="#94a3b8" strokeWidth={1.2}/>;
        })}
        {/* Manager line */}
        <line x1={610} y1={80} x2={getU("u8").x+52} y2={getU("u8").y} stroke="#94a3b8" strokeWidth={1.2}/>
        {/* include */}
        <line x1={getU("u2").x+52} y1={150} x2={getU("u5").x-52} y2={150} stroke="#2563eb" strokeWidth={1.3} strokeDasharray="4 2" markerEnd="url(#ucArrow)"/>
        <text x={350} y={143} textAnchor="middle" fill="#2563eb" fontSize={9} fontFamily="Inter,sans-serif">«include»</text>
        {/* Use cases */}
        {uc.map(u => (
          <g key={u.id}>
            <ellipse cx={u.x} cy={u.y} rx={52} ry={22} fill="#eff6ff" stroke="#2563eb" strokeWidth={1.4}/>
            <text x={u.x} y={u.y+5} textAnchor="middle" fill="#1e3a6e" fontSize={11} fontFamily="Inter,sans-serif" fontWeight="500">{u.label}</text>
          </g>
        ))}
        {/* Actors */}
        {actors.map(a => (
          <g key={a.id}>
            {stick(a.x, a.y)}
            <text x={a.x} y={a.y+38} textAnchor="middle" fill="#334155" fontSize={11} fontFamily="Inter,sans-serif" fontWeight="600">{a.label}</text>
          </g>
        ))}
      </svg>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[["Actor","stick figure outside the system boundary"],["Use Case","oval inside the system boundary — a system function"],["«include»","dashed arrow — the sub-use case is always executed"]].map(([t,d]) => (
          <Card key={t} className="border-border"><CardContent className="pt-3 pb-3"><p className="text-xs font-semibold text-foreground mb-0.5">{t}</p><p className="text-xs text-muted-foreground">{d}</p></CardContent></Card>
        ))}
      </div>
      <Card className="mt-4 border-amber-500/20 bg-amber-500/5"><CardContent className="pt-3 pb-3">
        <p className="text-xs font-semibold text-amber-300 mb-1">Exam tip — «include» vs «extend»</p>
        <p className="text-xs text-muted-foreground"><strong className="text-foreground">«include»</strong> = MANDATORY sub-flow (every booking always requires authentication). <strong className="text-foreground">«extend»</strong> = OPTIONAL — only happens under certain conditions.</p>
      </CardContent></Card>
    </div>
  );
}

// ─── Activity SVG Reference ───────────────────────────────────────────────────
function ActivityDiagram() {
  const W = 680, H = 560, LANE_W = 213, HDR = 42;
  const lanes = ["Help Desk\nConsultant","Technical\nConsultant","Supervisor"];
  const lx = (i: number) => 10 + i * LANE_W + LANE_W / 2;
  const nodes = [
    {id:"n0",lane:0,y:95,type:"start"},{id:"n1",lane:0,y:148,type:"act",label:"Collect customer details"},
    {id:"n2",lane:0,y:210,type:"act",label:"Register incident"},{id:"n3",lane:1,y:275,type:"act",label:"Initial troubleshooting"},
    {id:"n4",lane:1,y:338,type:"dec",label:"Resolved?"},{id:"n5",lane:1,y:400,type:"act",label:"Compile tech report"},
    {id:"n6",lane:2,y:430,type:"act",label:"Confirm details"},{id:"n7",lane:2,y:498,type:"act",label:"Approve report"},
    {id:"n8",lane:2,y:543,type:"end"},
  ];
  const arrows = [["n0","n1"],["n1","n2"],["n2","n3"],["n3","n4"],["n4","n5","No"],["n5","n6"],["n6","n7"],["n7","n8"]];
  const gn = (id: string) => nodes.find(n => n.id === id)!;
  const edgeY = (n: typeof nodes[0], dir: "out"|"in") => n.y + (dir==="out" ? (n.type==="act"?20:n.type==="dec"?14:n.type==="start"?10:0) : -(n.type==="act"?20:n.type==="dec"?14:n.type==="end"?14:0));
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Help Desk Workflow — Activity Diagram with Swimlanes</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-gray-200 bg-white">
        <defs><marker id="actArrow" markerWidth={7} markerHeight={5} refX={7} refY={2.5} orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#475569"/></marker></defs>
        {lanes.map((lane,i) => {
          const x = 10 + i * LANE_W;
          return <g key={i}>
            <rect x={x} y={HDR} width={LANE_W} height={H-HDR-8} fill={i%2===0?"#f8fafc":"#f1f5f9"}/>
            <rect x={x} y={0} width={LANE_W} height={HDR} fill={i===0?"#dbeafe":i===1?"#ede9fe":"#dcfce7"}/>
            <line x1={x} y1={0} x2={x} y2={H-8} stroke="#cbd5e1" strokeWidth={1}/>
            {lane.split("\n").map((p,j) => <text key={j} x={x+LANE_W/2} y={14+j*16} textAnchor="middle" fill="#334155" fontSize={11} fontFamily="Inter,sans-serif" fontWeight="700">{p}</text>)}
          </g>;
        })}
        <rect x={10} y={0} width={LANE_W*3} height={H-8} fill="none" stroke="#94a3b8" strokeWidth={1.5} rx={4}/>

        {arrows.map(([fid,tid,lbl],i) => {
          const f=gn(fid),t=gn(tid), fx=lx(f.lane),tx=lx(t.lane),fy=edgeY(f,"out"),ty=edgeY(t,"in");
          if(f.lane!==t.lane){const my=(fy+ty)/2; return <g key={i}><polyline points={`${fx},${fy} ${fx},${my} ${tx},${my} ${tx},${ty}`} fill="none" stroke="#475569" strokeWidth={1.4} markerEnd="url(#actArrow)"/>{lbl&&<text x={(fx+tx)/2} y={my-5} textAnchor="middle" fill="#64748b" fontSize={10} fontFamily="Inter,sans-serif">{lbl}</text>}</g>;}
          return <g key={i}><line x1={fx} y1={fy} x2={tx} y2={ty} stroke="#475569" strokeWidth={1.4} markerEnd="url(#actArrow)"/>{lbl&&<text x={fx+6} y={(fy+ty)/2} fill="#16a34a" fontSize={10} fontFamily="Inter,sans-serif" fontWeight="600">{lbl}</text>}</g>;
        })}
        {/* yes loop */}
        <polyline points={`${lx(1)+14},338 ${lx(1)+80},338 ${lx(1)+80},148 ${lx(0)+75},148`} fill="none" stroke="#94a3b8" strokeWidth={1.2} strokeDasharray="4 2"/>
        <text x={lx(1)+83} y={245} fill="#94a3b8" fontSize={9} fontFamily="Inter,sans-serif">Yes (re-register)</text>

        {nodes.map(n=>{
          const x=lx(n.lane),y=n.y;
          if(n.type==="start") return <circle key={n.id} cx={x} cy={y} r={10} fill="#1e293b"/>;
          if(n.type==="end") return <g key={n.id}><circle cx={x} cy={y} r={13} fill="none" stroke="#1e293b" strokeWidth={2.5}/><circle cx={x} cy={y} r={7} fill="#1e293b"/></g>;
          if(n.type==="act") return <g key={n.id}><rect x={x-68} y={y-20} width={136} height={40} rx={20} fill="white" stroke="#3b82f6" strokeWidth={1.5}/><text x={x} y={y+5} textAnchor="middle" fill="#1e3a6e" fontSize={11} fontFamily="Inter,sans-serif" fontWeight="500">{n.label}</text></g>;
          if(n.type==="dec") return <g key={n.id}><polygon points={`${x},${y-16} ${x+54},${y} ${x},${y+16} ${x-54},${y}`} fill="#fefce8" stroke="#ca8a04" strokeWidth={1.5}/><text x={x} y={y+4} textAnchor="middle" fill="#92400e" fontSize={11} fontFamily="Inter,sans-serif" fontWeight="500">{n.label}</text></g>;
          return null;
        })}
      </svg>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {[["Initial Node","Filled black circle — start of flow"],["Activity","Rounded rectangle — a step/action"],["Decision","Diamond — a branch point (yes/no)"],["Final Node","Bull's-eye — end of flow"]].map(([t,d]) => (
          <Card key={t} className="border-border"><CardContent className="pt-3 pb-3"><p className="text-xs font-semibold text-foreground mb-0.5">{t}</p><p className="text-xs text-muted-foreground">{d}</p></CardContent></Card>
        ))}
      </div>
      <Card className="mt-4 border-emerald-500/20 bg-emerald-500/5"><CardContent className="pt-3 pb-3">
        <p className="text-xs font-semibold text-emerald-300 mb-1">Exam tip — Swimlanes</p>
        <p className="text-xs text-muted-foreground">Always use swimlanes when multiple roles are involved. Each role gets a column. Arrows cross lanes at handoff points. Activities go in the lane of whoever performs them.</p>
      </CardContent></Card>
    </div>
  );
}

// ─── Drawing Board (B&W, localStorage) ───────────────────────────────────────
const PALETTE: Array<{ type: ShapeType; label: string }> = [
  { type: "actor", label: "Actor" },{ type: "usecase", label: "Use Case" },
  { type: "activity", label: "Activity" },{ type: "decision", label: "Decision" },
  { type: "start", label: "Start" },{ type: "end", label: "End" },
  { type: "note", label: "Note" },
];

function PaletteShape({ type }: { type: ShapeType }) {
  return (
    <svg width={50} height={34} viewBox="0 0 50 34">
      {type==="actor"&&<><circle cx={25} cy={8} r={6} fill="none" stroke="#1e293b" strokeWidth={1.5}/><line x1={25} y1={14} x2={25} y2={24} stroke="#1e293b" strokeWidth={1.5}/><line x1={17} y1={18} x2={33} y2={18} stroke="#1e293b" strokeWidth={1.5}/><line x1={25} y1={24} x2={19} y2={32} stroke="#1e293b" strokeWidth={1.5}/><line x1={25} y1={24} x2={31} y2={32} stroke="#1e293b" strokeWidth={1.5}/></>}
      {type==="usecase"&&<ellipse cx={25} cy={17} rx={22} ry={12} fill="white" stroke="#1e293b" strokeWidth={1.5}/>}
      {type==="activity"&&<rect x={3} y={10} width={44} height={14} rx={7} fill="white" stroke="#1e293b" strokeWidth={1.5}/>}
      {type==="decision"&&<polygon points="25,3 47,17 25,31 3,17" fill="white" stroke="#1e293b" strokeWidth={1.5}/>}
      {type==="start"&&<circle cx={25} cy={17} r={9} fill="#1e293b"/>}
      {type==="end"&&<><circle cx={25} cy={17} r={11} fill="none" stroke="#1e293b" strokeWidth={2}/><circle cx={25} cy={17} r={6} fill="#1e293b"/></>}
      {type==="note"&&<><rect x={3} y={8} width={44} height={18} rx={3} fill="white" stroke="#475569" strokeWidth={1.3} strokeDasharray="3 2"/><line x1={7} y1={13} x2={43} y2={13} stroke="#94a3b8" strokeWidth={1}/><line x1={7} y1={19} x2={35} y2={19} stroke="#94a3b8" strokeWidth={1}/></>}
    </svg>
  );
}

function BoardShapeEl({ shape, selected, connecting }: { shape: BoardShape; selected: boolean; connecting: boolean }) {
  const { type, x, y, label, width: w, height: h } = shape;
  const sel = selected ? "#2563eb" : connecting ? "#16a34a" : "#1e293b";
  const selW = selected || connecting ? 2 : 1.5;
  const fill = selected ? "#eff6ff" : connecting ? "#f0fdf4" : "white";
  if (type==="actor") {
    const cx=x+w/2,cy=y+8;
    return <g style={{cursor:"move",userSelect:"none"}}>
      <circle cx={cx} cy={cy} r={9} fill="white" stroke={sel} strokeWidth={selW}/>
      <line x1={cx} y1={cy+9} x2={cx} y2={cy+28} stroke={sel} strokeWidth={selW}/>
      <line x1={cx-13} y1={cy+18} x2={cx+13} y2={cy+18} stroke={sel} strokeWidth={selW}/>
      <line x1={cx} y1={cy+28} x2={cx-10} y2={cy+42} stroke={sel} strokeWidth={selW}/>
      <line x1={cx} y1={cy+28} x2={cx+10} y2={cy+42} stroke={sel} strokeWidth={selW}/>
      <text x={cx} y={cy+58} textAnchor="middle" fill="#1e293b" fontSize={11} fontFamily="Inter,sans-serif" fontWeight="500">{label}</text>
    </g>;
  }
  if (type==="usecase") return <g style={{cursor:"move",userSelect:"none"}}><ellipse cx={x+w/2} cy={y+h/2} rx={w/2} ry={h/2} fill={fill} stroke={sel} strokeWidth={selW}/><text x={x+w/2} y={y+h/2+4} textAnchor="middle" fill="#1e293b" fontSize={11} fontFamily="Inter,sans-serif">{label}</text></g>;
  if (type==="activity") return <g style={{cursor:"move",userSelect:"none"}}><rect x={x} y={y} width={w} height={h} rx={h/2} fill={fill} stroke={sel} strokeWidth={selW}/><text x={x+w/2} y={y+h/2+4} textAnchor="middle" fill="#1e293b" fontSize={11} fontFamily="Inter,sans-serif">{label}</text></g>;
  if (type==="decision") return <g style={{cursor:"move",userSelect:"none"}}><polygon points={`${x+w/2},${y} ${x+w},${y+h/2} ${x+w/2},${y+h} ${x},${y+h/2}`} fill={fill} stroke={sel} strokeWidth={selW}/><text x={x+w/2} y={y+h/2+4} textAnchor="middle" fill="#92400e" fontSize={11} fontFamily="Inter,sans-serif">{label}</text></g>;
  if (type==="start") return <g style={{cursor:"move",userSelect:"none"}}><circle cx={x+w/2} cy={y+h/2} r={w/2} fill={selected?"#2563eb":"#1e293b"}/></g>;
  if (type==="end") return <g style={{cursor:"move",userSelect:"none"}}><circle cx={x+w/2} cy={y+h/2} r={w/2} fill="none" stroke={sel} strokeWidth={selW+0.5}/><circle cx={x+w/2} cy={y+h/2} r={w/2-5} fill={selected?"#2563eb":"#1e293b"}/></g>;
  if (type==="note") return <g style={{cursor:"move",userSelect:"none"}}><rect x={x} y={y} width={w} height={h} rx={3} fill={fill} stroke="#475569" strokeWidth={1.3} strokeDasharray="4 2"/><text x={x+8} y={y+h/2+4} fill="#475569" fontSize={11} fontFamily="Inter,sans-serif">{label}</text></g>;
  return null;
}

function DrawingBoard() {
  const svgRef = useRef<SVGSVGElement>(null);
  const STORAGE_KEY = "sand-diagram-board-v2";

  const [{ shapes, arrows }, setState] = useState<BoardState>(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch {}
    return { shapes: [], arrows: [] };
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; ox: number; oy: number } | null>(null);
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [arrowStyle, setArrowStyle] = useState<"solid"|"dashed">("solid");
  const [editLabel, setEditLabel] = useState<string | null>(null);
  const [labelInput, setLabelInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState(false);

  const setShapes = (fn: (s: BoardShape[]) => BoardShape[]) => setState(prev => ({ ...prev, shapes: fn(prev.shapes) }));
  const setArrows = (fn: (a: BoardArrow[]) => BoardArrow[]) => setState(prev => ({ ...prev, arrows: fn(prev.arrows) }));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ shapes, arrows }));
  }, [shapes, arrows]);

  function getSVGPt(e: React.PointerEvent | PointerEvent) {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function handlePaletteDragStart(e: React.DragEvent, type: ShapeType) {
    e.dataTransfer.setData("shapeType", type);
    e.dataTransfer.effectAllowed = "copy";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const type = e.dataTransfer.getData("shapeType") as ShapeType;
    if (!type) return;
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    const def = SHAPE_DEFAULTS[type];
    const labels: Record<ShapeType, string> = { actor: "Actor", usecase: "Use Case", activity: "Activity", decision: "Yes/No?", start: "", end: "", note: "Note" };
    const s: BoardShape = { id: Math.random().toString(36).slice(2), type, x: e.clientX - r.left - def.width / 2, y: e.clientY - r.top - def.height / 2, label: labels[type], ...def };
    setShapes(p => [...p, s]);
    setSelected(s.id);
  }

  function handlePointerDown(e: React.PointerEvent, id: string) {
    e.stopPropagation();
    if (connectMode) {
      if (!connectFrom) { setConnectFrom(id); setSelected(id); }
      else if (connectFrom !== id) {
        setArrows(p => [...p, { id: Math.random().toString(36).slice(2), fromId: connectFrom, toId: id, style: arrowStyle }]);
        setConnectFrom(null); setSelected(null);
      }
      return;
    }
    setSelected(id);
    const s = shapes.find(sh => sh.id === id);
    if (!s) return;
    const pt = getSVGPt(e);
    setDragging({ id, ox: pt.x - s.x, oy: pt.y - s.y });
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const pt = getSVGPt(e);
    setShapes(p => p.map(s => s.id === dragging.id ? { ...s, x: Math.max(0, pt.x - dragging.ox), y: Math.max(0, pt.y - dragging.oy) } : s));
  }

  function handlePointerUp() { setDragging(null); }

  function startEdit(id: string) {
    const s = shapes.find(sh => sh.id === id);
    if (!s) return;
    setEditLabel(id); setLabelInput(s.label);
  }

  function commitLabel() {
    if (!editLabel) return;
    setShapes(p => p.map(s => s.id === editLabel ? { ...s, label: labelInput } : s));
    setEditLabel(null);
  }

  function deleteSelected() {
    if (!selected) return;
    setShapes(p => p.filter(s => s.id !== selected));
    setArrows(p => p.filter(a => a.fromId !== selected && a.toId !== selected));
    setSelected(null);
  }

  function saveBoard() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ shapes, arrows }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function clearBoard() {
    setState({ shapes: [], arrows: [] });
    setSelected(null); setConnectFrom(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  function getCenter(id: string) {
    const s = shapes.find(sh => sh.id === id);
    if (!s) return { x: 0, y: 0 };
    return { x: s.x + s.width / 2, y: s.y + s.height / 2 };
  }

  return (
    <div className="flex gap-4 h-[610px]">
      {/* Palette */}
      <div className="w-28 shrink-0 flex flex-col gap-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Shapes</p>
        <p className="text-xs text-muted-foreground leading-tight">Drag onto board →</p>
        {PALETTE.map(({ type, label }) => (
          <div key={type} draggable onDragStart={e => handlePaletteDragStart(e, type)}
            className="flex flex-col items-center gap-1 border border-border rounded-xl p-2 cursor-grab active:cursor-grabbing hover:border-primary/50 hover:bg-primary/5 transition-colors select-none bg-card">
            <PaletteShape type={type} />
            <span className="text-xs text-muted-foreground text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* Board */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant={connectMode ? "default" : "outline"} className="h-7 text-xs gap-1.5"
            onClick={() => { setConnectMode(v => !v); setConnectFrom(null); }}>
            {connectMode ? (connectFrom ? "→ Click target" : "→ Click source") : "Connect"}
          </Button>
          {connectMode && (
            <Select value={arrowStyle} onValueChange={v => setArrowStyle(v as "solid"|"dashed")}>
              <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="solid" className="text-xs">Solid</SelectItem>
                <SelectItem value="dashed" className="text-xs">Dashed «include»</SelectItem>
              </SelectContent>
            </Select>
          )}
          {selected && !connectMode && (
            <>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => startEdit(selected)}>Edit Label</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={deleteSelected}><Trash2 className="w-3 h-3" /> Delete</Button>
            </>
          )}
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={saveBoard}>
              <Save className="w-3 h-3" /> {saved ? "Saved!" : "Save"}
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={clearBoard}><RotateCcw className="w-3 h-3" /> Clear</Button>
          </div>
        </div>

        {editLabel && (
          <div className="flex gap-2 items-center">
            <Input autoFocus value={labelInput} onChange={e => setLabelInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") commitLabel(); if (e.key === "Escape") setEditLabel(null); }}
              className="h-7 text-xs max-w-xs" placeholder="Enter label..." />
            <Button size="sm" className="h-7 text-xs" onClick={commitLabel}>OK</Button>
          </div>
        )}

        <div className={cn("flex-1 border-2 rounded-xl overflow-hidden transition-colors relative",
            dragOver ? "border-primary" : "border-gray-300")}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>

          {shapes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-gray-400 text-sm">Drag shapes from the palette onto the board</p>
              <p className="text-gray-300 text-xs mt-1">Use Connect to draw arrows · Double-click to rename</p>
            </div>
          )}

          <svg ref={svgRef} className="w-full h-full bg-white"
            onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
            onClick={e => { if ((e.target as Element).tagName === "svg") { setSelected(null); if (connectMode) setConnectFrom(null); } }}
            onDoubleClick={() => { if (selected) startEdit(selected); }}>
            <defs>
              <pattern id="bwgrid" x={0} y={0} width={20} height={20} patternUnits="userSpaceOnUse">
                <circle cx={1} cy={1} r={0.7} fill="#e2e8f0"/>
              </pattern>
              <marker id="bwArrow" markerWidth={7} markerHeight={5} refX={7} refY={2.5} orient="auto">
                <polygon points="0 0,7 2.5,0 5" fill="#475569"/>
              </marker>
              <marker id="bwArrowDash" markerWidth={7} markerHeight={5} refX={7} refY={2.5} orient="auto">
                <polygon points="0 0,7 2.5,0 5" fill="#2563eb"/>
              </marker>
            </defs>
            <rect width="100%" height="100%" fill="url(#bwgrid)"/>

            {/* Arrows */}
            {arrows.map(arrow => {
              const f = getCenter(arrow.fromId), t = getCenter(arrow.toId);
              const dash = arrow.style === "dashed";
              return <g key={arrow.id}>
                <line x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke={dash?"#2563eb":"#475569"} strokeWidth={1.5}
                  strokeDasharray={dash?"5 3":undefined} markerEnd={dash?"url(#bwArrowDash)":"url(#bwArrow)"}/>
                {dash && <text x={(f.x+t.x)/2+4} y={(f.y+t.y)/2-6} fill="#2563eb" fontSize={9} fontFamily="Inter,sans-serif">«include»</text>}
              </g>;
            })}

            {/* Shapes */}
            {shapes.map(s => (
              <g key={s.id} onPointerDown={e => handlePointerDown(e, s.id)}>
                {/* hit area */}
                <rect x={s.x-4} y={s.y-4} width={s.width+8} height={s.height+8} fill="transparent"/>
                <BoardShapeEl shape={s} selected={selected===s.id} connecting={connectFrom===s.id}/>
                {/* connect target highlight */}
                {connectMode && connectFrom && connectFrom!==s.id && (
                  <rect x={s.x-5} y={s.y-5} width={s.width+10} height={s.height+10} fill="none"
                    stroke="#16a34a" strokeWidth={1.5} strokeDasharray="4 2" rx={4} style={{pointerEvents:"none"}}/>
                )}
              </g>
            ))}
          </svg>
        </div>

        <p className="text-xs text-muted-foreground">Drag to move · Connect to draw arrows · Double-click to edit label · Board auto-saves to localStorage</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Diagrams() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Diagrams</h1>
        <p className="text-muted-foreground text-sm mt-1">Draw your own · Build class diagrams · Study reference examples</p>
      </div>

      <Tabs defaultValue="board">
        <TabsList className="mb-6">
          <TabsTrigger value="board">Drawing Board</TabsTrigger>
          <TabsTrigger value="class">Class Builder</TabsTrigger>
          <TabsTrigger value="usecase">Use Case Reference</TabsTrigger>
          <TabsTrigger value="activity">Activity Reference</TabsTrigger>
        </TabsList>
        <TabsContent value="board"><DrawingBoard /></TabsContent>
        <TabsContent value="class"><ClassDiagramBuilder /></TabsContent>
        <TabsContent value="usecase"><UseCaseDiagram /></TabsContent>
        <TabsContent value="activity"><ActivityDiagram /></TabsContent>
      </Tabs>
    </div>
  );
}
