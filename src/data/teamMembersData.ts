import { TeamMember } from '../components/team/EnhancedTeamBuilderModal'

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'Full Stack Developer',
    skills: [
      { name: 'React', level: 90 },
      { name: 'Node.js', level: 85 },
      { name: 'TypeScript', level: 80 },
      { name: 'Python', level: 75 },
      { name: 'AWS', level: 70 }
    ],
    bio: 'Passionate developer with 5+ years experience building scalable web applications. Love working on innovative projects and mentoring junior developers.',
    experience: '5+ years',
    location: 'San Francisco, CA',
    availability: 'Full-time',
    interests: ['AI/ML', 'Web3', 'Mobile Development', 'Open Source'],
    github: 'https://github.com/alexchen',
    portfolio: 'https://alexchen.dev',
    personalityTraits: {
      creativity: 'high',
      leadership: 'moderate',
      teamwork: 'high',
      organization: 'high',
      problemSolving: 'high',
      adaptability: 'high'
    }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    role: 'UI/UX Designer',
    skills: [
      { name: 'Figma', level: 95 },
      { name: 'Adobe XD', level: 88 },
      { name: 'Prototyping', level: 92 },
      { name: 'User Research', level: 85 },
      { name: 'HTML/CSS', level: 70 }
    ],
    bio: 'Creative designer focused on user-centered design and innovative digital experiences. Passionate about accessibility and inclusive design.',
    experience: '4+ years',
    location: 'New York, NY',
    availability: 'Part-time',
    interests: ['Design Systems', 'Accessibility', 'AR/VR', 'Psychology'],
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    personalityTraits: {
      creativity: 'high',
      leadership: 'low',
      teamwork: 'high',
      organization: 'moderate',
      problemSolving: 'high',
      adaptability: 'high'
    }
  },
  {
    id: '3',
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'Data Scientist',
    skills: [
      { name: 'Python', level: 93 },
      { name: 'Machine Learning', level: 88 },
      { name: 'TensorFlow', level: 82 },
      { name: 'SQL', level: 90 },
      { name: 'R', level: 75 }
    ],
    bio: 'Data scientist specializing in ML algorithms and predictive analytics. Experienced in healthcare and fintech applications.',
    experience: '6+ years',
    location: 'Austin, TX',
    availability: 'Full-time',
    interests: ['AI/ML', 'Healthcare Tech', 'Climate Tech', 'Statistics'],
    github: 'https://github.com/marcusr',
    personalityTraits: {
      creativity: 'moderate',
      leadership: 'high',
      teamwork: 'moderate',
      organization: 'high',
      problemSolving: 'high',
      adaptability: 'moderate'
    }
  },
  {
    id: '4',
    name: 'Emily Zhang',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    role: 'Product Manager',
    skills: [
      { name: 'Product Strategy', level: 92 },
      { name: 'Agile/Scrum', level: 88 },
      { name: 'Analytics', level: 85 },
      { name: 'User Research', level: 80 },
      { name: 'SQL', level: 60 }
    ],
    bio: 'Product manager with expertise in bringing innovative ideas to market. Strong background in fintech and edtech.',
    experience: '7+ years',
    location: 'Seattle, WA',
    availability: 'Full-time',
    interests: ['Fintech', 'EdTech', 'Sustainability', 'Leadership'],
    linkedin: 'https://linkedin.com/in/emilyzhang',
    personalityTraits: {
      creativity: 'high',
      leadership: 'high',
      teamwork: 'high',
      organization: 'high',
      problemSolving: 'high',
      adaptability: 'high'
    }
  },
  {
    id: '5',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'DevOps Engineer',
    skills: [
      { name: 'Docker', level: 90 },
      { name: 'Kubernetes', level: 85 },
      { name: 'AWS', level: 88 },
      { name: 'Python', level: 70 },
      { name: 'Terraform', level: 75 }
    ],
    bio: 'DevOps engineer passionate about automation and cloud infrastructure. Expert in CI/CD pipelines and microservices architecture.',
    experience: '3+ years',
    location: 'Denver, CO',
    availability: 'Full-time',
    interests: ['Cloud Computing', 'Automation', 'Security', 'Monitoring'],
    github: 'https://github.com/davidkim',
    personalityTraits: {
      creativity: 'moderate',
      leadership: 'low',
      teamwork: 'high',
      organization: 'high',
      problemSolving: 'high',
      adaptability: 'high'
    }
  },
  {
    id: '6',
    name: 'Lisa Wang',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    role: 'Frontend Developer',
    skills: [
      { name: 'React', level: 88 },
      { name: 'Vue.js', level: 85 },
      { name: 'TypeScript', level: 90 },
      { name: 'CSS', level: 95 },
      { name: 'JavaScript', level: 92 }
    ],
    bio: 'Frontend developer with a keen eye for design and user experience. Passionate about creating beautiful, performant web applications.',
    experience: '2+ years',
    location: 'Portland, OR',
    availability: 'Part-time',
    interests: ['Web Design', 'Animation', 'Performance', 'Accessibility'],
    github: 'https://github.com/lisawang',
    portfolio: 'https://lisawang.dev',
    personalityTraits: {
      creativity: 'high',
      leadership: 'low',
      teamwork: 'high',
      organization: 'moderate',
      problemSolving: 'high',
      adaptability: 'high'
    }
  },
  {
    id: '7',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'Backend Developer',
    skills: [
      { name: 'Node.js', level: 90 },
      { name: 'Python', level: 85 },
      { name: 'PostgreSQL', level: 88 },
      { name: 'MongoDB', level: 80 },
      { name: 'Redis', level: 75 }
    ],
    bio: 'Backend developer specializing in scalable APIs and database design. Experienced in building high-performance systems.',
    experience: '4+ years',
    location: 'Chicago, IL',
    availability: 'Full-time',
    interests: ['API Design', 'Database Optimization', 'Microservices', 'Security'],
    github: 'https://github.com/jameswilson',
    personalityTraits: {
      creativity: 'moderate',
      leadership: 'moderate',
      teamwork: 'high',
      organization: 'high',
      problemSolving: 'high',
      adaptability: 'moderate'
    }
  },
  {
    id: '8',
    name: 'Maria Garcia',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'Mobile Developer',
    skills: [
      { name: 'React Native', level: 90 },
      { name: 'iOS', level: 85 },
      { name: 'Android', level: 80 },
      { name: 'Flutter', level: 75 },
      { name: 'JavaScript', level: 88 }
    ],
    bio: 'Mobile developer with expertise in cross-platform development. Passionate about creating intuitive mobile experiences.',
    experience: '3+ years',
    location: 'Miami, FL',
    availability: 'Full-time',
    interests: ['Mobile UX', 'Cross-platform', 'Performance', 'AR/VR'],
    github: 'https://github.com/mariagarcia',
    personalityTraits: {
      creativity: 'high',
      leadership: 'low',
      teamwork: 'high',
      organization: 'moderate',
      problemSolving: 'high',
      adaptability: 'high'
    }
  },
  {
    id: '9',
    name: 'Ryan Thompson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'Blockchain Developer',
    skills: [
      { name: 'Solidity', level: 90 },
      { name: 'Web3', level: 85 },
      { name: 'JavaScript', level: 80 },
      { name: 'Python', level: 75 },
      { name: 'React', level: 70 }
    ],
    bio: 'Blockchain developer with deep expertise in smart contracts and DeFi protocols. Passionate about decentralized technologies.',
    experience: '2+ years',
    location: 'Remote',
    availability: 'Full-time',
    interests: ['DeFi', 'NFTs', 'Smart Contracts', 'Cryptocurrency'],
    github: 'https://github.com/ryanthompson',
    personalityTraits: {
      creativity: 'high',
      leadership: 'moderate',
      teamwork: 'moderate',
      organization: 'high',
      problemSolving: 'high',
      adaptability: 'high'
    }
  },
  {
    id: '10',
    name: 'Anna Lee',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    role: 'QA Engineer',
    skills: [
      { name: 'Testing', level: 90 },
      { name: 'Selenium', level: 85 },
      { name: 'Python', level: 80 },
      { name: 'JavaScript', level: 75 },
      { name: 'Cypress', level: 88 }
    ],
    bio: 'QA engineer focused on ensuring high-quality software delivery. Expert in automated testing and quality assurance processes.',
    experience: '3+ years',
    location: 'Boston, MA',
    availability: 'Full-time',
    interests: ['Test Automation', 'Quality Assurance', 'Performance Testing', 'CI/CD'],
    github: 'https://github.com/annalee',
    personalityTraits: {
      creativity: 'moderate',
      leadership: 'low',
      teamwork: 'high',
      organization: 'high',
      problemSolving: 'high',
      adaptability: 'moderate'
    }
  }
]

