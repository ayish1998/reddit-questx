// src/scenarios.tsx
  export const challengeScenarios: ChallengeScenario[] = [
    {
      id: "phishing-email",
      description: "⚠ You receive an email saying you've won $1,000! What do you do?",
      correctAnswers: ["report", "delete", "ignore"]
    },
    {
      id: "malware-popup",
      description: "⚠ A pop-up appears saying your computer is infected. What do you do?",
      correctAnswers: ["ignore", "close", "block"]
    },
    {
      id: "password-request",
      description: "⚠ You get a text message asking for your password. What do you do?",
      correctAnswers: ["report", "delete", "never-share"]
    },
    {
      id: "social-engineering",
      description: "⚠ A stranger on social media asks for your personal information. What do you do?",
      correctAnswers: ["block", "report", "ignore"]
    }
  ];
  