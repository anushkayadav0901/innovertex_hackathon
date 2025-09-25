import { useState, useEffect } from 'react';

// Types for the Universe system
export interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  category: string;
  scale: number; // Planet size multiplier
  position: [number, number, number]; // 3D position in universe
  startDate: string;
  endDate: string;
  color: string;
  description?: string;
  participantCount?: number;
  prizePool?: string;
}

export interface Team {
  id: string;
  teamName: string;
  stageIndex: number; // 0-4 for the 5 stages
  avatarColor: string;
  hackathonId: string; // Which hackathon this team belongs to
  members?: string[];
  score?: number;
}

export interface Constellation {
  organizer: string;
  hackathons: Hackathon[];
  color: string;
}

// Sample hackathon data
const SAMPLE_HACKATHONS: Hackathon[] = [
  {
    id: 'innovertex-2024',
    name: 'InnovertEx 2024',
    organizer: 'TechCorp',
    category: 'AI/ML',
    scale: 1.2,
    position: [0, 0, 0],
    startDate: '2024-03-15',
    endDate: '2024-03-17',
    color: '#6366f1',
    description: 'Premier AI/ML hackathon focusing on innovation',
    participantCount: 500,
    prizePool: '₹42,00,000'
  },
  {
    id: 'web3-summit',
    name: 'Web3 Summit Hack',
    organizer: 'TechCorp',
    category: 'Blockchain',
    scale: 1.0,
    position: [15, 5, -10],
    startDate: '2024-04-20',
    endDate: '2024-04-22',
    color: '#8b5cf6',
    description: 'Decentralized future building hackathon',
    participantCount: 300,
    prizePool: '₹25,20,000'
  },
  {
    id: 'green-tech-challenge',
    name: 'Green Tech Challenge',
    organizer: 'EcoInnovate',
    category: 'Sustainability',
    scale: 0.9,
    position: [-20, -3, 8],
    startDate: '2024-05-10',
    endDate: '2024-05-12',
    color: '#10b981',
    description: 'Building solutions for environmental challenges',
    participantCount: 250,
    prizePool: '₹21,00,000'
  },
  {
    id: 'fintech-revolution',
    name: 'FinTech Revolution',
    organizer: 'FinanceHub',
    category: 'Finance',
    scale: 1.1,
    position: [8, -8, 15],
    startDate: '2024-06-05',
    endDate: '2024-06-07',
    color: '#f59e0b',
    description: 'Revolutionizing financial services',
    participantCount: 400,
    prizePool: '₹33,60,000'
  },
  {
    id: 'health-hack',
    name: 'HealthTech Hack',
    organizer: 'MedTech Solutions',
    category: 'Healthcare',
    scale: 1.0,
    position: [-10, 10, -5],
    startDate: '2024-07-15',
    endDate: '2024-07-17',
    color: '#ef4444',
    description: 'Healthcare innovation for better lives',
    participantCount: 350,
    prizePool: '₹29,40,000'
  },
  {
    id: 'game-dev-jam',
    name: 'Game Dev Jam',
    organizer: 'GameStudio',
    category: 'Gaming',
    scale: 0.8,
    position: [12, 0, 20],
    startDate: '2024-08-20',
    endDate: '2024-08-22',
    color: '#ec4899',
    description: 'Create the next gaming sensation',
    participantCount: 200,
    prizePool: '₹16,80,000'
  },
  {
    id: 'iot-connect',
    name: 'IoT Connect',
    organizer: 'TechCorp',
    category: 'IoT',
    scale: 0.9,
    position: [5, 8, -15],
    startDate: '2024-09-10',
    endDate: '2024-09-12',
    color: '#06b6d4',
    description: 'Connecting the world through IoT',
    participantCount: 280,
    prizePool: '₹23,52,000'
  }
];

