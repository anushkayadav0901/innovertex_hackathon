export interface StageInfo {
  id: number;
  name: string;
  shortDescription: string;
  fullDescription: string;
  tasks: string[];
  judgeNotes?: string;
  judgeCriteria?: string;
  icon: string;
  color: string;
}

export const STAGE_DATA: StageInfo[] = [
  {
    id: 0,
    name: "Registration Gate",
    shortDescription: "Sign up and unlock your hackathon journey.",
    fullDescription: "Welcome to the hackathon! This is where your journey begins. Complete your registration and get ready for an epic coding adventure.",
    tasks: [
      "Sign up with your details",
      "Verify your email and profile",
      "Join the hackathon community",
      "Review rules and guidelines",
      "Set up your development environment"
    ],
    judgeNotes: "Verify participant eligibility, check team formation rules, and ensure all registration requirements are met.",
    judgeCriteria: "Eligibility & Compliance",
    icon: "🚪",
    color: "#8b5cf6"
  },
  {
    id: 1,
    name: "Idea Valley",
    shortDescription: "Brainstorm, explore, and form your team.",
    fullDescription: "The creative hub where innovation sparks! Brainstorm groundbreaking ideas, form your dream team, and define your hackathon project.",
    tasks: [
      "Brainstorm innovative solutions",
      "Form or join a team (2-4 members)",
      "Submit your problem statement",
      "Research existing solutions",
      "Create initial project roadmap"
    ],
    judgeNotes: "Evaluate idea originality, feasibility, and potential impact. Check team composition and collaboration readiness.",
    judgeCriteria: "Innovation & Feasibility",
    icon: "💡",
    color: "#10b981"
  },
  {
    id: 2,
    name: "Prototype Tower",
    shortDescription: "Turn ideas into working prototypes.",
    fullDescription: "Build, code, and create! Transform your ideas into working prototypes. This is where the magic happens through collaboration and technical execution.",
    tasks: [
      "Set up project repository",
      "Develop core functionality",
      "Create user interface/experience",
      "Implement key features",
      "Test and debug your solution"
    ],
    judgeNotes: "Assess technical implementation, code quality, functionality, and innovation. Evaluate team collaboration and progress.",
    judgeCriteria: "Functionality & Design",
    icon: "⚙️",
    color: "#6366f1"
  },
  {
    id: 3,
    name: "Pitch Arena",
    shortDescription: "Present solutions to mentors & judges.",
    fullDescription: "Showtime! Present your solution to judges and mentors. Demonstrate your prototype, explain your approach, and showcase your team's achievements.",
    tasks: [
      "Prepare presentation slides",
      "Create compelling demo",
      "Practice pitch delivery",
      "Present to judges panel",
      "Answer questions and feedback"
    ],
    judgeNotes: "Evaluate presentation quality, solution demonstration, team communication, and ability to articulate technical decisions.",
    judgeCriteria: "Presentation & Communication",
    icon: "🎤",
    color: "#dc2626"
  },
  {
    id: 4,
    name: "Winner's Podium",
    shortDescription: "Celebrate the champions!",
    fullDescription: "Celebration time! Top teams are recognized for their outstanding achievements. Whether you win or not, you've gained invaluable experience!",
    tasks: [
      "Await final results",
      "Celebrate achievements",
      "Network with other teams",
      "Receive feedback from judges",
      "Plan future collaborations"
    ],
    judgeNotes: "Final ranking based on innovation, technical execution, presentation quality, and overall impact potential.",
    judgeCriteria: "Overall Impact & Excellence",
    icon: "🏆",
    color: "#fbbf24"
  }
];

export const getStageInfo = (stageIndex: number): StageInfo | undefined => {
  return STAGE_DATA[stageIndex];
};

export const getAllStageInfo = (): StageInfo[] => {
  return STAGE_DATA;
};
