export interface SubQuestion {
  id: string;
  number: string;
  marks: number;
  question: string;
  modelAnswer: string;
  keyPoints: string[];
}

export interface ExamScenario {
  id: string;
  title: string;
  year: string;
  totalMarks: number;
  scenario: string;
  questions: Array<{
    id: string;
    number: string;
    totalMarks: number;
    subQuestions: SubQuestion[];
  }>;
}

export const EXAM_SCENARIOS: ExamScenario[] = [
  {
    id: "exam1",
    title: "Hire-a-Nanny System",
    year: "2024 — SAND6221",
    totalMarks: 120,
    scenario: "Hire-a-Nanny is a company that allows parents to hire a qualified nanny at short notice. Over the past couple of months, they have noticed that their customer base has grown exponentially, and they have realised the need for an information system to help keep track of bookings and customer interactions.\n\nParents do not always have the time to book a Nanny during office hours — the system must be available 24/7. As the system will store personal details and payment information of parents, the data in the database should be password protected.\n\nFor management, the system would bring greater efficiency. For nannies, it will provide a controlled environment to offer their expertise and manage their time. For parents, it will ensure peace-of-mind.",
    questions: [
      {
        id: "exam1-q1",
        number: "Question 1",
        totalMarks: 15,
        subQuestions: [
          {
            id: "exam1-q1-1",
            number: "Q1.1",
            marks: 6,
            question: "In terms of 'Hire-a-Nanny', provide a brief description of what 'Systems Analysis' and 'Systems Design' entail. Then explain the role each will play in developing the new system.",
            modelAnswer: "Systems Analysis involves investigating and understanding the current situation and defining WHAT the new system must do. For Hire-a-Nanny, this means gathering requirements from management, nannies, and parents — determining that the system must handle booking management, nanny profiles, customer records, and 24/7 availability.\n\nSystems Design involves creating the technical blueprint for HOW the system will be built. For Hire-a-Nanny, this means designing the database structure (tables for Parents, Nannies, Bookings), the user interfaces (booking form, nanny search), and the security architecture (password protection, payment data encryption).\n\nRole of Analysis: It ensures the development team builds the RIGHT system by clearly defining all requirements before any coding begins. Without analysis, the system might not meet the actual needs of parents, nannies, and management.\n\nRole of Design: It ensures the system is built CORRECTLY and efficiently. It translates the requirements into detailed technical specifications that developers can implement, reducing errors and rework.",
            keyPoints: [
              "Systems Analysis = WHAT the system must do (requirements gathering, problem definition)",
              "Systems Design = HOW the system will be built (technical blueprint)",
              "Analysis role for Hire-a-Nanny: identify booking/customer/nanny management requirements",
              "Design role for Hire-a-Nanny: specify database, UI, and security designs",
              "Analysis ensures the right system is built; Design ensures it's built correctly",
              "Both applied to the specific Hire-a-Nanny context"
            ]
          },
          {
            id: "exam1-q1-2",
            number: "Q1.2",
            marks: 7,
            question: "Briefly explain how an iterative development approach can be followed during the development of the 'Hire-a-Nanny' system.",
            modelAnswer: "An iterative development approach means the Hire-a-Nanny system would be built in repeated cycles called iterations, each producing a working increment of the system.\n\nIteration 1: The core booking feature could be built — parents can log in, browse nannies, and make a basic booking. At the end of this iteration, management and parents review the working feature and provide feedback.\n\nIteration 2: Based on feedback, refine the booking feature and add nanny profile management — nannies can register, set their qualifications, and manage their availability.\n\nIteration 3: Add payment processing, email notifications, and the booking confirmation tracking feature.\n\nIteration 4: Add reporting for management and any remaining features identified in earlier reviews.\n\nThis approach is beneficial for Hire-a-Nanny because:\n- Stakeholders see working software early and can verify it meets their needs\n- Requirements can be refined as the team learns more\n- Risk is reduced — if a feature doesn't work, it's caught early\n- The most critical features (booking and authentication) are delivered first",
            keyPoints: [
              "Iterative = building in repeated cycles (iterations)",
              "Each iteration produces a working increment",
              "At least 3 specific iterations described for Hire-a-Nanny",
              "Stakeholder review and feedback between iterations",
              "Benefits: early working software, flexible requirements, reduced risk",
              "Most critical features delivered first"
            ]
          },
          {
            id: "exam1-q1-3",
            number: "Q1.3",
            marks: 2,
            question: "Identify any two (2) diagrams that will be created during the analysis and design of the 'Hire-a-Nanny' system.",
            modelAnswer: "Two diagrams that will be created:\n\n1. Use Case Diagram — to show the different actors (Parent, Nanny, Manager) and their interactions with the system (booking, profile management, reporting). This is created during the Analysis phase to document requirements.\n\n2. Class Diagram — to show the classes (Nanny, Parent, Booking), their attributes, methods, and relationships. This is created during the Design phase to model the object-oriented structure of the system.\n\n(Other valid answers: Activity Diagram, Sequence Diagram, State Machine Diagram, Entity-Relationship Diagram)",
            keyPoints: [
              "Any 2 of: Use Case Diagram, Class Diagram, Activity Diagram, Sequence Diagram, State Machine Diagram, DFD",
              "1 mark per correctly named diagram",
              "Diagrams must be relevant to SA&D (not invented diagrams)"
            ]
          }
        ]
      },
      {
        id: "exam1-q2",
        number: "Question 2",
        totalMarks: 35,
        subQuestions: [
          {
            id: "exam1-q2-1",
            number: "Q2.1",
            marks: 10,
            question: "Explain the difference between functional and non-functional requirements. Substantiate with TWO examples of each from the Hire-a-Nanny scenario.",
            modelAnswer: "Functional Requirements define WHAT the system does — the specific behaviours, functions, and operations the system must perform. They describe the features and capabilities the system provides to its users.\n\nNon-Functional Requirements define HOW WELL the system does it — the quality attributes and constraints the system must satisfy. They set standards for performance, security, reliability, and usability.\n\nFunctional Requirements from the Hire-a-Nanny scenario:\n1. A parent must be able to make a booking or track the confirmation of a booking at a time suitable to them (system provides a booking function and tracking function)\n2. The system must allow nannies to manage their availability and offer their expertise according to a schedule (system provides nanny availability management)\n\nNon-Functional Requirements from the Hire-a-Nanny scenario:\n1. The system must be available 24/7 (availability — a quality attribute about when the system operates, not what it does)\n2. The data in the database should be password protected (security — a quality attribute about how data is protected, not what the system does with data)",
            keyPoints: [
              "Functional = WHAT the system does (features, behaviours, functions)",
              "Non-Functional = HOW WELL it does it (quality attributes: performance, security, availability)",
              "Functional example 1 from scenario: booking/tracking at any time",
              "Functional example 2 from scenario: nanny availability management",
              "Non-Functional example 1 from scenario: 24/7 availability",
              "Non-Functional example 2 from scenario: password-protected data",
              "Clear explanation of the difference between the two types",
              "Examples clearly linked back to the provided scenario"
            ]
          },
          {
            id: "exam1-q2-2",
            number: "Q2.2",
            marks: 9,
            question: "From the scenario, identify any three (3) stakeholders. Provide one piece of information each stakeholder can give you as a Systems Analyst to help clarify requirements.",
            modelAnswer: "Stakeholder 1: Parents (External stakeholder — customer)\nInformation they can provide: Parents can tell the systems analyst what features they need most urgently — for example, the ability to filter nannies by availability, location, and qualifications. They can also describe pain points with the current manual booking process.\n\nStakeholder 2: Nannies (External stakeholder — service provider/user)\nInformation they can provide: Nannies can explain how they currently manage their availability and what information they need to see about a booking (parent location, child age, hours required). This helps define the nanny-facing features and the data to capture.\n\nStakeholder 3: Hire-a-Nanny Management (Internal stakeholder — system owner)\nInformation they can provide: Management can clarify the business rules — for example, how nannies are vetted and approved, what the commission structure is, and what reports they need to manage operations. They also define the priority of features and the budget/timeline.",
            keyPoints: [
              "3 distinct stakeholders identified from the scenario",
              "Each stakeholder classified (internal/external is a bonus)",
              "Meaningful, specific information from each stakeholder",
              "Information must relate to clarifying system requirements",
              "3 marks per stakeholder (1 for identification, 2 for information)"
            ]
          },
          {
            id: "exam1-q2-3",
            number: "Q2.3",
            marks: 10,
            question: "Using the user goal technique, show how use cases can be identified for the new Hire-a-Nanny system.",
            modelAnswer: "The User Goal Technique identifies use cases by asking: 'What tasks does each type of user need to accomplish?'\n\nStep 1: Identify the actor types (users of the system)\n- Parent\n- Nanny\n- System Administrator / Manager\n\nStep 2: For each actor, list their goals\n\nParent's goals:\n1. Find an available nanny → Use Case: Search for Nanny\n2. Book a nanny → Use Case: Make Booking\n3. Check if their booking was confirmed → Use Case: Track Booking Confirmation\n4. Update personal contact details → Use Case: Update Profile\n\nNanny's goals:\n1. Register on the platform → Use Case: Register Services\n2. Set working hours and available dates → Use Case: Manage Availability\n3. View upcoming bookings → Use Case: View Bookings\n\nManager's goals:\n1. Approve new nanny registrations → Use Case: Approve Nanny\n2. View business performance reports → Use Case: Generate Reports\n\nThe User Goal Technique is effective because it grounds use case discovery in real user needs rather than system features, ensuring every identified use case has genuine user value.",
            keyPoints: [
              "Correctly names the User Goal Technique",
              "Explains the technique: identify actors → list their goals → each goal = use case",
              "Identifies at least 2 actor types",
              "Lists at least 3 goals for at least one actor",
              "Correctly names resulting use cases",
              "Applied specifically to the Hire-a-Nanny context"
            ]
          },
          {
            id: "exam1-q2-4",
            number: "Q2.4",
            marks: 6,
            question: "Identify any six (6) pieces of data that form part of a use case description.",
            modelAnswer: "Six components of a use case description:\n1. Use Case Name — the name/title of the use case (e.g., 'Make Booking')\n2. Actor(s) — who initiates and participates in the use case (e.g., Parent)\n3. Trigger — the event that starts the use case (e.g., Parent selects 'Book a Nanny')\n4. Pre-conditions — what must be true before the use case can begin (e.g., Parent must be logged in)\n5. Post-conditions — the state after the use case completes successfully (e.g., Booking is saved and nanny is notified)\n6. Main Success Scenario — the step-by-step normal flow of the interaction",
            keyPoints: [
              "1 mark per correct component (any 6 of 9)",
              "Other valid answers: Alternative Flows, Exception Flows, Priority/Frequency",
              "Components must be named correctly — not invented"
            ]
          }
        ]
      },
      {
        id: "exam1-q3",
        number: "Question 3",
        totalMarks: 20,
        subQuestions: [
          {
            id: "exam1-q3-1",
            number: "Q3.1",
            marks: 15,
            question: "Describe the five (5) activities that form part of Systems Design.",
            modelAnswer: "The five major Systems Design activities are:\n\n1. Designing the System Architecture (3 marks): This activity determines the overall technical structure of the system — the platforms to use (web, mobile, cloud), how subsystems connect, the deployment model (on-premise vs cloud), and the physical distribution of components. For Hire-a-Nanny, this would decide on a web-based cloud application with a REST API backend.\n\n2. Designing the Application Components (3 marks): This activity specifies each functional module in detail — its inputs, processing logic, and outputs. Each component's responsibilities are defined and interfaces between components are specified. For Hire-a-Nanny: Booking Module, Nanny Profile Module, Notification Module.\n\n3. Designing the User Interface (3 marks): This activity creates the screens, navigation flows, input forms, reports, and error messages that users will interact with. Wireframes and prototypes are produced. For Hire-a-Nanny: the booking form layout, the nanny search results page, and the dashboard.\n\n4. Designing System Security and Controls (3 marks): This activity specifies how the system will be protected — authentication mechanisms (login/password), authorisation rules (who can access what), data encryption standards, audit trails, and backup/recovery procedures. For Hire-a-Nanny: password-protected accounts, encrypted payment data, access logs.\n\n5. Designing the Database (3 marks): This activity creates the full data model — all tables, columns, data types, primary/foreign keys, relationships, normalisation rules, and indexing strategy. For Hire-a-Nanny: Parent, Nanny, Booking, Payment tables with appropriate relationships.",
            keyPoints: [
              "1. Architecture: overall technical structure, platforms, deployment",
              "2. Components: each module's inputs, processing, outputs, interfaces",
              "3. User Interface: screens, forms, navigation, wireframes",
              "4. Security: authentication, authorisation, encryption, audit trails",
              "5. Database: tables, columns, keys, relationships, normalisation",
              "3 marks per activity (minimum: name + clear description)",
              "Application to Hire-a-Nanny context earns additional marks"
            ]
          },
          {
            id: "exam1-q3-2",
            number: "Q3.2",
            marks: 5,
            question: "Describe the importance of visibility and affordance on the usability of the Hire-a-Nanny information system.",
            modelAnswer: "Visibility refers to making important functions and system states clearly visible to users without requiring them to search. In the Hire-a-Nanny system, good visibility is important because parents — who may be stressed and in a hurry when looking for a nanny — need to immediately see the 'Book Now' button, their booking status, and available nannies. If these key functions are hidden in sub-menus, parents will struggle to use the system and may abandon it.\n\nAffordance refers to design cues that communicate how an element should be used. In the Hire-a-Nanny system, buttons must look clickable (have visible borders and hover effects), date pickers must look interactive, and the booking form must clearly indicate required fields. If a booking confirmation looks like plain text rather than a clickable action, parents may not know they need to confirm.\n\nTogether, visibility and affordance improve usability by reducing the time users spend figuring out how to use the system, reducing errors, and improving user confidence and satisfaction.",
            keyPoints: [
              "Visibility defined correctly: important functions must be clearly visible",
              "Visibility applied to Hire-a-Nanny context with example",
              "Affordance defined correctly: design cues communicate how to use elements",
              "Affordance applied to Hire-a-Nanny context with example",
              "Impact on usability: reduces errors, improves efficiency and satisfaction"
            ]
          }
        ]
      },
      {
        id: "exam1-q4",
        number: "Question 4",
        totalMarks: 25,
        subQuestions: [
          {
            id: "exam1-q4-1",
            number: "Q4.1",
            marks: 17,
            question: "Briefly discuss the concept of a system development methodology. Include: (a) a general description, (b) a description of each component, and (c) three examples of each component.",
            modelAnswer: "(a) General Description: A system development methodology is a formalised, structured framework that guides how an information system is developed. It provides a standardised approach that improves quality, consistency, and reduces the risk of project failure by giving teams a clear roadmap to follow.\n\n(b) & (c) Three Components with Examples:\n\nComponent 1 — Process: The ordered sequence of phases and activities the team follows during development.\nExamples: (i) Planning phase, (ii) Analysis phase, (iii) Implementation and testing phase\n\nComponent 2 — Deliverables: The tangible outputs/documents produced at the end of each phase that provide evidence of progress.\nExamples: (i) Project Charter / Feasibility Study (from Planning), (ii) System Requirements Specification (from Analysis), (iii) Tested and Deployed Application (from Implementation)\n\nComponent 3 — Tools and Techniques: The specific methods and tools used to carry out activities within each phase.\nExamples: (i) Use Case Diagrams — for modelling system interactions during analysis, (ii) Entity-Relationship Diagrams — for designing the database during design, (iii) User Interviews / Surveys — for gathering requirements during analysis",
            keyPoints: [
              "General description: structured framework for system development",
              "3 components clearly identified: Process, Deliverables, Tools & Techniques",
              "Process described correctly with 3 examples of phases",
              "Deliverables described correctly with 3 examples of outputs",
              "Tools & Techniques described correctly with 3 examples",
              "5-6 marks per component (description + 3 examples)"
            ]
          },
          {
            id: "exam1-q4-2",
            number: "Q4.2",
            marks: 4,
            question: "List the four (4) basic values of the Agile Development approach.",
            modelAnswer: "The four core values from the Agile Manifesto are:\n1. Individuals and interactions OVER processes and tools\n2. Working software OVER comprehensive documentation\n3. Customer collaboration OVER contract negotiation\n4. Responding to change OVER following a plan\n\n(Note: The right-hand items still have value — Agile simply prioritises the left-hand items more.)",
            keyPoints: [
              "1 mark per correct Agile value (4 total)",
              "Must use the 'X over Y' format or clearly state both sides",
              "All 4 values must be from the official Agile Manifesto"
            ]
          },
          {
            id: "exam1-q4-3",
            number: "Q4.3",
            marks: 4,
            question: "Identify and describe any two (2) knowledge areas within the Project Management Body of Knowledge (PMBOK).",
            modelAnswer: "Two PMBOK knowledge areas:\n\n1. Risk Management: This knowledge area involves identifying potential risks that could threaten the project, assessing their probability and impact, and developing response strategies (avoid, mitigate, transfer, or accept). For the Hire-a-Nanny project, risks might include: key developers leaving mid-project, scope creep, or the budget being insufficient.\n\n2. Stakeholder Management: This knowledge area involves identifying all parties who have an interest in or are affected by the project, understanding their expectations, and managing their engagement throughout the project lifecycle. For Hire-a-Nanny, this includes engaging parents, nannies, and management through regular demos and feedback sessions.",
            keyPoints: [
              "2 marks per knowledge area (1 for correct name, 1 for accurate description)",
              "Any 2 of the 10 PMBOK knowledge areas are valid",
              "Description must be accurate — not invented",
              "Application to a scenario context earns full marks"
            ]
          }
        ]
      },
      {
        id: "exam1-q5",
        number: "Question 5",
        totalMarks: 25,
        subQuestions: [
          {
            id: "exam1-q5-1",
            number: "Q5.1",
            marks: 16,
            question: "Create a design class diagram for the class 'Nanny'. Include: (a) five attributes with visibility and data type, and (b) five method signatures.",
            modelAnswer: "NANNY CLASS DIAGRAM:\n\n┌────────────────────────────────────────────┐\n│                   Nanny                    │\n├────────────────────────────────────────────┤\n│ - name: String                             │\n│ - surname: String                          │\n│ - age: Integer                             │\n│ - qualifications: String                   │\n│ - availability: Boolean                    │\n├────────────────────────────────────────────┤\n│ + register(): void                         │\n│ + getName(): String                        │\n│ + getAvailability(): Boolean               │\n│ + setAvailability(avail: Boolean): void    │\n│ + getQualifications(): String              │\n└────────────────────────────────────────────┘\n\nNotes:\n- All attributes use private visibility (-) because data should be encapsulated\n- Attributes match the given data: name, surname, age, qualifications, availability\n- Correct data types: String (text), Integer (whole number), Boolean (true/false)\n- All methods use public visibility (+) so they can be called from outside the class\n- Method signatures include return type after the colon\n- void means the method returns nothing",
            keyPoints: [
              "Class name correctly displayed in top compartment",
              "5 attributes each with: visibility (-), name, colon, data type",
              "Correct data types: String for name/surname/qualifications, Integer for age, Boolean for availability",
              "5 methods each with: visibility (+), name, parentheses (with/without params), colon, return type",
              "Methods are relevant to a Nanny (register, get/set availability, etc.)",
              "Three-compartment layout: name | attributes | methods",
              "2 marks per attribute (visibility + name + type = full mark), 1 mark per method signature"
            ]
          },
          {
            id: "exam1-q5-2",
            number: "Q5.2",
            marks: 6,
            question: "Provide a brief discussion of the factors that influence when a database will be designed.",
            modelAnswer: "Several factors influence the timing of database design:\n\n1. Stability of Requirements: Database design should begin once requirements are sufficiently stable. Designing the database too early, before requirements are clear, risks having to redesign tables repeatedly as requirements change. For Hire-a-Nanny, the data structures for bookings and nanny profiles must be confirmed before table design begins.\n\n2. System Architecture Decisions: The database design depends on architectural choices — whether the system uses a relational database or NoSQL, which DBMS platform is chosen (MySQL, PostgreSQL), and how data will be distributed. Architecture must be confirmed first.\n\n3. Existence of Legacy Systems or Integration Requirements: If the new system must integrate with an existing database (e.g., a legacy HR system that already stores employee data), database design must account for this early to ensure compatibility.\n\n4. Team Expertise and Project Timeline: Database design may be parallelised with other design activities if there are specialists available. In smaller teams, it may be sequenced after UI design to focus resources.\n\n5. Data Complexity: Systems with complex data relationships (many-to-many, hierarchical data) require more careful planning and thus the design phase is started earlier.",
            keyPoints: [
              "Requirements stability: design after requirements are confirmed",
              "Architecture decisions must precede database design",
              "Legacy/integration requirements may accelerate timing",
              "Team expertise and resource availability",
              "Data complexity — more complex = earlier design needed",
              "2 marks per well-explained factor"
            ]
          },
          {
            id: "exam1-q5-3",
            number: "Q5.3",
            marks: 3,
            question: "List any three (3) software tests that can be performed.",
            modelAnswer: "Three software tests:\n1. Unit Testing — testing individual components/functions in isolation\n2. Integration Testing — testing how components work together\n3. User Acceptance Testing (UAT) — stakeholders verify the system meets requirements\n\n(Other valid: System Testing, Performance/Stress Testing, Regression Testing)",
            keyPoints: [
              "1 mark per correctly named test type",
              "Any 3 of: Unit, Integration, System, UAT, Performance/Stress, Regression Testing",
              "Name alone is sufficient for full marks (description is optional)"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "exam2",
    title: "Online University Platform",
    year: "2022 — SAND6211",
    totalMarks: 120,
    scenario: "Pune Institute of Technology is an Online University. The university offers IT courses globally through distance learning. As part of its global outreach strategy, the university must implement a robust online platform to simplify enrolment, communication, billing, and distance learning.\n\nThe Online Technical Assistant loads, reviews, and assigns tasks to students. The Course Facilitator moderates results and approves them. The HoD receives results reports, selects best performers, and issues final approval. The Office Manager enrolls new students, updates academic records, and unblocks courses.",
    questions: [
      {
        id: "exam2-q1",
        number: "Question 1",
        totalMarks: 30,
        subQuestions: [
          {
            id: "exam2-q1-1",
            number: "Q1.1",
            marks: 2,
            question: "Explain the need for a System Development Process in Software Development Projects.",
            modelAnswer: "A System Development Process is needed because software development without structure leads to failed projects, cost overruns, and systems that don't meet user needs. It provides:\n1. A structured roadmap that guides the team from initial requirements through to deployment\n2. Consistent quality standards and deliverables at each phase\n3. Better communication between stakeholders, developers, and management\n4. Reduced risk of project failure by identifying issues early in the development lifecycle",
            keyPoints: [
              "Provides structure and guidance for the development team",
              "Ensures quality and consistency through defined phases",
              "Reduces risk and improves project success rates",
              "Improves stakeholder communication"
            ]
          },
          {
            id: "exam2-q1-2",
            number: "Q1.2",
            marks: 2,
            question: "Define what Object-Oriented Design is in Systems Analysis and Design.",
            modelAnswer: "Object-Oriented Design (OOD) is an approach to designing a system by organising it as a collection of interacting objects. Each object is an instance of a class that encapsulates both data (attributes) and behaviour (methods). OOD is based on four key principles: encapsulation (hiding internal details), inheritance (classes sharing attributes from parent classes), polymorphism (objects responding differently to the same message), and abstraction (focusing on essential characteristics).\n\nIn SA&D, OOD produces design class diagrams that show the classes, their attributes, methods, and relationships.",
            keyPoints: [
              "OOD = system organised as interacting objects/classes",
              "Classes combine data (attributes) and behaviour (methods)",
              "Key principles: encapsulation, inheritance, polymorphism, abstraction",
              "Produces design class diagrams"
            ]
          },
          {
            id: "exam2-q1-3",
            number: "Q1.3",
            marks: 2,
            question: "Distinguish between internal and external stakeholders in systems analysis.",
            modelAnswer: "Internal Stakeholders are people who are within the organisation developing or using the system. They are directly employed by or part of the organisation. Examples: management, IT department, employees who will use the system.\n\nExternal Stakeholders are people or entities outside the organisation who have an interest in or are affected by the system. Examples: customers, suppliers, regulatory bodies, external partners.\n\nIn the Online University context: Internal = Course Facilitators, HoD, Office Manager. External = Students (if they are not employed by the university), government education regulators.",
            keyPoints: [
              "Internal = inside the organisation",
              "External = outside the organisation",
              "Clear distinction between the two",
              "Examples provided"
            ]
          },
          {
            id: "exam2-q1-4",
            number: "Q1.4",
            marks: 4,
            question: "Distinguish between brief use case description and fully developed use case description.",
            modelAnswer: "Brief Use Case Description: A short, one-to-three sentence summary of a use case that describes the basic interaction. It captures the essence of what happens without details. Used in early analysis when exploring requirements. Example: 'The student registers for a course by selecting it from the catalogue and submitting their details. The system confirms registration.'\n\nFully Developed Use Case Description: A comprehensive, structured narrative that documents every aspect of the use case in detail. It includes all fields: use case name, actor, trigger, pre-conditions, post-conditions, main success scenario (step-by-step), alternative flows, and exception flows.\n\nKey distinction: Brief descriptions give a quick overview suitable for initial planning; fully developed descriptions provide the level of detail needed for actual system development and testing.",
            keyPoints: [
              "Brief = 1-3 sentences, summary only",
              "Fully developed = complete structured narrative with all components",
              "Brief used in early analysis; fully developed used for detailed design",
              "Fully developed includes: name, actor, trigger, pre/post conditions, main flow, alternatives, exceptions",
              "Example of each type"
            ]
          },
          {
            id: "exam2-q1-5",
            number: "Q1.5",
            marks: 4,
            question: "Distinguish between system analysis and system design, and discuss the importance of both in software development.",
            modelAnswer: "Systems Analysis focuses on understanding the problem and defining WHAT the system needs to do. It involves gathering requirements, studying the current system, identifying problems, and producing a requirements specification.\n\nSystems Design focuses on defining HOW the system will be built. It translates requirements into technical specifications — architecture, database design, UI wireframes, and component specifications.\n\nImportance of Systems Analysis: Without thorough analysis, the development team may build a system that doesn't solve the right problem or doesn't meet stakeholder needs. Analysis ensures alignment between the business problem and the technical solution.\n\nImportance of Systems Design: Without proper design, implementation becomes unpredictable and chaotic. Good design reduces development time, improves code quality, and makes maintenance easier. It serves as the bridge between requirements and code.",
            keyPoints: [
              "Analysis = WHAT (requirements, problem understanding)",
              "Design = HOW (technical blueprint, specifications)",
              "Clear distinction with examples",
              "Importance of analysis: building the right system",
              "Importance of design: building the system right",
              "Both are critical — neither can be skipped"
            ]
          },
          {
            id: "exam2-q1-6",
            number: "Q1.6",
            marks: 2,
            question: "Briefly explain what a predictive approach to SDLC is.",
            modelAnswer: "A predictive approach (also called the Waterfall model) to the SDLC is a sequential, plan-driven development approach where all requirements are defined upfront and each phase is completed fully before the next begins. The entire project is planned at the start, with a fixed scope, budget, and timeline.\n\nPhases are completed in order: Planning → Analysis → Design → Implementation → Testing → Deployment. Going back to a previous phase is difficult and costly.\n\nBest suited for: projects with stable, well-understood requirements where change is unlikely.",
            keyPoints: [
              "Predictive = Waterfall = sequential phases",
              "All requirements defined upfront",
              "Each phase completed before the next begins",
              "Plan-driven, fixed scope",
              "Best for stable requirements"
            ]
          },
          {
            id: "exam2-q1-7",
            number: "Q1.7",
            marks: 5,
            question: "Define user-centred design in designing user interfaces and list three of its important principles.",
            modelAnswer: "User-Centred Design (UCD) is a design philosophy and process where the needs, goals, capabilities, and limitations of end users are the primary focus of every design decision. The design process is driven by deep understanding of the people who will use the system, rather than by technical constraints or designer preferences.\n\nThree important principles of UCD:\n1. Understand your users: Conduct research (interviews, observations, surveys) to understand who will use the system, what they need to accomplish, their skill levels, and their context of use.\n\n2. Involve users throughout the design process: Include users in prototype reviews, usability testing sessions, and feedback sessions at multiple stages — not just at the end.\n\n3. Design iteratively based on user feedback: Create prototypes, test them with real users, observe where they struggle, and refine the design. Repeat this cycle until the design meets user needs effectively.",
            keyPoints: [
              "UCD defined correctly: user needs drive design decisions",
              "Principle 1: understand users through research",
              "Principle 2: involve users throughout (not just at the end)",
              "Principle 3: iterative design based on feedback",
              "Definition = 2 marks; 3 principles = 3 marks (1 each)"
            ]
          },
          {
            id: "exam2-q1-8",
            number: "Q1.8",
            marks: 1,
            question: "Define what usability is in user interface design.",
            modelAnswer: "Usability is the degree to which a system can be used by specified users to achieve specified goals with effectiveness, efficiency, and satisfaction in a specified context of use. In simpler terms, it measures how easy and pleasant the system is to use.",
            keyPoints: [
              "Usability = ease of use to achieve goals effectively and efficiently",
              "Key dimensions: effectiveness, efficiency, satisfaction"
            ]
          },
          {
            id: "exam2-q1-9",
            number: "Q1.9",
            marks: 4,
            question: "Discuss two things you would take into consideration when designing the interface for both Web and Mobile.",
            modelAnswer: "1. Screen Size and Layout Adaptation: Web interfaces have large screens and can display more information simultaneously — multi-column layouts, full navigation bars, and data-rich dashboards work well. Mobile interfaces have small screens and require simplified, focused layouts with one primary action per screen. Content must be prioritised and secondary information hidden behind navigation. The same interface design cannot simply be shrunk for mobile — it must be redesigned.\n\n2. Input Method: Web interfaces are operated with a mouse and keyboard, allowing precise clicking on small elements and efficient keyboard shortcuts. Mobile interfaces are operated with fingers on a touchscreen — elements must be larger (minimum 44px touch targets), form inputs should trigger appropriate virtual keyboards, and gesture-based navigation (swipe, pinch) should be used where appropriate. Hover states used on web have no equivalent on mobile.",
            keyPoints: [
              "Screen size and information density differences",
              "Navigation pattern differences (top bar vs bottom bar/hamburger)",
              "Touch vs mouse interaction requirements",
              "Touch target sizes minimum 44px for mobile",
              "Performance/bandwidth considerations",
              "2 marks per consideration"
            ]
          },
          {
            id: "exam2-q1-10",
            number: "Q1.10",
            marks: 4,
            question: "Distinguish between Database and DBMS. List two real-life examples of a DBMS.",
            modelAnswer: "Database: An organised, structured collection of related data stored electronically. The database itself is simply the data — it contains tables, records, and relationships but has no built-in way to manage or query itself.\n\nDBMS (Database Management System): Software that provides the interface between users/applications and the database. The DBMS manages access to the data, processes queries (SQL statements), enforces data integrity rules, manages user permissions, handles transactions, and provides backup and recovery functionality.\n\nKey distinction: The database is the data; the DBMS is the software that manages the data.\n\nTwo real-life DBMS examples:\n1. MySQL — open-source relational DBMS widely used for web applications\n2. Microsoft SQL Server — enterprise relational DBMS used in corporate environments",
            keyPoints: [
              "Database = organised collection of data (the data itself)",
              "DBMS = software managing access to the database",
              "Clear distinction: data vs software",
              "DBMS example 1: MySQL (or PostgreSQL, Oracle, SQL Server)",
              "DBMS example 2: second different DBMS correctly named",
              "1 mark each for definition, 1 mark each for example"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "exam3",
    title: "Technical Help Desk System",
    year: "2022 — SAND6211 Test",
    totalMarks: 60,
    scenario: "Dawn Help Desk Corporation is a global help desk company. A Software Development department was established to develop a new Technical Help Desk System.\n\nA help desk consultant collects customer details, registers an incident, and sends it to a Technical Consultant. The Technical Consultant conducts initial troubleshooting, compiles a report, and sends it to the Supervisor. The Supervisor confirms details and approves the report.\n\nThe system will use a Microsoft SQL Server RDBMS and ASP.Net Core. The department has adopted Agile project management.",
    questions: [
      {
        id: "exam3-q1",
        number: "Question 1",
        totalMarks: 20,
        subQuestions: [
          {
            id: "exam3-q1-1",
            number: "Q1.1",
            marks: 6,
            question: "Define a subsystem and briefly discuss the importance of dividing an information system into subsystems. Provide a real-life example with one or more subsystems.",
            modelAnswer: "Definition: A subsystem is a self-contained, semi-independent component of a larger information system that performs a specific set of related functions. Each subsystem has a defined boundary, inputs, outputs, and processes, and communicates with other subsystems through well-defined interfaces.\n\nImportance of dividing into subsystems:\n1. Manageability: Large systems are complex — breaking them into subsystems makes each part small enough to design, build, and maintain independently. Different teams can work on different subsystems simultaneously.\n2. Specialisation: Each subsystem can be built and optimised by specialists in that domain. The Billing subsystem team can focus on financial logic without needing to understand the course delivery subsystem.\n3. Independent Testing: Subsystems can be tested in isolation before integration, making it easier to identify and fix defects.\n4. Reduced Impact of Changes: A change in one subsystem has minimal impact on other subsystems if interfaces are well-defined.\n\nReal-life example: An Online Banking System with subsystems:\n- Account Management Subsystem: handles account opening, closing, and details\n- Transaction Processing Subsystem: handles deposits, withdrawals, and transfers\n- Fraud Detection Subsystem: monitors transactions for suspicious patterns\n- Reporting Subsystem: generates statements and reports",
            keyPoints: [
              "Subsystem correctly defined as a component performing specific functions",
              "Importance: manageability, specialisation, independent testing",
              "Importance: reduced impact of changes/maintenance ease",
              "Real-life example with at least 2 subsystems named",
              "Subsystems must be relevant to the example system",
              "2 marks for definition, 4 marks for importance + example"
            ]
          },
          {
            id: "exam3-q1-2",
            number: "Q1.2",
            marks: 6,
            question: "Briefly explain the purpose of the SDLC and discuss the importance of the first two core processes.",
            modelAnswer: "Purpose of the SDLC: The System Development Life Cycle provides a structured, phased approach to developing information systems. Its purpose is to ensure that systems are developed systematically, with clear phases and checkpoints, resulting in high-quality systems that meet user requirements within budget and on time.\n\nThe first two core processes:\n\n1. Planning: This is the foundation of the entire project. In the planning phase, the project scope is defined, feasibility is assessed (technical, financial, and organisational), resources are allocated, and a project plan is created. Without thorough planning, projects run over budget, miss deadlines, and fail to deliver value. Importance: prevents costly mistakes by identifying whether the project is viable before significant resources are committed.\n\n2. Analysis: In the analysis phase, the current system is studied, stakeholder requirements are gathered (through interviews, workshops, and observation), and a detailed requirements specification is produced. This defines WHAT the new system must do. Importance: analysis is critical because it ensures the development team builds the RIGHT system. Errors discovered in requirements are 10-100 times cheaper to fix than errors discovered after implementation.",
            keyPoints: [
              "SDLC purpose: structured approach, high-quality systems, meet requirements",
              "Planning: scope definition, feasibility, resource allocation, project plan",
              "Planning importance: prevents costly mistakes, establishes project viability",
              "Analysis: requirements gathering, studying current system, requirements specification",
              "Analysis importance: ensures the right system is built, errors caught early are cheapest to fix",
              "1 mark per point"
            ]
          },
          {
            id: "exam3-q1-3",
            number: "Q1.3",
            marks: 4,
            question: "Briefly explain what stakeholders are in system development and provide two examples.",
            modelAnswer: "Stakeholders in system development are all individuals, groups, or organisations who have an interest in or are affected by the development of the information system. They may provide requirements, fund the project, use the system, or be impacted by its outputs.\n\nExample 1: Help Desk Consultants (Internal stakeholder) — they will use the system daily to register incidents and track resolutions. Their input is critical for defining the user interface requirements and the workflow the system must support.\n\nExample 2: Multi-national technology corporation clients (External stakeholder) — they have entrusted Dawn Help Desk Corporation with their help desk operations, so they have an interest in the system meeting their service level agreements and security standards.",
            keyPoints: [
              "Stakeholders = anyone with an interest in the system",
              "May include users, funders, affected parties",
              "Example 1: relevant, named stakeholder with explanation",
              "Example 2: different relevant, named stakeholder with explanation",
              "1 mark per stakeholder with explanation"
            ]
          },
          {
            id: "exam3-q1-4",
            number: "Q1.4",
            marks: 4,
            question: "Define what the Event Decomposition Technique is and distinguish between external and state events.",
            modelAnswer: "Event Decomposition Technique: A method for identifying use cases by systematically analysing the events that the system must respond to. Every event that triggers a system response becomes a use case. This approach ensures completeness — by thinking in terms of events rather than features, analysts are less likely to miss important system behaviours.\n\nExternal Event: An event initiated by an external actor (a person or system outside the system boundary) that triggers a system response. The actor sends data to the system or requests it to do something.\nExample: A help desk consultant submits a new incident (actor interacts with system → system registers incident).\n\nState Event: An event triggered when data within the system reaches a particular state or condition, rather than being triggered by a user action.\nExample: When an incident's status changes to 'Overdue' (because it has been open for more than 48 hours), the system automatically escalates it to the supervisor.",
            keyPoints: [
              "Event Decomposition: identifies use cases from system events",
              "External event: triggered by an external actor sending data/request",
              "External event example relevant to the case study",
              "State event: triggered when data reaches a particular condition",
              "State event example relevant to the case study",
              "Distinction must be clear — not just definitions in isolation"
            ]
          }
        ]
      },
      {
        id: "exam3-q3",
        number: "Question 3",
        totalMarks: 20,
        subQuestions: [
          {
            id: "exam3-q3-1",
            number: "Q3.1",
            marks: 6,
            question: "Discuss the importance of encryption, and distinguish between encryption and decryption in computer security.",
            modelAnswer: "Importance of Encryption: Encryption is critical for protecting sensitive data from unauthorised access. For Dawn Help Desk Corporation, it ensures that:\n1. Customer data stored in the database cannot be read by unauthorised people even if the database is breached\n2. Data transmitted between systems (e.g., incident reports sent over the network) cannot be intercepted and read\n3. Backup files stored off-site cannot be accessed even if the physical media is lost or stolen\n4. Compliance with data protection regulations that mandate encryption of personal data\n\nEncryption: The process of converting plaintext (readable data) into ciphertext (unreadable scrambled data) using an algorithm and an encryption key. Only parties with the correct key can read the data. Encryption makes data unreadable to anyone who intercepts it.\n\nDecryption: The process of converting ciphertext back into plaintext using the corresponding decryption key. This reverses the encryption process, restoring the data to its original readable form for authorised users.\n\nKey distinction: Encryption protects data by making it unreadable. Decryption restores it to readable form for authorised parties.",
            keyPoints: [
              "Importance: protects data at rest (in database and backups)",
              "Importance: protects data in transit (over networks)",
              "Importance: regulatory compliance",
              "Encryption defined correctly: plaintext → ciphertext using algorithm + key",
              "Decryption defined correctly: ciphertext → plaintext, reverse process",
              "Clear distinction: encryption = securing; decryption = restoring for authorised users"
            ]
          },
          {
            id: "exam3-q3-2",
            number: "Q3.2",
            marks: 4,
            question: "List any four aspects of a use case covered in a use case description.",
            modelAnswer: "Four aspects covered in a use case description:\n1. Use Case Name — the unique identifier/title of the use case\n2. Actor — the user or system that initiates or participates in the use case\n3. Pre-conditions — conditions that must be true before the use case can begin\n4. Main Success Scenario — the step-by-step sequence of actions in the normal/happy path\n\n(Other valid: Post-conditions, Trigger, Alternative Flows, Exception Flows, Priority, Frequency)",
            keyPoints: [
              "1 mark per correct component (any 4 of 9)",
              "Must be actual use case description components",
              "Name alone sufficient without definition"
            ]
          },
          {
            id: "exam3-q3-3",
            number: "Q3.3",
            marks: 6,
            question: "List and define the three elements that access control systems rely on.",
            modelAnswer: "The three elements of access control systems:\n\n1. Authentication: The process of verifying the identity of a user or system — proving that someone is who they claim to be. This is the 'who are you?' check. Methods include: username and password, biometric verification (fingerprint, face recognition), smart cards, and multi-factor authentication (MFA). For the Help Desk System: consultants authenticate with their employee credentials before accessing incident records.\n\n2. Authorisation: Once a user is authenticated, authorisation determines what they are allowed to do — their permissions, roles, and access rights. This is the 'what are you allowed to do?' check. For the Help Desk System: consultants can register incidents but cannot approve reports; supervisors can approve but cannot delete incident records.\n\n3. Accountability (Auditing): The process of tracking and recording what authenticated and authorised users have done within the system. Audit logs record: who performed an action, what action was performed, when it was performed, and from where. This creates an audit trail for forensic investigation. For the Help Desk System: all access to customer data and all changes to incident records are logged.",
            keyPoints: [
              "Authentication: verifying identity — who are you?",
              "Authorisation: determining permissions — what can you do?",
              "Accountability/Auditing: recording actions — what did you do?",
              "2 marks per element (name + accurate definition + example)",
              "All three must be covered"
            ]
          },
          {
            id: "exam3-q3-4",
            number: "Q3.4",
            marks: 4,
            question: "Discuss two things you would take into consideration when designing the interface for both Web and Mobile.",
            modelAnswer: "1. Navigation Structure and Screen Layout: Web interfaces can accommodate complex navigation — top navigation bars with multiple menu items, sidebars, and multi-column content layouts work well on large screens. Mobile interfaces require simplified navigation (bottom tab bar, hamburger menu) because screen real estate is limited and users navigate primarily with their thumbs. For the Help Desk System, the web version could show the full incident list and details side-by-side; the mobile version would show them on separate screens.\n\n2. Touch vs Mouse Interaction: Web interfaces are designed for mouse and keyboard — small clickable elements, right-click context menus, and keyboard shortcuts are all viable. Mobile interfaces must accommodate finger touch — all interactive elements must be large enough to tap accurately (minimum 44×44 pixels), content must be scrollable by swipe, and form inputs must trigger appropriate on-screen keyboards. Hover states used extensively in web design do not exist on mobile.",
            keyPoints: [
              "Navigation differences: top bar/sidebar on web vs bottom bar/hamburger on mobile",
              "Screen size and information density",
              "Touch vs mouse: touch targets minimum 44px, no hover on mobile",
              "Performance/bandwidth for mobile networks",
              "2 marks per consideration with explanation"
            ]
          }
        ]
      }
    ]
  }
];