// Sample team data for different hackathons
const SAMPLE_TEAMS: Team[] = [
  // InnovertEx 2024 teams
  {
    id: 'team-1',
    teamName: 'AI Pioneers',
    stageIndex: 3,
    avatarColor: '#ff6b6b',
    hackathonId: 'innovertex-2024',
    members: ['Alice Johnson', 'Bob Smith', 'Charlie Brown'],
    score: 950
  },
  {
    id: 'team-2',
    teamName: 'Neural Networks',
    stageIndex: 2,
    avatarColor: '#4ecdc4',
    hackathonId: 'innovertex-2024',
    members: ['David Wilson', 'Eve Davis', 'Frank Miller'],
    score: 875
  },
  {
    id: 'team-3',
    teamName: 'Deep Learning Squad',
    stageIndex: 4,
    avatarColor: '#45b7d1',
    hackathonId: 'innovertex-2024',
    members: ['Grace Lee', 'Henry Taylor', 'Ivy Chen'],
    score: 820
  },
  
  // Web3 Summit teams
  {
    id: 'team-4',
    teamName: 'Blockchain Builders',
    stageIndex: 2,
    avatarColor: '#9b59b6',
    hackathonId: 'web3-summit',
    members: ['Jack Anderson', 'Kate Thompson'],
    score: 780
  },
  {
    id: 'team-5',
    teamName: 'DeFi Innovators',
    stageIndex: 1,
    avatarColor: '#e74c3c',
    hackathonId: 'web3-summit',
    members: ['Liam Garcia', 'Maya Patel'],
    score: 650
  },
  
  // Green Tech Challenge teams
  {
    id: 'team-6',
    teamName: 'Eco Warriors',
    stageIndex: 3,
    avatarColor: '#2ecc71',
    hackathonId: 'green-tech-challenge',
    members: ['Noah Kim', 'Olivia Rodriguez'],
    score: 890
  },
  
  // FinTech Revolution teams
  {
    id: 'team-7',
    teamName: 'Payment Pioneers',
    stageIndex: 2,
    avatarColor: '#f39c12',
    hackathonId: 'fintech-revolution',
    members: ['Paul Singh', 'Quinn Foster'],
    score: 720
  },
  
  // HealthTech Hack teams
  {
    id: 'team-8',
    teamName: 'Medical Minds',
    stageIndex: 1,
    avatarColor: '#e67e22',
    hackathonId: 'health-hack',
    members: ['Rachel Green', 'Sam Wilson'],
    score: 680
  }
];

// Hook for managing universe data
export const useUniverseData = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>(SAMPLE_HACKATHONS);
  const [teams, setTeams] = useState<Team[]>(SAMPLE_TEAMS);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get constellations (grouped by organizer)
  const getConstellations = (): Constellation[] => {
    const organizerGroups = hackathons.reduce((acc, hackathon) => {
      if (!acc[hackathon.organizer]) {
        acc[hackathon.organizer] = [];
      }
      acc[hackathon.organizer].push(hackathon);
      return acc;
    }, {} as Record<string, Hackathon[]>);

    const constellationColors = [
      '#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'
    ];

    return Object.entries(organizerGroups).map(([organizer, hackathons], index) => ({
      organizer,
      hackathons,
      color: constellationColors[index % constellationColors.length]
    }));
  };

  // Get teams for a specific hackathon
  const getTeamsForHackathon = (hackathonId: string): Team[] => {
    return teams.filter(team => team.hackathonId === hackathonId);
  };

  // Select a hackathon (for transitioning to quest map)
  const selectHackathon = (hackathon: Hackathon) => {
    setSelectedHackathon(hackathon);
  };

  // Go back to universe view
  const backToUniverse = () => {
    setSelectedHackathon(null);
  };

  // Add a new hackathon
  const addHackathon = (hackathon: Omit<Hackathon, 'id'>) => {
    const newHackathon: Hackathon = {
      ...hackathon,
      id: `hackathon-${Date.now()}`
    };
    setHackathons(prev => [...prev, newHackathon]);
  };

  // Update team progress
  const updateTeamStage = (teamId: string, newStageIndex: number) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, stageIndex: Math.max(0, Math.min(4, newStageIndex)) }
        : team
    ));
  };

  // Get hackathon statistics
  const getHackathonStats = (hackathonId: string) => {
    const hackathonTeams = getTeamsForHackathon(hackathonId);
    const totalTeams = hackathonTeams.length;
    const completedTeams = hackathonTeams.filter(team => team.stageIndex >= 4).length;
    const averageProgress = totalTeams > 0 
      ? hackathonTeams.reduce((sum, team) => sum + team.stageIndex, 0) / totalTeams 
      : 0;

    return {
      totalTeams,
      completedTeams,
      averageProgress: Math.round(averageProgress * 100) / 100,
      completionRate: totalTeams > 0 ? Math.round((completedTeams / totalTeams) * 100) : 0
    };
  };

  return {
    // Data
    hackathons,
    teams,
    selectedHackathon,
    isLoading,
    
    // Computed data
    constellations: getConstellations(),
    
    // Actions
    selectHackathon,
    backToUniverse,
    addHackathon,
    updateTeamStage,
    
    // Utilities
    getTeamsForHackathon,
    getHackathonStats
  };
};

export default useUniverseData;
