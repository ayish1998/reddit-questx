/**
 * Challenge data model
 */
export interface Challenge {
    id: string;
    title: string;
    scenario: string;
    correctAnswer: string;
    explanation: string;
    icon?: string;
  }
  
  /**
   * User response to a challenge
   */
  export interface ChallengeResponse {
    challengeId: string;
    userId: string;
    userAnswer: string;
    isCorrect: boolean;
    timestamp: number;
  }
  
  /**
   * User Score model for leaderboard
   */
  export interface UserScore {
    userId: string;
    score: number;
    username?: string;
  }
  
  /**
   * Badge model for the badge system
   */
  export interface Badge {
    name: string;
    icon: string;
    requiredScore: number;
  }
  
  /**
   * User Progress model
   */
  export interface UserProgress {
    userId: string;
    completedChallenges: string[];
    currentScore: number;
    badges: Badge[];
  }
  
  /**
   * Action type for interactive responses
   */
  export type ActionType = 'report' | 'block' | 'delete' | 'ignore';