// src/types.ts
interface ChallengeScenario {
    id: string;
    description: string;
    correctAnswers: string[];
  }
  
  interface GameScore {
    username: string;
    points: number;
    badges: Badge[];
  }
  
  interface Badge {
    type: string;
    earnedAt: Date;
  }