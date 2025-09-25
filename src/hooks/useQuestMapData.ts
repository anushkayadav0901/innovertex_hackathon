import { useState, useEffect } from 'react';

export interface Stage {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  type: 'gate' | 'valley' | 'tower' | 'arena' | 'podium';
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  stageIndex: number;
  submissionLink?: string;
  color: string;
  rank?: number;
  score?: number;
}

// Default stages configuration
const DEFAULT_STAGES: Stage[] = [
  {
    id: 'registration',
    name: 'Registration Gate',
    description: 'Teams register and begin their hackathon journey',
    position: [-20, 0, 0],
    type: 'gate'
  },
  {
    id: 'idea',
    name: 'Idea Valley',
    description: 'Teams brainstorm and refine their innovative ideas',
    position: [-10, -2, 0],
    type: 'valley'
  },
  {
    id: 'prototype',
    name: 'Prototype Tower',
    description: 'Teams build and develop their prototypes',
    position: [0, 0, 0],
    type: 'tower'
  },
  {
    id: 'pitch',
    name: 'Pitch Arena',
    description: 'Teams present their solutions to judges',
    position: [10, -1, 0],
    type: 'arena'
  },
  {
    id: 'results',
    name: "Winner's Podium",
    description: 'Champions are crowned and celebrated',
    position: [20, 0, 0],
    type: 'podium'
  }
];

// Sample teams data
const DEFAULT_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Code Crusaders',
    members: ['Alice Johnson', 'Bob Smith', 'Charlie Brown'],
    stageIndex: 3,
    color: '#ff6b6b',
    rank: 1,
    score: 950,
    submissionLink: 'https://github.com/codecrusaders/hackathon-project'
  },
  {
    id: '2',
    name: 'Tech Titans',
    members: ['David Wilson', 'Eve Davis', 'Frank Miller'],
    stageIndex: 2,
    color: '#4ecdc4',
    rank: 2,
    score: 875,
    submissionLink: 'https://github.com/techtitans/innovation-app'
  },
  {
    id: '3',
    name: 'Innovation Squad',
    members: ['Grace Lee', 'Henry Taylor', 'Ivy Chen'],
    stageIndex: 4,
    color: '#45b7d1',
    rank: 3,
    score: 820,
    submissionLink: 'https://github.com/innovationsquad/future-tech'
  },
  {
    id: '4',
    name: 'Digital Dynamos',
    members: ['Jack Anderson', 'Kate Thompson', 'Liam Garcia'],
    stageIndex: 1,
    color: '#f9ca24',
    score: 720
  },
  {
    id: '5',
    name: 'Byte Builders',
    members: ['Mia Rodriguez', 'Noah Martinez', 'Olivia White'],
    stageIndex: 2,
    color: '#6c5ce7',
    score: 680
  },
  {
    id: '6',
    name: 'Pixel Pirates',
    members: ['Peter Parker', 'Quinn Adams', 'Ruby Rose'],
    stageIndex: 0,
    color: '#fd79a8',
    score: 450
  },
  {
    id: '7',
    name: 'Logic Legends',
    members: ['Sam Wilson', 'Tara Singh', 'Uma Patel'],
    stageIndex: 3,
    color: '#00b894',
    score: 780
  },
  {
    id: '8',
    name: 'Data Dragons',
    members: ['Victor Hugo', 'Wendy Clark', 'Xavier King'],
    stageIndex: 1,
    color: '#fdcb6e',
    score: 590
  }
];

export const useQuestMapData = () => {
  const [stages, setStages] = useState<Stage[]>(DEFAULT_STAGES);
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading data from API
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Update team stage
  const updateTeamStage = (teamId: string, newStageIndex: number) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === teamId 
          ? { ...team, stageIndex: Math.max(0, Math.min(newStageIndex, stages.length - 1)) }
          : team
      )
    );
  };

  // Update team rank
  const updateTeamRank = (teamId: string, rank: number) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === teamId 
          ? { ...team, rank }
          : team
      )
    );
  };

  // Add new team
  const addTeam = (newTeam: Omit<Team, 'id'>) => {
    const id = (teams.length + 1).toString();
    setTeams(prevTeams => [...prevTeams, { ...newTeam, id }]);
  };

  // Remove team
  const removeTeam = (teamId: string) => {
    setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
  };

  // Get teams by stage
  const getTeamsByStage = (stageIndex: number) => {
    return teams.filter(team => team.stageIndex === stageIndex);
  };

  // Get top teams (with ranks)
  const getTopTeams = () => {
    return teams
      .filter(team => team.rank)
      .sort((a, b) => (a.rank || 0) - (b.rank || 0));
  };

  // Get team position for 3D scene
  const getTeamPosition = (team: Team): [number, number, number] => {
    const stage = stages[team.stageIndex];
    if (!stage) return [0, 0, 0];
    
    // Calculate offset to prevent overlapping
    const teamsAtStage = getTeamsByStage(team.stageIndex);
    const teamIndex = teamsAtStage.findIndex(t => t.id === team.id);
    const totalTeams = teamsAtStage.length;
    
    // Arrange teams in a circle around the stage
    const angle = (teamIndex / totalTeams) * Math.PI * 2;
    const radius = Math.max(1, totalTeams * 0.3);
    
    const offsetX = Math.cos(angle) * radius;
    const offsetZ = Math.sin(angle) * radius;
    
    return [
      stage.position[0] + offsetX,
      stage.position[1] + 1,
      stage.position[2] + offsetZ
    ];
  };

  return {
    stages,
    teams,
    isLoading,
    updateTeamStage,
    updateTeamRank,
    addTeam,
    removeTeam,
    getTeamsByStage,
    getTopTeams,
    getTeamPosition
  };
};
