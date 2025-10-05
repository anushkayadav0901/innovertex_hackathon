import bcrypt from 'bcryptjs';
import { User, Hackathon, Team, TeamMember, Submission, Evaluation } from '../models/index';
import { connectDatabase } from './database';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Create sample users
    const passwordHash = await bcrypt.hash('password123', 12);

    const users = await User.bulkCreate([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        passwordHash,
        role: 'organizer',
        bio: 'Experienced hackathon organizer and tech enthusiast',
        expertise: ['Event Management', 'Technology', 'Innovation'],
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        passwordHash,
        role: 'participant',
        bio: 'Full-stack developer passionate about AI and blockchain',
        expertise: ['JavaScript', 'Python', 'React', 'Node.js'],
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        passwordHash,
        role: 'judge',
        bio: 'Senior software architect with 15 years of experience',
        expertise: ['Software Architecture', 'System Design', 'Mentoring'],
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        passwordHash,
        role: 'participant',
        bio: 'Mobile app developer and UI/UX designer',
        expertise: ['React Native', 'Flutter', 'UI/UX Design'],
      },
      {
        name: 'Eva Martinez',
        email: 'eva@example.com',
        passwordHash,
        role: 'judge',
        bio: 'AI researcher and machine learning expert',
        expertise: ['Machine Learning', 'Deep Learning', 'Data Science'],
      },
      {
        name: 'Frank Brown',
        email: 'frank@example.com',
        passwordHash,
        role: 'participant',
        bio: 'Backend developer specializing in cloud technologies',
        expertise: ['AWS', 'Docker', 'Kubernetes', 'Go'],
      },
    ]);

    console.log('✅ Created sample users');

    // Create sample hackathons
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const twoWeeks = 14 * 24 * 60 * 60 * 1000;

    const hackathons = await Hackathon.bulkCreate([
      {
        title: 'AI Innovation Challenge 2024',
        org: 'TechCorp',
        organizerId: users[0].id, // Alice
        description: 'Build the next generation of AI-powered applications that solve real-world problems.',
        tags: ['AI', 'Machine Learning', 'Innovation'],
        prize: '$50,000',
        dateRange: 'March 15-17, 2024',
        startAt: now + oneWeek,
        endAt: now + oneWeek + (3 * 24 * 60 * 60 * 1000),
        criteria: [
          { id: 'innovation', label: 'Innovation', max: 10 },
          { id: 'technical', label: 'Technical Implementation', max: 10 },
          { id: 'impact', label: 'Social Impact', max: 10 },
          { id: 'presentation', label: 'Presentation', max: 10 },
        ],
      },
      {
        title: 'Blockchain for Good',
        org: 'CryptoFoundation',
        organizerId: users[0].id, // Alice
        description: 'Leverage blockchain technology to create solutions for social good and sustainability.',
        tags: ['Blockchain', 'Sustainability', 'Social Impact'],
        prize: '$25,000',
        dateRange: 'April 5-7, 2024',
        startAt: now + twoWeeks,
        endAt: now + twoWeeks + (3 * 24 * 60 * 60 * 1000),
        criteria: [
          { id: 'innovation', label: 'Innovation', max: 10 },
          { id: 'technical', label: 'Technical Implementation', max: 10 },
          { id: 'sustainability', label: 'Sustainability Impact', max: 10 },
          { id: 'feasibility', label: 'Feasibility', max: 10 },
        ],
      },
      {
        title: 'FinTech Revolution',
        org: 'BankTech Solutions',
        organizerId: users[0].id, // Alice
        description: 'Revolutionize financial services with cutting-edge technology solutions.',
        tags: ['FinTech', 'Banking', 'Finance'],
        prize: '$75,000',
        dateRange: 'May 10-12, 2024',
        startAt: now - oneWeek, // Past hackathon
        endAt: now - oneWeek + (3 * 24 * 60 * 60 * 1000),
        criteria: [
          { id: 'innovation', label: 'Innovation', max: 10 },
          { id: 'security', label: 'Security', max: 10 },
          { id: 'usability', label: 'User Experience', max: 10 },
          { id: 'scalability', label: 'Scalability', max: 10 },
        ],
      },
    ]);

    console.log('✅ Created sample hackathons');

    // Create sample teams
    const teams = await Team.bulkCreate([
      {
        name: 'AI Innovators',
        hackathonId: hackathons[0].id, // AI Innovation Challenge
      },
      {
        name: 'Blockchain Builders',
        hackathonId: hackathons[1].id, // Blockchain for Good
      },
      {
        name: 'FinTech Pioneers',
        hackathonId: hackathons[2].id, // FinTech Revolution
      },
      {
        name: 'Tech Titans',
        hackathonId: hackathons[0].id, // AI Innovation Challenge
      },
    ]);

    console.log('✅ Created sample teams');

    // Add team members
    await TeamMember.bulkCreate([
      { teamId: teams[0].id, userId: users[1].id }, // Bob in AI Innovators
      { teamId: teams[0].id, userId: users[3].id }, // David in AI Innovators
      { teamId: teams[1].id, userId: users[5].id }, // Frank in Blockchain Builders
      { teamId: teams[2].id, userId: users[1].id }, // Bob in FinTech Pioneers
      { teamId: teams[3].id, userId: users[3].id }, // David in Tech Titans
      { teamId: teams[3].id, userId: users[5].id }, // Frank in Tech Titans
    ]);

    console.log('✅ Added team members');

    // Create sample submissions
    const submissions = await Submission.bulkCreate([
      {
        hackathonId: hackathons[0].id,
        teamId: teams[0].id,
        title: 'AI-Powered Healthcare Assistant',
        description: 'An intelligent healthcare assistant that helps patients manage their health using AI and machine learning.',
        repoUrl: 'https://github.com/ai-innovators/healthcare-assistant',
        figmaUrl: 'https://figma.com/ai-healthcare-design',
        driveUrl: 'https://drive.google.com/ai-healthcare-docs',
        deckUrl: 'https://slides.com/ai-healthcare-pitch',
      },
      {
        hackathonId: hackathons[1].id,
        teamId: teams[1].id,
        title: 'GreenChain - Carbon Credit Marketplace',
        description: 'A blockchain-based marketplace for carbon credits that promotes environmental sustainability.',
        repoUrl: 'https://github.com/blockchain-builders/greenchain',
        figmaUrl: 'https://figma.com/greenchain-design',
        driveUrl: 'https://drive.google.com/greenchain-docs',
        deckUrl: 'https://slides.com/greenchain-pitch',
      },
      {
        hackathonId: hackathons[2].id,
        teamId: teams[2].id,
        title: 'SecurePay - Next-Gen Payment Platform',
        description: 'A secure and scalable payment platform with advanced fraud detection and real-time processing.',
        repoUrl: 'https://github.com/fintech-pioneers/securepay',
        figmaUrl: 'https://figma.com/securepay-design',
        driveUrl: 'https://drive.google.com/securepay-docs',
        deckUrl: 'https://slides.com/securepay-pitch',
      },
    ]);

    console.log('✅ Created sample submissions');

    // Create sample evaluations
    await Evaluation.bulkCreate([
      {
        hackathonId: hackathons[0].id,
        submissionId: submissions[0].id,
        judgeId: users[2].id, // Carol
        scores: [
          { criterionId: 'innovation', score: 9 },
          { criterionId: 'technical', score: 8 },
          { criterionId: 'impact', score: 9 },
          { criterionId: 'presentation', score: 7 },
        ],
        feedback: 'Excellent innovation in healthcare AI. The technical implementation is solid and the potential social impact is significant.',
      },
      {
        hackathonId: hackathons[0].id,
        submissionId: submissions[0].id,
        judgeId: users[4].id, // Eva
        scores: [
          { criterionId: 'innovation', score: 8 },
          { criterionId: 'technical', score: 9 },
          { criterionId: 'impact', score: 8 },
          { criterionId: 'presentation', score: 8 },
        ],
        feedback: 'Strong technical foundation with good use of machine learning algorithms. The healthcare application is well thought out.',
      },
      {
        hackathonId: hackathons[2].id,
        submissionId: submissions[2].id,
        judgeId: users[2].id, // Carol
        scores: [
          { criterionId: 'innovation', score: 7 },
          { criterionId: 'security', score: 9 },
          { criterionId: 'usability', score: 8 },
          { criterionId: 'scalability', score: 8 },
        ],
        feedback: 'Excellent security implementation. The platform shows good scalability potential and user experience design.',
      },
    ]);

    console.log('✅ Created sample evaluations');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Seeded data summary:');
    console.log(`- ${users.length} users created`);
    console.log(`- ${hackathons.length} hackathons created`);
    console.log(`- ${teams.length} teams created`);
    console.log(`- ${submissions.length} submissions created`);
    console.log('- 3 evaluations created');
    console.log('\n🔐 Login credentials:');
    console.log('Email: alice@example.com (organizer)');
    console.log('Email: bob@example.com (participant)');
    console.log('Email: carol@example.com (judge)');
    console.log('Password: password123 (for all users)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  connectDatabase()
    .then(() => seedData())
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedData };
