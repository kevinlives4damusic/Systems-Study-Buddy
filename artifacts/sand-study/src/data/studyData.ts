export interface Concept {
  id: string;
  title: string;
  description: string;
  example?: string;
  keyPoints?: string[];
}

export interface Exercise {
  id: string;
  type: "classify" | "order" | "match" | "fill-blank" | "short-answer";
  question: string;
  items?: string[];
  categories?: string[];
  pairs?: Array<{ term: string; definition: string }>;
  blanks?: Array<{ blank: string; answer: string }>;
  sentence?: string;
  modelAnswer?: string;
  hint?: string;
}

export interface LearningUnit {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  color: string;
  concepts: Concept[];
  exercises: Exercise[];
}

export const UNITS: LearningUnit[] = [
  {
    id: "lu1",
    title: "Introduction to Systems Analysis & Design",
    shortTitle: "Intro to SA&D",
    description: "SDLC, iterative development, key diagrams, and the difference between analysis and design",
    color: "from-blue-600 to-blue-800",
    concepts: [
      {
        id: "lu1-c1",
        title: "Systems Analysis vs Systems Design",
        description: "Systems Analysis is about understanding WHAT a system must do — it focuses on gathering requirements, identifying problems, and defining what the new system needs to accomplish.\n\nSystems Design is about deciding HOW the system will be built — it translates requirements into blueprints: the architecture, data structures, interfaces, and components that developers will implement.\n\nRemember: Analysis = WHAT. Design = HOW.",
        example: "For 'Hire-a-Nanny': Analysis would identify that parents need to book nannies 24/7 and that data must be secure. Design would specify the booking form layout, the database structure, and the security mechanisms to use.",
        keyPoints: [
          "Analysis identifies problems and defines what is needed",
          "Design specifies the solution and how it will be built",
          "Analysis comes before Design in the SDLC",
          "Both are essential — analysis without design produces no solution; design without analysis solves the wrong problem"
        ]
      },
      {
        id: "lu1-c2",
        title: "The SDLC — System Development Life Cycle",
        description: "The SDLC is a structured process for developing information systems. Its purpose is to provide a systematic, organised approach that improves quality and reduces risk.\n\nThe five core phases are:\n1. Planning — define the project scope, feasibility, and resources\n2. Analysis — gather and define requirements (the WHAT)\n3. Design — create the technical blueprint (the HOW)\n4. Implementation — build, test, and deploy the system\n5. Support/Maintenance — operate and improve the system after deployment",
        example: "A company building an online university platform would: (1) Plan the project timeline and budget, (2) Analyse what students and lecturers need, (3) Design the database and screens, (4) Build and test the platform, then (5) Maintain it after launch.",
        keyPoints: [
          "SDLC stands for System Development Life Cycle",
          "Five phases: Planning, Analysis, Design, Implementation, Support",
          "Planning and Analysis are the most critical early phases",
          "Purpose: provide structure, reduce risk, improve quality"
        ]
      },
      {
        id: "lu1-c3",
        title: "Iterative vs Predictive (Waterfall) Development",
        description: "Predictive (Waterfall) Approach: All phases are planned upfront and completed sequentially. Each phase must finish before the next begins. Works well when requirements are stable and well-understood from the start.\n\nIterative/Incremental Approach: The system is built in repeated cycles called iterations. Each iteration produces a working increment of the system. Requirements can evolve between iterations. This is more flexible and is the basis of Agile methods.",
        example: "Waterfall for Hire-a-Nanny: Complete all requirements first, then all design, then all coding. Iterative: Build the booking feature in iteration 1, add nanny profiles in iteration 2, add payment in iteration 3.",
        keyPoints: [
          "Waterfall: sequential, fixed phases, plan-driven",
          "Iterative: cycles of development, flexible requirements",
          "Iterative better handles changing requirements",
          "Agile is a type of iterative approach"
        ]
      },
      {
        id: "lu1-c4",
        title: "Object-Oriented Design (OOD)",
        description: "Object-Oriented Design organises a system as a collection of interacting objects. Each object combines data (attributes) and behaviour (methods) into a single unit called a class.\n\nKey concepts:\n- Class: a blueprint/template defining attributes and methods\n- Object: an instance of a class\n- Encapsulation: hiding internal details, exposing only what's needed\n- Inheritance: a class inheriting attributes/methods from a parent class\n- Polymorphism: different objects responding to the same method in different ways",
        example: "A 'Nanny' class has attributes (name, qualifications, availability) and methods (register(), getAvailability()). Each individual nanny in the system is an object — an instance of the Nanny class.",
        keyPoints: [
          "OOD models systems as interacting objects",
          "A class is a blueprint; an object is an instance",
          "Key pillars: encapsulation, inheritance, polymorphism",
          "OOD produces UML class diagrams"
        ]
      },
      {
        id: "lu1-c5",
        title: "Subsystems",
        description: "A subsystem is a self-contained component of a larger system that performs a specific set of related functions. Dividing a system into subsystems makes it:\n- Easier to manage (each team focuses on one area)\n- Easier to test (subsystems can be tested independently)\n- More maintainable (changes in one subsystem have limited impact on others)\n- More specialised (experts can focus on their area)",
        example: "A university system has subsystems: Student Registration, Billing & Payments, Academic Records, and Library Management. Each operates semi-independently but shares data with the others.",
        keyPoints: [
          "Subsystems are components of a larger system",
          "Each performs a specific set of functions",
          "Benefits: manageability, independent testing, specialisation",
          "Subsystems communicate through defined interfaces"
        ]
      },
      {
        id: "lu1-c6",
        title: "Key Diagrams in SA&D",
        description: "SA&D uses standard UML diagrams to model different aspects of a system:\n\n- Use Case Diagram: shows actors and what they can do with the system (interactions)\n- Activity Diagram: models workflows and business processes (sequences of actions)\n- Class Diagram: shows classes, their attributes, methods, and relationships\n- Sequence Diagram: shows messages exchanged between objects over time\n- State Machine Diagram: shows how an object changes state in response to events\n- Data Flow Diagram (DFD): shows how data moves through a system (not UML but commonly used)",
        example: "For Hire-a-Nanny: A Use Case Diagram shows Parent booking a nanny; an Activity Diagram models the step-by-step booking workflow; a Class Diagram models Nanny, Parent, and Booking classes.",
        keyPoints: [
          "Use Case: who does what with the system",
          "Activity: step-by-step workflows",
          "Class: structure of objects and their relationships",
          "Sequence: message exchanges over time"
        ]
      }
    ],
    exercises: [
      {
        id: "lu1-e1",
        type: "classify",
        question: "LibraryPro is building a new online library management system. Classify each statement as either 'Systems Analysis' (WHAT) or 'Systems Design' (HOW).",
        items: [
          "Members must be able to search the catalogue by author, title, and genre",
          "The search results page will display book cover thumbnails and a 'Reserve' button",
          "The system must store each member's borrowing history and contact details",
          "Overdue notices will be sent via email using a nightly scheduled job",
          "The database will have a Loans table with a foreign key linking to the Members table",
          "Authentication will use a hashed password stored in the Members table"
        ],
        categories: ["Systems Analysis (WHAT)", "Systems Design (HOW)"]
      },
      {
        id: "lu1-e2",
        type: "order",
        question: "Drag the five SDLC phases into the correct order, from first to last.",
        items: ["Implementation", "Design", "Support / Maintenance", "Planning", "Analysis"]
      },
      {
        id: "lu1-e3",
        type: "match",
        question: "Match each diagram type to its purpose.",
        pairs: [
          { term: "Use Case Diagram", definition: "Shows actors and their interactions with the system" },
          { term: "Activity Diagram", definition: "Models workflows and sequences of actions in a process" },
          { term: "Class Diagram", definition: "Shows classes, attributes, methods, and relationships" },
          { term: "Sequence Diagram", definition: "Shows messages exchanged between objects over time" }
        ]
      },
      {
        id: "lu1-e4",
        type: "fill-blank",
        question: "Complete the following sentences about Analysis vs Design.",
        sentence: "Systems [BLANK1] focuses on WHAT the system must do, while Systems [BLANK2] focuses on HOW it will be built. [BLANK1] produces a requirements document, while [BLANK2] produces a technical blueprint. In the [BLANK3], Analysis comes before [BLANK2].",
        blanks: [
          { blank: "BLANK1", answer: "Analysis" },
          { blank: "BLANK2", answer: "Design" },
          { blank: "BLANK3", answer: "SDLC" }
        ]
      },
      {
        id: "lu1-e5",
        type: "short-answer",
        question: "A company wants to build a new help desk system. Briefly explain how an iterative development approach would be applied. Mention at least one advantage over the predictive approach. (4 marks)",
        modelAnswer: "In an iterative approach, the help desk system would be built in cycles called iterations. In iteration 1, the core incident logging feature could be built and reviewed. In iteration 2, the technical report workflow could be added. In iteration 3, the supervisor approval flow and reporting features could be completed.\n\nEach iteration produces a working version of the system that stakeholders can review and provide feedback on, allowing requirements to be refined.\n\nAdvantage over predictive: Unlike the waterfall approach, the iterative approach allows requirements to change between iterations. Stakeholders can see working software early and request adjustments — rather than waiting until the end to discover the system doesn't meet their needs.",
        hint: "Think about: what gets built in each cycle, when stakeholders see results, and what happens if requirements change"
      }
    ]
  },
  {
    id: "lu2",
    title: "Requirements & Stakeholders",
    shortTitle: "Requirements",
    description: "Functional vs non-functional requirements, stakeholders, use cases, and event decomposition",
    color: "from-violet-600 to-violet-800",
    concepts: [
      {
        id: "lu2-c1",
        title: "Functional vs Non-Functional Requirements",
        description: "Functional Requirements define what the system DOES — specific behaviours, functions, and data it must process. They describe system features.\n\nNon-Functional Requirements define HOW WELL the system does it — quality attributes that the system must have. They set standards for performance, security, reliability, and usability.\n\nNon-functional categories to remember: Performance, Security, Availability, Reliability, Usability, Scalability, Maintainability.",
        example: "Hire-a-Nanny examples:\n\nFunctional: 'A parent can make a booking at any time' | 'The system must store nanny qualifications'\n\nNon-Functional: 'The system must be available 24/7' (availability) | 'All personal data must be password protected' (security)",
        keyPoints: [
          "Functional = WHAT the system does (features and functions)",
          "Non-Functional = HOW WELL it does it (quality attributes)",
          "Non-functional categories: Performance, Security, Availability, Reliability, Usability",
          "Both types are equally important for a successful system"
        ]
      },
      {
        id: "lu2-c2",
        title: "Stakeholders",
        description: "A stakeholder is anyone who has an interest in or is affected by the system being developed.\n\nInternal Stakeholders: people inside the organisation — managers, employees, the IT department, the project team.\n\nExternal Stakeholders: people outside the organisation — customers, suppliers, regulatory bodies, business partners.\n\nIn systems development, stakeholder types include:\n- System Owner: funds and champions the project\n- System User: operates the system day-to-day\n- System Designer/Builder: technical team\n- IT Vendor: provides technology components\n- External Entity: outside parties that interact with the system",
        example: "Hire-a-Nanny stakeholders:\n- Internal: Management (system owner), Nannies (users), IT team (builders)\n- External: Parents (users/customers), Payment providers (vendors), Childcare regulatory bodies",
        keyPoints: [
          "Stakeholders = anyone with an interest in the system",
          "Internal = inside the organisation",
          "External = outside the organisation",
          "Each stakeholder provides different requirements insights",
          "The system analyst interviews stakeholders to gather requirements"
        ]
      },
      {
        id: "lu2-c3",
        title: "Use Cases and the User Goal Technique",
        description: "A use case describes a specific interaction between a user (actor) and the system to achieve a goal.\n\nUser Goal Technique: To find use cases, ask 'What tasks does each type of user need to accomplish?'\nStep 1: List all actor types (user types)\nStep 2: For each actor, list their goals (what they want to achieve)\nStep 3: Each goal becomes a use case\n\nFor example: Actor = Parent, Goals = Make a booking, Track booking confirmation, Update contact details, Download statement. Each goal is a use case.",
        example: "Hire-a-Nanny:\nActor: Parent → Use cases: Make Booking, Track Booking, Update Profile\nActor: Nanny → Use cases: Register Services, Manage Availability, View Bookings\nActor: Manager → Use cases: View Reports, Manage Nanny Profiles",
        keyPoints: [
          "A use case = one actor + one goal + system interaction",
          "User Goal Technique: list actors, then list their goals",
          "Each goal becomes a use case",
          "Use Case Diagram components: system boundary (rectangle), actors (stick figures), use cases (ovals)"
        ]
      },
      {
        id: "lu2-c4",
        title: "Use Case Descriptions",
        description: "A use case description documents a use case in detail. There are two levels:\n\nBrief Use Case Description: a single sentence or short paragraph summarising the interaction.\n\nFully Developed Use Case Description: a complete specification including:\n1. Use Case Name\n2. Actor(s)\n3. Trigger (what starts the use case)\n4. Pre-conditions (what must be true before it starts)\n5. Post-conditions (what is true after it completes)\n6. Main Success Scenario (the normal, successful flow of steps)\n7. Alternative Flows (variations)\n8. Exception Flows (error handling)\n9. Priority and Frequency",
        example: "Brief: 'The parent selects a date and time, the system finds available nannies, and the parent confirms a booking.'\n\nFully Developed would add: Pre-condition = Parent is logged in; Post-condition = Booking is saved and nanny is notified; Main flow = 1. Parent selects date, 2. System shows available nannies, 3. Parent selects nanny, 4. System confirms booking...",
        keyPoints: [
          "Brief = one-sentence summary",
          "Fully developed = complete narrative with all fields",
          "9 key components: name, actor, trigger, pre/post-conditions, main flow, alternative flows, exceptions, priority",
          "The main success scenario describes the 'happy path'"
        ]
      },
      {
        id: "lu2-c5",
        title: "Event Decomposition Technique",
        description: "The Event Decomposition Technique identifies use cases by analysing the events that the system must respond to.\n\nThree types of events:\n1. External Events: an external actor (user, system) sends data or a trigger to the system (e.g., 'Parent submits booking request')\n2. Temporal Events: triggered by the passage of time (e.g., 'At midnight, generate daily booking report')\n3. State Events: triggered when data reaches a certain state or condition (e.g., 'When booking status changes to Confirmed, send notification')\n\nEach event that the system must respond to is a use case.",
        example: "Help Desk System:\n- External: 'Consultant submits new incident' → 'Register Incident' use case\n- Temporal: 'Every Monday at 9am, generate weekly report' → 'Generate Weekly Report' use case\n- State: 'When incident status becomes Resolved, send closure notification' → 'Notify Customer of Resolution' use case",
        keyPoints: [
          "Event Decomposition identifies use cases from system events",
          "Three event types: External, Temporal, State",
          "External = triggered by an actor sending data",
          "Temporal = triggered by time",
          "State = triggered by data reaching a condition"
        ]
      }
    ],
    exercises: [
      {
        id: "lu2-e1",
        type: "classify",
        question: "CampusConnect is a new university student portal. Classify each requirement as Functional or Non-Functional.",
        items: [
          "A student must be able to register for modules online",
          "The portal must be available 24/7 during registration periods",
          "A lecturer must be able to upload course materials and announcements",
          "The system must load any page within 3 seconds on a standard broadband connection",
          "All student academic records must be encrypted at rest",
          "The system must send email notifications when final results are published"
        ],
        categories: ["Functional Requirement", "Non-Functional Requirement"]
      },
      {
        id: "lu2-e2",
        type: "classify",
        question: "MediBook is a new hospital appointment booking system. Classify each stakeholder as Internal or External.",
        items: [
          "Hospital Management",
          "Patients booking appointments",
          "General Practitioners (doctors)",
          "The hospital IT development team",
          "Medical aid / insurance providers",
          "National Department of Health (regulatory body)"
        ],
        categories: ["Internal Stakeholder", "External Stakeholder"]
      },
      {
        id: "lu2-e3",
        type: "match",
        question: "Match each use case description component to its definition.",
        pairs: [
          { term: "Pre-condition", definition: "What must be true before the use case can begin" },
          { term: "Post-condition", definition: "The state of the system after the use case completes successfully" },
          { term: "Trigger", definition: "The event that initiates the use case" },
          { term: "Main Success Scenario", definition: "The step-by-step normal/happy path of the interaction" },
          { term: "Alternative Flow", definition: "A variation of the normal path that still leads to success" }
        ]
      },
      {
        id: "lu2-e4",
        type: "match",
        question: "Match each event type from the Event Decomposition Technique to its example.",
        pairs: [
          { term: "External Event", definition: "A consultant submits a new incident to the help desk" },
          { term: "Temporal Event", definition: "Every Monday at 9am, the system generates a weekly report" },
          { term: "State Event", definition: "When a booking is confirmed, the system sends a notification to the nanny" }
        ]
      },
      {
        id: "lu2-e5",
        type: "short-answer",
        question: "CityRide is a new app that allows commuters to book city bus and minibus taxi rides in advance. Using the User Goal Technique, identify THREE use cases for the 'Commuter' actor. For each use case, state the actor, the goal, and the resulting use case name. (6 marks)",
        modelAnswer: "User Goal Technique applied to the Commuter actor:\n\n1. Actor: Commuter | Goal: Find a bus or taxi going to their destination at a specific time | Use Case: 'Search Available Rides'\n\n2. Actor: Commuter | Goal: Reserve a seat on a chosen ride so it is guaranteed | Use Case: 'Book Ride' or 'Reserve Seat'\n\n3. Actor: Commuter | Goal: Check whether their booked ride is still on schedule | Use Case: 'Track Ride Status'\n\n(Other valid answers: 'Cancel Booking', 'View Booking History', 'Update Payment Details', 'Rate Driver')\n\nThe technique works by: (1) identifying all actor types, (2) listing what each actor wants to achieve with the system, (3) turning each distinct goal into a named use case.",
        hint: "Think about what a commuter needs to DO with the app from the moment they plan a trip to after they arrive"
      }
    ]
  },
  {
    id: "lu3",
    title: "Systems Design",
    shortTitle: "Design",
    description: "The 5 design activities, usability, visibility & affordance, and UI design principles",
    color: "from-emerald-600 to-emerald-800",
    concepts: [
      {
        id: "lu3-c1",
        title: "The 5 Activities of Systems Design",
        description: "Systems Design consists of five major activities:\n\n1. Designing the System Architecture: Deciding the overall technical structure — client-server vs cloud, which platforms, how subsystems connect, deployment approach.\n\n2. Designing the Application Components: Specifying each module's inputs, processing logic, and outputs. Includes UI components, business logic, and integration points.\n\n3. Designing the User Interface: Creating screen layouts, navigation flows, forms, and reports. Determines what users see and interact with.\n\n4. Designing System Security and Controls: Specifying authentication mechanisms, authorisation rules, encryption standards, audit trails, and backup procedures.\n\n5. Designing the Database: Creating the data model — tables, columns, data types, relationships, normalisation, and indexing.",
        example: "For Hire-a-Nanny:\n1. Architecture: Web app hosted on cloud, REST API backend\n2. Components: Booking module, Nanny profile module, Notification module\n3. UI: Wireframes for booking form, nanny search results page\n4. Security: Login required, payment data encrypted, admin-only functions restricted\n5. Database: Tables for Parent, Nanny, Booking, Payment",
        keyPoints: [
          "5 activities: Architecture, Components, UI, Security, Database",
          "All five must be completed for a comprehensive design",
          "Architecture is usually done first as it shapes all other decisions",
          "Database design and UI design are often done in parallel"
        ]
      },
      {
        id: "lu3-c2",
        title: "User-Centred Design (UCD)",
        description: "User-Centred Design is a design philosophy where the needs, goals, and limitations of the end user are the primary driver of all design decisions.\n\nKey principles of UCD:\n1. Understand the users: Research who will use the system, what they need, their skill level, and context of use\n2. Involve users throughout: Include users in design reviews, prototype testing, and feedback sessions\n3. Evaluate designs with real users: Test prototypes with actual users before finalising\n4. Iterate based on feedback: Refine the design based on what users actually do, not what you assume they'll do\n\nUsability: The ease with which users can learn and use a system to achieve their goals. Dimensions: learnability, efficiency, memorability, low error rate, user satisfaction.",
        example: "For Hire-a-Nanny: UCD means interviewing parents to understand how they'd search for nannies, observing how they use competitor apps, testing a prototype booking form with real parents, and refining it based on where they get confused.",
        keyPoints: [
          "UCD = design driven by user needs, not technical preferences",
          "Four principles: understand, involve, evaluate, iterate",
          "Usability = how easily users achieve their goals",
          "Usability dimensions: learnability, efficiency, memorability, errors, satisfaction"
        ]
      },
      {
        id: "lu3-c3",
        title: "Visibility and Affordance",
        description: "Visibility: Important functions, options, and system states should be clearly visible to users. If a key function is hidden in a menu or requires users to know it exists, the design fails the visibility principle. Users should not have to guess what the system can do.\n\nAffordance: A design cue that communicates how an element should be used. Good affordance means the appearance of an element tells you how to interact with it.\n- A button looks clickable (raised, with a label)\n- A text input looks editable (has a box, a cursor appears on hover)\n- A slider looks draggable (has a track and a thumb)\n- An underlined blue link looks clickable\n\nBoth visibility and affordance reduce errors, improve usability, and make a system more intuitive.",
        example: "Poor visibility: The 'Cancel Booking' option is buried in Account Settings > History > Actions. Better: A 'Cancel' button appears directly on the booking confirmation screen.\n\nPoor affordance: A clickable area styled as plain text. Better: Style it as a button with a border and hover effect so users know it's interactive.",
        keyPoints: [
          "Visibility: important functions must be clearly visible",
          "Affordance: element appearance communicates how to use it",
          "Both reduce user errors and improve learnability",
          "Poor visibility = users can't find functions; poor affordance = users don't know how to use elements"
        ]
      },
      {
        id: "lu3-c4",
        title: "Design Principles: Separation of Responsibilities & Protection from Variations",
        description: "Separation of Responsibilities (also called Separation of Concerns): Each module/component should have one clear responsibility. A module that handles database access should not also generate UI output. This makes components easier to test, maintain, and replace.\n\nProtection from Variations: Shield components from changes in other components by using stable interfaces (abstractions). If the database changes from MySQL to PostgreSQL, no other component should need to change — only the data access layer changes. This is achieved through interfaces, abstract classes, and service layers.",
        example: "Separation: The Booking Service only manages bookings. The Email Service only sends emails. The Database Repository only handles data access.\n\nProtection from Variations: The BookingRepository interface stays the same even if you switch from a relational DB to a NoSQL DB. Other components talk to the interface, not the implementation.",
        keyPoints: [
          "Separation of Responsibilities: one module = one job",
          "Protection from Variations: use interfaces to isolate change",
          "Separation makes testing and maintenance easier",
          "Protection from Variations means changing one thing doesn't break others"
        ]
      },
      {
        id: "lu3-c5",
        title: "Designing for Web vs Mobile",
        description: "Key considerations when designing for Web and Mobile:\n\n1. Screen Size: Mobile screens are much smaller — prioritise the most important content, remove clutter, use larger text and touch targets (minimum 44px)\n\n2. Navigation Patterns: Web often uses horizontal nav bars and sidebars; mobile uses bottom navigation bars, hamburger menus, or tab bars\n\n3. Touch vs Click: Mobile users use fingers (imprecise); web users use a mouse (precise). Touch targets must be larger and more spaced out\n\n4. Information Density: Web can show more information; mobile should show less and allow users to drill down\n\n5. Bandwidth and Performance: Mobile users may be on slower connections; optimise images and reduce page weight\n\n6. Responsiveness: Many systems now require responsive design that adapts to any screen size",
        example: "Hire-a-Nanny: On desktop, show a full booking form with all fields. On mobile, break it into a wizard with one step per screen. On mobile, replace the top navigation with a bottom tab bar.",
        keyPoints: [
          "Mobile: smaller screens, touch targets min 44px, simpler navigation",
          "Web: more information density, hover states, larger screens",
          "Both must consider: usability, accessibility, and performance",
          "Responsive design adapts layout to screen size"
        ]
      }
    ],
    exercises: [
      {
        id: "lu3-e1",
        type: "match",
        question: "Match each of the 5 Systems Design activities to its description.",
        pairs: [
          { term: "System Architecture Design", definition: "Deciding the overall technical structure, platforms, and how subsystems connect" },
          { term: "Application Components Design", definition: "Specifying each module's inputs, processing logic, and outputs" },
          { term: "User Interface Design", definition: "Creating screen layouts, navigation flows, forms, and reports" },
          { term: "Security & Controls Design", definition: "Specifying authentication, authorisation, encryption, and audit trails" },
          { term: "Database Design", definition: "Creating the data model — tables, columns, relationships, and normalisation" }
        ]
      },
      {
        id: "lu3-e2",
        type: "classify",
        question: "ShopEasy is an e-commerce platform. Classify each UI scenario as a Visibility Problem, an Affordance Problem, or Good Design.",
        items: [
          "The 'Add to Cart' button is only visible after scrolling past all product reviews",
          "A 'Buy Now' link is styled as plain grey text with no underline or border",
          "The checkout progress indicator clearly shows 'Step 2 of 4' at the top of the page",
          "Product images show a small zoom icon on hover, indicating they can be enlarged",
          "The order tracking feature is hidden under Account > Settings > Orders > History",
          "The currency selector has a visible dropdown arrow showing it can be expanded"
        ],
        categories: ["Visibility Problem", "Affordance Problem", "Good Design"]
      },
      {
        id: "lu3-e3",
        type: "fill-blank",
        question: "Complete the following about usability and design.",
        sentence: "[BLANK1] is the ease with which users can achieve their goals using a system. [BLANK2] means important functions are clearly visible to users. [BLANK3] is a design cue that communicates how an element should be used. [BLANK4] of Responsibilities means each module has one clear job.",
        blanks: [
          { blank: "BLANK1", answer: "Usability" },
          { blank: "BLANK2", answer: "Visibility" },
          { blank: "BLANK3", answer: "Affordance" },
          { blank: "BLANK4", answer: "Separation" }
        ]
      },
      {
        id: "lu3-e4",
        type: "short-answer",
        question: "FoodNow is a food delivery app used by customers to browse restaurants, place orders, and track deliveries. Describe TWO things you would consider when designing the user interface for both the Web and Mobile versions of FoodNow. (4 marks)",
        modelAnswer: "1. Screen Size and Information Density: On a desktop browser, the FoodNow landing page can display a grid of restaurant cards, a search bar, filters, and promotional banners all on one screen. On mobile, the screen is much smaller, so only a search bar and a scrollable list of nearby restaurants should be visible without scrolling. The order flow should be a step-by-step wizard on mobile (choose restaurant → select items → checkout), whereas on web all steps can share a single wider layout.\n\n2. Navigation and Touch Input: The web version can use a top navigation bar with links to Home, My Orders, and Account. On mobile, a bottom navigation bar is more appropriate — it is within reach of the thumb and follows iOS/Android conventions. Additionally, all tappable elements (buttons, menu items) must be at least 44×44px on mobile to accommodate finger input accurately, whereas on web, smaller targets are acceptable since a mouse cursor is precise.\n\n(Other valid answers: bandwidth and image optimisation for mobile networks, push notifications for delivery tracking on mobile, responsive layout breakpoints)",
        hint: "Think about: how are a 5-inch phone screen and a 15-inch laptop screen different? What happens to the menu and the order process?"
      }
    ]
  },
  {
    id: "lu4",
    title: "Methodologies & Project Management",
    shortTitle: "Methodologies",
    description: "System development methodologies, Agile development, and the PMBOK knowledge areas",
    color: "from-amber-600 to-amber-800",
    concepts: [
      {
        id: "lu4-c1",
        title: "System Development Methodology",
        description: "A system development methodology is a formalised, structured approach to developing information systems. It provides a common framework that teams follow to ensure consistency and quality.\n\nA methodology has THREE components:\n\n1. Process: the sequence of phases and activities to be followed\n   Examples: Planning, Analysis, Design, Implementation, Maintenance\n\n2. Deliverables: the tangible outputs produced at each phase\n   Examples: Project Charter, Requirements Document, System Design Specification, Test Plan, Deployed System\n\n3. Tools & Techniques: the methods used to complete each activity\n   Examples: Use Case Diagrams, Entity-Relationship Diagrams, Prototyping, CASE tools, Interviews, Surveys",
        example: "Examples of methodologies: Waterfall (predictive), Agile/Scrum (iterative), RAD (Rapid Application Development), RUP (Rational Unified Process).",
        keyPoints: [
          "Methodology = structured approach to system development",
          "3 components: Process, Deliverables, Tools & Techniques",
          "Process = sequence of activities/phases",
          "Deliverables = outputs at each phase",
          "Tools & Techniques = methods used to complete activities"
        ]
      },
      {
        id: "lu4-c2",
        title: "Agile Development",
        description: "Agile is an iterative, incremental approach to software development that values flexibility and collaboration over rigid planning.\n\nThe Agile Manifesto (2001) defines 4 core values:\n1. Individuals and interactions OVER processes and tools\n2. Working software OVER comprehensive documentation\n3. Customer collaboration OVER contract negotiation\n4. Responding to change OVER following a plan\n\nNote: The items on the right still have value — Agile just values the items on the left MORE.\n\nScrum (a popular Agile framework) has 3 roles:\n- Product Owner: defines and prioritises requirements (the backlog)\n- Scrum Master: facilitates the team, removes obstacles\n- Development Team: builds the product in sprints (usually 2-4 weeks each)",
        example: "Dawn Help Desk Corporation adopts Agile: Instead of writing a 200-page requirements document, the Product Owner creates a prioritised backlog of features. The team delivers working software every 2 weeks. If the help desk consultants want to change how incidents are logged after sprint 1, the team can accommodate this in sprint 2.",
        keyPoints: [
          "Agile: iterative, flexible, customer-focused",
          "4 Agile values: Individuals, Working software, Customer collaboration, Responding to change",
          "Scrum roles: Product Owner, Scrum Master, Development Team",
          "Sprint: a time-boxed iteration (usually 2-4 weeks)"
        ]
      },
      {
        id: "lu4-c3",
        title: "PMBOK — Project Management Body of Knowledge",
        description: "PMBOK is a standard guide for project management published by PMI (Project Management Institute). It defines 10 knowledge areas that every project manager should address:\n\n1. Integration Management: coordinating all aspects of the project\n2. Scope Management: defining what is and isn't included (preventing scope creep)\n3. Schedule Management: planning and controlling the project timeline\n4. Cost Management: budgeting and controlling project costs\n5. Quality Management: ensuring deliverables meet required standards\n6. Resource Management: managing people, equipment, and materials\n7. Communications Management: ensuring the right information reaches the right people\n8. Risk Management: identifying, assessing, and responding to project risks\n9. Procurement Management: acquiring goods and services from outside the organisation\n10. Stakeholder Management: identifying stakeholders and managing their engagement",
        example: "For the Online University Platform project:\n- Scope Management: clearly define that the mobile app is Phase 2 — not Phase 1\n- Risk Management: identify that team members may leave mid-project and plan a mitigation strategy\n- Stakeholder Management: ensure students, lecturers, and the HoD are all kept informed of project progress",
        keyPoints: [
          "PMBOK: 10 knowledge areas for project management",
          "Integration, Scope, Schedule, Cost, Quality, Resource",
          "Communications, Risk, Procurement, Stakeholder",
          "Know at least 6-7 areas with their descriptions for the exam"
        ]
      }
    ],
    exercises: [
      {
        id: "lu4-e1",
        type: "match",
        question: "Match each methodology component to its definition and an example.",
        pairs: [
          { term: "Process", definition: "The ordered sequence of phases and activities — e.g., Planning → Analysis → Design → Implementation" },
          { term: "Deliverables", definition: "Tangible outputs produced at each phase — e.g., Requirements Document, System Design Specification" },
          { term: "Tools & Techniques", definition: "Methods used to complete activities — e.g., Use Case Diagrams, Interviews, Prototyping" }
        ]
      },
      {
        id: "lu4-e2",
        type: "fill-blank",
        question: "Complete the 4 Agile values from the Agile Manifesto. Each value follows the format 'X over Y'.",
        sentence: "[BLANK1] and interactions over processes and tools. Working [BLANK2] over comprehensive documentation. Customer [BLANK3] over contract negotiation. Responding to [BLANK4] over following a plan.",
        blanks: [
          { blank: "BLANK1", answer: "Individuals" },
          { blank: "BLANK2", answer: "software" },
          { blank: "BLANK3", answer: "collaboration" },
          { blank: "BLANK4", answer: "change" }
        ]
      },
      {
        id: "lu4-e3",
        type: "match",
        question: "Match each PMBOK knowledge area to its description.",
        pairs: [
          { term: "Scope Management", definition: "Defining what is and isn't included in the project to prevent scope creep" },
          { term: "Risk Management", definition: "Identifying, assessing, and planning responses to potential project threats" },
          { term: "Stakeholder Management", definition: "Identifying all parties with an interest and managing their engagement throughout" },
          { term: "Quality Management", definition: "Ensuring all project deliverables meet the required standards and acceptance criteria" },
          { term: "Schedule Management", definition: "Planning and controlling the project timeline and ensuring on-time delivery" },
          { term: "Cost Management", definition: "Estimating, budgeting, and controlling project expenditure" }
        ]
      },
      {
        id: "lu4-e4",
        type: "short-answer",
        question: "Briefly discuss the concept of a system development methodology. Your answer must include: (a) a general description, (b) a description of each of the 3 components, and (c) one example for each component. (9 marks)",
        modelAnswer: "A system development methodology is a formalised, structured approach to developing information systems. It provides teams with a common framework to follow, ensuring consistency, quality, and reduced risk across the development process.\n\nThe three components are:\n\n(a) Process: The ordered sequence of phases and activities that the development team follows. It defines WHEN things are done. Example: Planning → Analysis → Design → Implementation → Maintenance\n\n(b) Deliverables: The tangible outputs produced at the end of each phase that serve as evidence of progress. Example: Requirements Specification Document (from Analysis phase), System Design Document (from Design phase), Deployed Application (from Implementation phase)\n\n(c) Tools and Techniques: The methods, tools, and approaches used to carry out the activities within each phase. Example: Use Case Diagrams (for analysis), Entity-Relationship Diagrams (for database design), CASE tools (for modelling), User Interviews and Surveys (for requirements gathering)",
        hint: "Structure your answer with three clearly labelled sections — one for each component"
      }
    ]
  },
  {
    id: "lu5",
    title: "OO Design, Databases & Testing",
    shortTitle: "Design & Testing",
    description: "Design class diagrams, database design, software testing types, encryption, and access control",
    color: "from-rose-600 to-rose-800",
    concepts: [
      {
        id: "lu5-c1",
        title: "Design Class Diagrams",
        description: "A Design Class Diagram is a UML diagram that shows classes with full implementation detail.\n\nA class has three compartments:\n1. Class Name (top)\n2. Attributes (middle): visibility name: dataType\n3. Methods (bottom): visibility name(parameters): returnType\n\nVisibility symbols:\n+ public (accessible from anywhere)\n- private (accessible only within the class)\n# protected (accessible within the class and subclasses)\n\nData types: String, Integer, Boolean, Date, Double, void\n\nMethod signature example: + setAvailability(available: Boolean): void\nThis means: public method, named setAvailability, takes a Boolean parameter, returns nothing (void)",
        example: "Nanny Class:\n───────────────────\n       Nanny\n───────────────────\n- name: String\n- surname: String\n- age: Integer\n- qualifications: String\n- availability: Boolean\n───────────────────\n+ register(): void\n+ getAvailability(): Boolean\n+ updateDetails(name: String): void\n+ getQualifications(): String\n+ setAvailability(available: Boolean): void\n───────────────────",
        keyPoints: [
          "Three compartments: class name, attributes, methods",
          "Visibility: + public, - private, # protected",
          "Attribute format: visibility name: DataType",
          "Method format: visibility name(params): returnType",
          "void return type = method returns nothing"
        ]
      },
      {
        id: "lu5-c2",
        title: "Database Design",
        description: "A Database is an organised, structured collection of data stored electronically.\n\nA DBMS (Database Management System) is the software that manages access to the database. It processes queries, enforces rules, manages users, and handles backups.\n\nExamples of DBMS: MySQL, PostgreSQL, Microsoft SQL Server, Oracle Database\n\nHow a DBMS interface works: A user or application submits an SQL query → The DBMS parses and validates the query → The query engine retrieves/modifies data in the storage engine → The DBMS returns a result set → The application displays the data.\n\nFactors influencing WHEN to design the database:\n- When requirements are stable enough to define data structures\n- When the system architecture has been decided\n- When existing databases need to be integrated\n- Based on team expertise and project timeline",
        example: "Hire-a-Nanny database:\n- Parent table: parentId (PK), name, email, phone\n- Nanny table: nannyId (PK), name, qualifications, availability\n- Booking table: bookingId (PK), parentId (FK), nannyId (FK), date, status",
        keyPoints: [
          "Database = organised collection of data",
          "DBMS = software managing the database (MySQL, PostgreSQL, Oracle)",
          "DBMS processes SQL queries and returns result sets",
          "Design database when requirements and architecture are stable"
        ]
      },
      {
        id: "lu5-c3",
        title: "Encryption and Access Control",
        description: "Encryption: Converting plaintext data into unreadable ciphertext using an algorithm and a key. Only authorised parties with the correct decryption key can read the data.\n- Encryption: plaintext → ciphertext (securing the data)\n- Decryption: ciphertext → plaintext (recovering the data)\n- Importance: protects data at rest (in the database) and in transit (over networks)\n\nAccess Control relies on THREE elements:\n1. Authentication: verifying WHO you are — proving your identity (username/password, biometrics, 2FA)\n2. Authorisation: determining WHAT you are allowed to do — permissions and roles (admin can delete; regular user can only view)\n3. Accountability / Auditing: tracking WHAT WAS DONE — audit logs record who did what and when, enabling forensic investigation",
        example: "Hire-a-Nanny:\n- Authentication: Parents log in with email and password\n- Authorisation: Parents can only see their own bookings; Management can see all bookings and edit nanny profiles\n- Accountability: Every login attempt and booking change is logged with timestamp and user ID",
        keyPoints: [
          "Encryption protects data confidentiality",
          "Encryption: plaintext → ciphertext; Decryption: ciphertext → plaintext",
          "Access control = Authentication + Authorisation + Accountability",
          "Authentication = who are you? Authorisation = what can you do? Accountability = what did you do?"
        ]
      },
      {
        id: "lu5-c4",
        title: "Software Testing Types",
        description: "Software must be tested rigorously before deployment. Key testing types:\n\n1. Unit Testing: Testing individual functions/components in isolation. Developers usually write and run these.\n\n2. Integration Testing: Testing how multiple components work together. Catches interface errors between modules.\n\n3. System Testing: Testing the complete, integrated system against all requirements.\n\n4. User Acceptance Testing (UAT): Business stakeholders verify that the system meets their requirements and is fit for purpose. This is the final check before go-live.\n\n5. Performance / Stress Testing: Testing the system under heavy load. Time-based criteria: response time (how fast?), throughput (how many requests per second?), load capacity (how many concurrent users?).\n\n6. Regression Testing: Re-testing after changes to ensure new code hasn't broken existing functionality.",
        example: "Online University Platform: Unit tests verify the 'calculate grade' function. Integration tests verify the grade calculation integrates correctly with the results database. UAT has lecturers and students verify the full system. Performance tests simulate 10,000 students accessing the platform simultaneously.",
        keyPoints: [
          "Unit = individual components; Integration = components together",
          "System = full system; UAT = stakeholders verify against requirements",
          "Performance = testing under load (response time, throughput, concurrent users)",
          "Regression = re-test after changes to prevent regressions"
        ]
      },
      {
        id: "lu5-c5",
        title: "Technology vs Application Architecture",
        description: "Technology Architecture: Defines the physical and infrastructure layer — the hardware, servers, networks, operating systems, middleware, and cloud platforms that the system runs on.\nExamples: 'The system will run on AWS EC2 instances behind a load balancer, using Ubuntu Server OS and an Nginx web server.'\n\nApplication Architecture: Defines how the software components are structured, how they interact, and the design patterns used.\nExamples: 'The application follows a three-tier architecture (Presentation, Business Logic, Data layers) using the MVC pattern, with a REST API connecting the frontend to the backend.'\n\nThink: Technology Architecture = the building (walls, electricity, plumbing); Application Architecture = the floor plan (where rooms go and how they connect).",
        example: "Online University Platform:\n- Technology Architecture: AWS cloud hosting, MySQL database server, Ubuntu Linux, SSL certificates for HTTPS\n- Application Architecture: React frontend, Node.js Express backend, REST API, MVC pattern, microservices for grading and notifications",
        keyPoints: [
          "Technology Architecture = physical infrastructure (hardware, OS, network, middleware)",
          "Application Architecture = software structure (components, patterns, layers)",
          "Technology = HOW it's hosted; Application = HOW it's built",
          "Common application patterns: MVC, three-tier, microservices"
        ]
      }
    ],
    exercises: [
      {
        id: "lu5-e1",
        type: "classify",
        question: "SafePay is a new online banking system. Classify each testing activity into the correct test type.",
        items: [
          "A developer tests the 'calculateInterest()' function with various account balances",
          "The team verifies that the transfer module correctly updates both sender and recipient account balances",
          "Bank compliance officers confirm the complete system meets all regulatory requirements",
          "The team simulates 10,000 simultaneous logins to measure authentication response time",
          "After patching a security vulnerability, all 847 existing test cases are re-run",
          "The fully assembled banking system is tested against the complete requirements specification"
        ],
        categories: ["Unit Testing", "Integration Testing", "System Testing", "UAT", "Performance Testing", "Regression Testing"]
      },
      {
        id: "lu5-e2",
        type: "match",
        question: "Match each access control element to its definition.",
        pairs: [
          { term: "Authentication", definition: "Verifying the identity of a user — proving who they are (e.g., username/password, biometrics)" },
          { term: "Authorisation", definition: "Determining what an authenticated user is allowed to do — their permissions and roles" },
          { term: "Accountability", definition: "Tracking what users have done — audit logs recording actions, times, and users" }
        ]
      },
      {
        id: "lu5-e3",
        type: "fill-blank",
        question: "Complete the sentences about encryption and databases.",
        sentence: "[BLANK1] converts plaintext into ciphertext to protect data. The reverse process, [BLANK2], converts ciphertext back to plaintext. A [BLANK3] is an organised collection of data, while a [BLANK4] is the software that manages access to it. Examples of a DBMS include MySQL and [BLANK5].",
        blanks: [
          { blank: "BLANK1", answer: "Encryption" },
          { blank: "BLANK2", answer: "Decryption" },
          { blank: "BLANK3", answer: "Database" },
          { blank: "BLANK4", answer: "DBMS" },
          { blank: "BLANK5", answer: "PostgreSQL" }
        ]
      },
      {
        id: "lu5-e4",
        type: "short-answer",
        question: "When a doctor registers with MediBook, they provide their name, surname, specialisation, years of experience, and availability status. Create a design class diagram for a class called 'Doctor'. Show: (a) five attributes with visibility and data type, and (b) five method signatures with correct return types. (16 marks)",
        modelAnswer: "┌──────────────────────────────────────────┐\n│                 Doctor                   │\n├──────────────────────────────────────────┤\n│ - name: String                           │\n│ - surname: String                        │\n│ - specialisation: String                 │\n│ - yearsExperience: Integer               │\n│ - available: Boolean                     │\n├──────────────────────────────────────────┤\n│ + register(): void                       │\n│ + getName(): String                      │\n│ + getSpecialisation(): String            │\n│ + isAvailable(): Boolean                 │\n│ + setAvailability(status: Boolean): void │\n└──────────────────────────────────────────┘\n\nKey points:\n- All 5 attributes use private visibility (-)\n- Correct data types: String for text fields, Integer for numeric values, Boolean for true/false flags\n- All 5 methods use public visibility (+)\n- Every method includes a return type after the colon\n- Getter methods return the type of the attribute they retrieve\n- void return type means the method performs an action but returns nothing\n- Parameters are written as: paramName: DataType inside the brackets",
        hint: "Remember the three compartments: ClassName | - attributes: DataType | + methods(params): ReturnType. Use - for attributes, + for methods."
      }
    ]
  }
];
