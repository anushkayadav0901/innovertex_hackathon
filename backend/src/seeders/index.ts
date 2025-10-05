import { User } from '../models/User';
import { Hackathon } from '../models/Hackathon';
import { Team } from '../models/Team';
import { Submission } from '../models/Submission';
import { Evaluation } from '../models/Evaluation';
import { Announcement } from '../models/Announcement';
import { FAQ } from '../models/FAQ';
import { Question } from '../models/Question';
import { Message } from '../models/Message';

// Sample Users with different roles
const sampleUsers = [
  {
    name: "John Organizer",
    email: "john@organizer.com",
    passwordHash: "dummy-hash-not-used", // Password-less auth, but field is required
    role: "organizer" as const,
    bio: "Experienced hackathon organizer with 10+ years in tech events",
    expertise: ["Event Management", "Technology", "Innovation"],
    linkedinUrl: "https://linkedin.com/in/john-organizer"
  },
  {
    name: "Jane Judge",
    email: "jane@judge.com",
    passwordHash: "dummy-hash-not-used",
    role: "judge" as const,
    bio: "Senior Software Engineer and startup advisor",
    expertise: ["Full Stack Development", "AI/ML", "Product Strategy"],
    linkedinUrl: "https://linkedin.com/in/jane-judge"
  },
  {
    name: "Bob Participant",
    email: "bob@participant.com",
    passwordHash: "dummy-hash-not-used",
    role: "participant" as const,
    bio: "Computer Science student passionate about AI and web development",
    expertise: ["React", "Node.js", "Python", "Machine Learning"],
    linkedinUrl: "https://linkedin.com/in/bob-participant"
  },
  {
    name: "Alice Mentor",
    email: "alice@mentor.com",
    passwordHash: "dummy-hash-not-used",
    role: "mentor" as const,
    bio: "Tech entrepreneur and mentor for early-stage startups",
    expertise: ["Entrepreneurship", "Product Development", "Mentoring"],
    linkedinUrl: "https://linkedin.com/in/alice-mentor"
  },
  {
    name: "Charlie Developer",
    email: "charlie@dev.com",
    passwordHash: "dummy-hash-not-used",
    role: "participant" as const,
    bio: "Frontend developer with a passion for user experience",
    expertise: ["React", "TypeScript", "UI/UX Design"],
    linkedinUrl: "https://linkedin.com/in/charlie-dev"
  },
  {
    name: "Diana Designer",
    email: "diana@design.com",
    passwordHash: "dummy-hash-not-used",
    role: "participant" as const,
    bio: "UI/UX designer focused on creating intuitive user experiences",
    expertise: ["UI/UX Design", "Figma", "User Research"],
    linkedinUrl: "https://linkedin.com/in/diana-designer"
  }
];

// Sample Hackathons with proper date ranges
const sampleHackathons = [
  {
    title: "AI Innovation Challenge 2025",
    org: "TechCorp",
    organizerId: 1, // John Organizer
    startDate: new Date("2025-10-15T10:00:00Z"),
    endDate: new Date("2025-10-17T18:00:00Z"),
    tags: ["AI", "ML", "Innovation", "Healthcare"],
    prize: "$50,000",
    description: "Build innovative AI solutions that can make a real impact on healthcare and society. Teams will have 48 hours to develop, prototype, and pitch their AI-powered applications.",
    criteria: [
      { name: "Innovation", weight: 30 },
      { name: "Technical Excellence", weight: 25 },
      { name: "Impact", weight: 25 },
      { name: "Presentation", weight: 20 }
    ]
  },
  {
    title: "Blockchain for Good",
    org: "CryptoFoundation",
    organizerId: 1,
    startDate: new Date("2025-11-01T09:00:00Z"),
    endDate: new Date("2025-11-03T17:00:00Z"),
    tags: ["Blockchain", "Web3", "Social Impact"],
    prize: "$25,000",
    description: "Develop blockchain solutions that address real-world social and environmental challenges.",
    criteria: [
      { name: "Social Impact", weight: 35 },
      { name: "Technical Implementation", weight: 30 },
      { name: "Feasibility", weight: 20 },
      { name: "Innovation", weight: 15 }
    ]
  },
  {
    title: "FinTech Revolution",
    org: "FinanceInnovators",
    organizerId: 1,
    startDate: new Date("2025-12-05T08:00:00Z"),
    endDate: new Date("2025-12-07T20:00:00Z"),
    tags: ["FinTech", "Banking", "Payments", "DeFi"],
    prize: "$75,000",
    description: "Create the next generation of financial technology solutions that will revolutionize how people manage, invest, and transfer money.",
    criteria: [
      { name: "Market Potential", weight: 30 },
      { name: "Technical Excellence", weight: 25 },
      { name: "User Experience", weight: 25 },
      { name: "Security", weight: 20 }
    ]
  }
];

// Sample Teams with JSON members array
const sampleTeams = [
  {
    name: "AI Pioneers",
    hackathonId: 1,
    leaderId: 3, // Bob Participant
    members: ["3", "5"] // Bob + Charlie
  },
  {
    name: "Design Innovators", 
    hackathonId: 1,
    leaderId: 6, // Diana Designer
    members: ["6", "3"] // Diana + Bob
  },
  {
    name: "Blockchain Builders",
    hackathonId: 2,
    leaderId: 5, // Charlie Developer
    members: ["5", "6"] // Charlie + Diana
  }
];

// Sample Submissions
const sampleSubmissions = [
  {
    hackathonId: 1,
    teamId: 1,
    title: "Smart Health Monitor",
    repoUrl: "https://github.com/ai-pioneers/smart-health-monitor",
    figmaUrl: "https://figma.com/file/health-monitor-ui",
    driveUrl: "https://drive.google.com/folder/health-monitor-docs",
    deckUrl: "https://docs.google.com/presentation/d/health-monitor-pitch",
    description: "AI-powered health monitoring system that uses computer vision and machine learning to track vital signs through smartphone cameras. The system can detect heart rate, respiratory rate, and stress levels in real-time."
  },
  {
    hackathonId: 1,
    teamId: 2,
    title: "MedAssist AI",
    repoUrl: "https://github.com/design-innovators/medassist-ai",
    figmaUrl: "https://figma.com/file/medassist-ui-design",
    description: "An AI-powered medical assistant that helps patients understand their symptoms and connects them with appropriate healthcare providers. Features include symptom analysis, appointment scheduling, and medication reminders."
  },
  {
    hackathonId: 2,
    teamId: 3,
    title: "EcoChain",
    repoUrl: "https://github.com/blockchain-builders/ecochain",
    description: "A blockchain-based carbon credit marketplace that allows individuals and companies to buy, sell, and track carbon credits transparently. Includes smart contracts for automated carbon offset verification."
  }
];

// Sample Evaluations with JSON scores
const sampleEvaluations = [
  {
    hackathonId: 1,
    submissionId: 1,
    judgeId: 2, // Jane Judge
    scores: [
      { criterionId: "innovation", score: 9 },
      { criterionId: "technical excellence", score: 8 },
      { criterionId: "impact", score: 9 },
      { criterionId: "presentation", score: 7 }
    ],
    feedback: "Excellent technical implementation with innovative use of computer vision for health monitoring. The potential impact on healthcare accessibility is significant. Presentation could be improved with more detailed market analysis."
  },
  {
    hackathonId: 1,
    submissionId: 2,
    judgeId: 2, // Jane Judge
    scores: [
      { criterionId: "innovation", score: 7 },
      { criterionId: "technical excellence", score: 8 },
      { criterionId: "impact", score: 8 },
      { criterionId: "presentation", score: 9 }
    ],
    feedback: "Well-executed medical assistant with good user experience design. Strong presentation and clear value proposition. Technical implementation is solid but could benefit from more advanced AI features."
  }
];

// Sample Announcements
const sampleAnnouncements = [
  {
    hackathonId: 1,
    organizerId: 1,
    title: "Welcome to AI Innovation Challenge 2025!",
    content: "We're excited to have you participate in this year's AI Innovation Challenge. Please make sure to check the schedule and join the opening ceremony at 10 AM EST.",
    priority: "high" as const
  },
  {
    hackathonId: 1,
    organizerId: 1,
    title: "Submission Deadline Reminder",
    content: "Reminder: All submissions must be uploaded by 6 PM EST on October 17th. Late submissions will not be accepted.",
    priority: "normal" as const
  }
];