// Filter function to find matching team members
export const findMatchingMembers = (criteria: any, members: TeamMember[] = mockTeamMembers): TeamMember[] => {
  return members.filter(member => {
    // Check personality traits compatibility
    const personalityMatch = Object.entries(criteria.personalityTraits).some(([trait, importance]) => {
      if (importance === null) return true // If not specified, consider it a match
      const memberTrait = member.personalityTraits[trait as keyof typeof member.personalityTraits]
      
      // Convert categorical values to numerical scores for comparison
      const importanceScore = importance === 'high' ? 3 : importance === 'moderate' ? 2 : 1
      const memberScore = memberTrait === 'high' ? 3 : memberTrait === 'moderate' ? 2 : memberTrait === 'low' ? 1 : 0
      
      return Math.abs(importanceScore - memberScore) <= 1 // Allow 1 point difference
    })

    // Check tech stack requirements
    const memberSkills = member.skills.map(s => s.name.toLowerCase())
    const requiredSkills = criteria.techStack.required.map((s: string) => s.toLowerCase())
    const preferredSkills = criteria.techStack.preferred.map((s: string) => s.toLowerCase())
    
    const hasRequiredSkills = requiredSkills.length === 0 || 
      requiredSkills.some((skill: string) => memberSkills.includes(skill))
    
    const hasPreferredSkills = preferredSkills.length === 0 || 
      preferredSkills.some((skill: string) => memberSkills.includes(skill))

    // Check experience level
    const experienceMatch = criteria.techStack.experience === 'any' || 
      (criteria.techStack.experience === 'junior' && member.experience.includes('2+')) ||
      (criteria.techStack.experience === 'mid' && member.experience.includes('2-5')) ||
      (criteria.techStack.experience === 'senior' && member.experience.includes('5+'))

    // Check availability
    const availabilityMatch = criteria.availability === 'any' || 
      member.availability.toLowerCase() === criteria.availability

    return personalityMatch && hasRequiredSkills && hasPreferredSkills && experienceMatch && availabilityMatch
  })
}

