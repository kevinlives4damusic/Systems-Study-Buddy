import { useState } from "react";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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

function ClassDiagramBuilder() {
  const [className, setClassName] = useState("MyClass");
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [methods, setMethods] = useState<Method[]>([]);
  const [showExample, setShowExample] = useState(false);

  const display = showExample ? NANNY_EXAMPLE : { className, attributes, methods };

  function addAttr() {
    setAttributes(prev => [...prev, { id: Math.random().toString(36).slice(2), visibility: "-", name: "attribute", dataType: "String" }]);
  }

  function removeAttr(id: string) {
    setAttributes(prev => prev.filter(a => a.id !== id));
  }

  function updateAttr(id: string, field: keyof Attribute, value: string) {
    setAttributes(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  }

  function addMethod() {
    setMethods(prev => [...prev, { id: Math.random().toString(36).slice(2), visibility: "+", name: "method", params: "", returnType: "void" }]);
  }

  function removeMethod(id: string) {
    setMethods(prev => prev.filter(m => m.id !== id));
  }

  function updateMethod(id: string, field: keyof Method, value: string) {
    setMethods(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  }

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Builder */}
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-5 pr-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Class Name</label>
            <Input
              data-testid="input-class-name"
              value={className}
              onChange={e => setClassName(e.target.value)}
              className="font-semibold"
              placeholder="ClassName"
            />
          </div>

          {/* Attributes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Attributes</label>
              <Button data-testid="btn-add-attribute" variant="outline" size="sm" onClick={addAttr} className="h-7 gap-1 text-xs">
                <Plus className="w-3 h-3" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {attributes.map(attr => (
                <div key={attr.id} className="flex items-center gap-2">
                  <Select value={attr.visibility} onValueChange={v => updateAttr(attr.id, "visibility", v)}>
                    <SelectTrigger className="w-28 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VISIBILITIES.map(v => (
                        <SelectItem key={v.value} value={v.value} className="text-xs">{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    data-testid={`attr-name-${attr.id}`}
                    value={attr.name}
                    onChange={e => updateAttr(attr.id, "name", e.target.value)}
                    className="h-8 text-xs flex-1"
                    placeholder="name"
                  />
                  <Select value={attr.dataType} onValueChange={v => updateAttr(attr.id, "dataType", v)}>
                    <SelectTrigger className="w-28 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DATA_TYPES.map(t => (
                        <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeAttr(attr.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
              {attributes.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No attributes yet. Click Add.</p>
              )}
            </div>
          </div>

          {/* Methods */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Methods</label>
              <Button data-testid="btn-add-method" variant="outline" size="sm" onClick={addMethod} className="h-7 gap-1 text-xs">
                <Plus className="w-3 h-3" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {methods.map(method => (
                <div key={method.id} className="grid grid-cols-[7rem_1fr_1fr_7rem_2rem] gap-1.5 items-center">
                  <Select value={method.visibility} onValueChange={v => updateMethod(method.id, "visibility", v)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VISIBILITIES.map(v => (
                        <SelectItem key={v.value} value={v.value} className="text-xs">{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    data-testid={`method-name-${method.id}`}
                    value={method.name}
                    onChange={e => updateMethod(method.id, "name", e.target.value)}
                    className="h-8 text-xs"
                    placeholder="methodName"
                  />
                  <Input
                    data-testid={`method-params-${method.id}`}
                    value={method.params}
                    onChange={e => updateMethod(method.id, "params", e.target.value)}
                    className="h-8 text-xs"
                    placeholder="param: Type"
                  />
                  <Select value={method.returnType} onValueChange={v => updateMethod(method.id, "returnType", v)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DATA_TYPES.map(t => (
                        <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeMethod(method.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
              {methods.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No methods yet. Click Add.</p>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Legend:</p>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span><span className="text-foreground font-mono">+</span> public</span>
              <span><span className="text-foreground font-mono">-</span> private</span>
              <span><span className="text-foreground font-mono">#</span> protected</span>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Live preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Live Preview</h3>
          <Button
            data-testid="btn-toggle-example"
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-7"
            onClick={() => setShowExample(v => !v)}
          >
            {showExample ? <><EyeOff className="w-3.5 h-3.5" /> Your Diagram</> : <><Eye className="w-3.5 h-3.5" /> Nanny Example</>}
          </Button>
        </div>

        {showExample && (
          <Badge variant="outline" className="text-xs mb-3 bg-amber-500/10 text-amber-300 border-amber-500/30">
            Showing worked example — Nanny class
          </Badge>
        )}

        <div className="font-mono text-sm border border-border rounded-xl overflow-hidden bg-card">
          {/* Class name */}
          <div className="text-center px-4 py-3 border-b border-border bg-primary/10 font-semibold text-foreground">
            {display.className || "ClassName"}
          </div>

          {/* Attributes */}
          <div className="px-4 py-3 border-b border-border min-h-16">
            {display.attributes.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">— no attributes —</p>
            ) : (
              display.attributes.map(a => (
                <div key={a.id} className="text-xs py-0.5">
                  <span className="text-blue-400">{a.visibility}</span>
                  <span className="text-foreground"> {a.name || "?"}</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-emerald-400">{a.dataType}</span>
                </div>
              ))
            )}
          </div>

          {/* Methods */}
          <div className="px-4 py-3 min-h-16">
            {display.methods.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">— no methods —</p>
            ) : (
              display.methods.map(m => (
                <div key={m.id} className="text-xs py-0.5">
                  <span className="text-blue-400">{m.visibility}</span>
                  <span className="text-amber-300"> {m.name || "?"}</span>
                  <span className="text-muted-foreground">(</span>
                  <span className="text-muted-foreground">{m.params}</span>
                  <span className="text-muted-foreground">)</span>
                  {m.returnType && <><span className="text-muted-foreground">: </span><span className="text-emerald-400">{m.returnType}</span></>}
                </div>
              ))
            )}
          </div>
        </div>

        <Card className="mt-4 border-border">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Quick reminder — notation:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="text-foreground font-mono">- name: String</span> — private attribute of type String</p>
              <p><span className="text-foreground font-mono">+ getName(): String</span> — public method returning String</p>
              <p><span className="text-foreground font-mono">+ setAge(age: Integer): void</span> — public method with parameter, returns nothing</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Use Case Diagram Reference ────────────────────────────────────────────
function UseCaseReference() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Use Case Diagram — Key Components</h3>
        <div className="space-y-3">
          {[
            { name: "System Boundary", symbol: "Rectangle", desc: "A rectangle enclosing all use cases. Represents the scope of the system." },
            { name: "Actor", symbol: "Stick Figure", desc: "Represents a user, role, or external system interacting with the system. Placed OUTSIDE the boundary." },
            { name: "Use Case", symbol: "Oval", desc: "A named function the system performs for an actor. Placed INSIDE the boundary." },
            { name: "Association", symbol: "Solid line", desc: "Connects an actor to a use case they participate in." },
            { name: "«include»", symbol: "Dashed arrow", desc: "The base use case ALWAYS includes the referenced use case (required sub-flow)." },
            { name: "«extend»", symbol: "Dashed arrow", desc: "The extending use case OPTIONALLY adds behaviour to the base use case (conditional)." },
            { name: "Generalisation", symbol: "Solid arrow (hollow tip)", desc: "One actor or use case inherits from another — child inherits all relationships." },
          ].map(item => (
            <div key={item.name} className="flex gap-3 text-xs border-l-2 border-primary/30 pl-3 py-1">
              <div className="shrink-0">
                <span className="font-semibold text-foreground">{item.name}</span>
                <span className="text-muted-foreground ml-1.5">({item.symbol})</span>
              </div>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Example — Online University Platform</h3>
        <Card className="border-border bg-card">
          <CardContent className="pt-4 pb-4">
            <div className="font-mono text-xs space-y-1 text-muted-foreground">
              <pre className="whitespace-pre text-xs leading-5">{`
  Student ──────────────────────────┐
  (stick figure)                    │  ┌─────────────────────────┐
                                    │  │   Online University      │
      ├──► Register                 ──►│   Platform               │
      ├──► Enrol in Course          ──►│                          │
      ├──► View Results             ──►│  • Register              │
      ├──► Download Statement       ──►│  • Enrol in Course       │
      └──► Update Contact Details   ──►│  • View Results          │
                                    │  │  • Download Statement    │
  OTA ──────────────────────────────┘  │  • Update Contact Details│
  (stick figure)                       │  • Load Online Task      │
      ├──► Load Online Task         ──►│  • Assess Task           │
      └──► Assess Task              ──►└─────────────────────────┘

  Note: «include» example:
    "Make Booking" ──«include»──► "Authenticate User"
    (Every booking requires authentication)

  «extend» example:
    "View Booking" ◄──«extend»── "Cancel Booking"
    (Cancellation optionally extends viewing)
`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-amber-500/5 mt-4">
          <CardContent className="pt-3 pb-3">
            <p className="text-xs font-semibold text-amber-300 mb-2">Exam tip — «include» vs «extend»</p>
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">«include»:</strong> the sub-use case is MANDATORY. The base use case ALWAYS calls it.
              <br /><br />
              <strong className="text-foreground">«extend»:</strong> the extension is OPTIONAL. It only happens under certain conditions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Activity Diagram Reference ────────────────────────────────────────────
function ActivityDiagramReference() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Activity Diagram — Key Components</h3>
        <div className="space-y-3">
          {[
            { name: "Initial Node", symbol: "Filled circle", desc: "The starting point of the activity/workflow." },
            { name: "Activity", symbol: "Rounded rectangle", desc: "A single action or step in the workflow." },
            { name: "Decision Node", symbol: "Diamond", desc: "A branch point where flow takes one of multiple paths based on a condition." },
            { name: "Merge Node", symbol: "Diamond", desc: "Joins multiple alternative flows back into one path." },
            { name: "Fork", symbol: "Thick horizontal bar", desc: "Splits flow into multiple concurrent (parallel) threads." },
            { name: "Join", symbol: "Thick horizontal bar", desc: "Synchronises multiple concurrent threads — all must complete before proceeding." },
            { name: "Swimlane", symbol: "Vertical/horizontal column", desc: "Shows WHICH actor performs each activity. Essential for multi-actor workflows." },
            { name: "Final Node", symbol: "Bull's-eye (filled circle with ring)", desc: "The end point of the entire activity." },
          ].map(item => (
            <div key={item.name} className="flex gap-3 text-xs border-l-2 border-emerald-500/30 pl-3 py-1">
              <div className="shrink-0">
                <span className="font-semibold text-foreground">{item.name}</span>
                <span className="text-muted-foreground ml-1.5">({item.symbol})</span>
              </div>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3">Example — Help Desk Workflow</h3>
        <Card className="border-border bg-card">
          <CardContent className="pt-4 pb-4">
            <pre className="font-mono text-xs leading-5 whitespace-pre text-muted-foreground">{`
┌──────────────┬──────────────┬──────────────┐
│  Consultant  │  Technical   │  Supervisor  │
│              │  Consultant  │              │
├──────────────┼──────────────┼──────────────┤
│              │              │              │
│  ●           │              │              │
│  ↓           │              │              │
│ [Collect     │              │              │
│  customer    │              │              │
│  details]    │              │              │
│  ↓           │              │              │
│ [Register    │              │              │
│  incident]   │              │              │
│  ↓           │              │              │
│ [Send to ────┼──────────────►              │
│  Technical   │              │              │
│  Consultant] │              │              │
│              │ [Troubleshoot│              │
│              │  incident]   │              │
│              │  ↓           │              │
│              │ [Compile     │              │
│              │  report]     │              │
│              │  ↓           │              │
│              │ [Send to ────┼──────────────►
│              │  Supervisor] │              │
│              │              │ [Confirm     │
│              │              │  details]    │
│              │              │  ↓           │
│              │              │ [Approve     │
│              │              │  report]     │
│              │              │  ↓           │
│              │              │  ◎           │
└──────────────┴──────────────┴──────────────┘
`}</pre>
          </CardContent>
        </Card>
        <Card className="border-amber-500/20 bg-amber-500/5 mt-4">
          <CardContent className="pt-3 pb-3">
            <p className="text-xs font-semibold text-amber-300 mb-1">Exam tip — Swimlanes</p>
            <p className="text-xs text-muted-foreground">
              Always use swimlanes when the scenario mentions multiple roles/actors. Each actor gets their own lane.
              Activities go in the lane of whoever performs them. Arrows cross lane boundaries when handoffs occur.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Diagrams() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Diagram Builder &amp; Reference</h1>
        <p className="text-muted-foreground text-sm mt-1">Build class diagrams interactively. Reference use case and activity diagram notation.</p>
      </div>

      <Tabs defaultValue="class">
        <TabsList className="mb-6">
          <TabsTrigger value="class" data-testid="tab-class-diagram">UML Class Diagram</TabsTrigger>
          <TabsTrigger value="usecase" data-testid="tab-usecase-diagram">Use Case Diagram</TabsTrigger>
          <TabsTrigger value="activity" data-testid="tab-activity-diagram">Activity Diagram</TabsTrigger>
        </TabsList>

        <TabsContent value="class">
          <ClassDiagramBuilder />
        </TabsContent>

        <TabsContent value="usecase">
          <UseCaseReference />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityDiagramReference />
        </TabsContent>
      </Tabs>
    </div>
  );
}