// Sample FAQs
const sampleFAQs = [
  {
    hackathonId: 1,
    question: "What technologies are allowed for the AI Innovation Challenge?",
    answer: "You can use any programming language, framework, or AI/ML library. Popular choices include Python with TensorFlow/PyTorch, JavaScript with TensorFlow.js, or any other technology stack you're comfortable with.",
    createdBy: 1
  },
  {
    hackathonId: 1,
    question: "Can we use external APIs and datasets?",
    answer: "Yes, you can use external APIs and publicly available datasets. However, make sure to properly document all external resources used and ensure you have the right to use them in your project.",
    createdBy: 1
  },
  {
    hackathonId: 2,
    question: "Do I need prior blockchain experience to participate?",
    answer: "No prior blockchain experience is required! We have mentors available to help you get started with blockchain development. We also provide starter templates and tutorials.",
    createdBy: 1
  }
];

// Sample Questions
const sampleQuestions = [
  {
    hackathonId: 1,
    userId: 3, // Bob Participant
    question: "Is there a limit on team size for the AI Innovation Challenge?",
    answer: "Teams can have a maximum of 6 members. We recommend 3-4 members for optimal collaboration.",
    answeredBy: 1,
    status: "answered" as const,
    answeredAt: new Date()
  },
  {
    hackathonId: 1,
    userId: 5, // Charlie Developer
    question: "Will there be any workshops during the hackathon?",
    status: "pending" as const
  }
];

// Sample Messages
const sampleMessages = [
  {
    hackathonId: 1,
    userId: 3,
    roomType: "general" as const,
    message: "Excited to be part of this hackathon! Looking forward to building something amazing!"
  },
  {
    hackathonId: 1,
    userId: 5,
    roomType: "general" as const, 
    message: "Anyone interested in forming a team focused on healthcare AI?"
  },
  {
    hackathonId: 1,
    userId: 2,
    roomType: "judge" as const,
    message: "Looking forward to seeing all the innovative projects this year!"
  }
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if data already exists
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log('📊 Database already contains data, skipping seeding');
      return;
    }

    // Seed Users
    console.log('👥 Seeding users...');
    const users = await User.bulkCreate(sampleUsers);
    console.log(`✅ Created ${users.length} users`);

    // Seed Hackathons
    console.log('🏆 Seeding hackathons...');
    const hackathons = await Hackathon.bulkCreate(sampleHackathons);
    console.log(`✅ Created ${hackathons.length} hackathons`);

    // Seed Teams
    console.log('👨‍👩‍👧‍👦 Seeding teams...');
    const teams = await Team.bulkCreate(sampleTeams);
    console.log(`✅ Created ${teams.length} teams`);

    // Seed Submissions
    console.log('📝 Seeding submissions...');
    const submissions = await Submission.bulkCreate(sampleSubmissions);
    console.log(`✅ Created ${submissions.length} submissions`);

    // Seed Evaluations
    console.log('⚖️ Seeding evaluations...');
    const evaluations = await Evaluation.bulkCreate(sampleEvaluations);
    console.log(`✅ Created ${evaluations.length} evaluations`);

    // Seed Announcements
    console.log('📢 Seeding announcements...');
    const announcements = await Announcement.bulkCreate(sampleAnnouncements);
    console.log(`✅ Created ${announcements.length} announcements`);

    // Seed FAQs
    console.log('❓ Seeding FAQs...');
    const faqs = await FAQ.bulkCreate(sampleFAQs);
    console.log(`✅ Created ${faqs.length} FAQs`);

    // Seed Questions
    console.log('🙋 Seeding questions...');
    const questions = await Question.bulkCreate(sampleQuestions);
    console.log(`✅ Created ${questions.length} questions`);

    // Seed Messages
    console.log('💬 Seeding messages...');
    const messages = await Message.bulkCreate(sampleMessages);
    console.log(`✅ Created ${messages.length} messages`);

    console.log('🎉 Database seeding completed successfully!');
    
    // Log summary
    console.log('\n📊 Seeding Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🏆 Hackathons: ${hackathons.length}`);
    console.log(`👨‍👩‍👧‍👦 Teams: ${teams.length}`);
    console.log(`📝 Submissions: ${submissions.length}`);
    console.log(`⚖️ Evaluations: ${evaluations.length}`);
    console.log(`📢 Announcements: ${announcements.length}`);
    console.log(`❓ FAQs: ${faqs.length}`);
    console.log(`🙋 Questions: ${questions.length}`);
    console.log(`💬 Messages: ${messages.length}`);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};
