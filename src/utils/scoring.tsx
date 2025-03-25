// src/utils/scoring.ts
  export class ScoreManager {
    private scores: Map<string, GameScore> = new Map();
    
    addPoints(username: string, points: number): void {
      const score = this.scores.get(username) || { username, points: 0, badges: [] };
      score.points += points;
      this.checkBadges(score);
      this.scores.set(username, score);
    }
  
    private checkBadges(score: GameScore): void {
      if (score.points >= 10 && !score.badges.some(b => b.type === "cyber-guardian")) {
        score.badges.push({
          type: "cyber-guardian",
          earnedAt: new Date()
        });
      }
    }
  
    getLeaderboard(): GameScore[] {
      return Array.from(this.scores.values())
        .sort((a, b) => b.points - a.points)
        .slice(0, 5);
    }
  }