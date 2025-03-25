// src/utils/scoring.tsx
export class ScoreManager {
  private scores: Map<string, GameScore> = new Map();
  private settings: any; 

  constructor(settingsInstance: any) {
    this.settings = settingsInstance; 
    this.loadScores();
  }

  private async loadScores() {
    try {
      const savedScores = await this.settings.get("cyberquest_scores"); 
      if (savedScores) {
        this.scores = new Map(JSON.parse(savedScores));
      }
    } catch (error) {
      console.error("Error loading scores:", error);
    }
  }

  async addPoints(username: string, points: number): Promise<void> {
    const score = this.scores.get(username) || {
      username,
      points: 0,
      badges: [],
    };
    score.points += points;
    this.checkBadges(score);
    this.scores.set(username, score);

    try {
      await this.settings.put("cyberquest_scores", JSON.stringify([...this.scores])); 
    } catch (error) {
      console.error("Error saving scores:", error);
    }
  }

  getScore(username: string): GameScore | undefined {
    return this.scores.get(username);
  }

  getLeaderboard(): GameScore[] {
    return Array.from(this.scores.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);
  }

  private checkBadges(score: GameScore): void {
    if (
      score.points >= 10 &&
      !score.badges.some((b) => b.type === "cyber-guardian")
    ) {
      score.badges.push({
        type: "cyber-guardian",
        earnedAt: new Date(),
      });
    }
  }
}
