// src/main.tsx
import { Devvit } from "@devvit/public-api";
import { challengeScenarios } from "./scenerios";
import { validateAnswer } from "../src/utils/validations";
import { ScoreManager } from "../src/utils/scoring";
import React from "react"

Devvit.configure({
  redditAPI: true,
});

Devvit.addMenuItem({
  label: "Start CyberQuest Challenge",
  location: "subreddit",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Creating a CyberQuest Challenge...");

    try {
      const subreddit = await reddit.getCurrentSubreddit();
      if (!subreddit || !subreddit.name) {
        throw new Error("Failed to fetch subreddit information.");
      }

      const randomScenario =
        challengeScenarios[
          Math.floor(Math.random() * challengeScenarios.length)
        ];

      const post = await reddit.submitPost({
        title: "🛡 CyberQuest: Online Safety Challenge! 🛡",
        subredditName: subreddit.name,
        postType: "CyberQuest",
        blocks: [
          {
            type: "vstack",
            alignment: "center middle",
            children: [
              {
                type: "text",
                size: "large",
                text: "🛡 CyberQuest Challenge! 🛡",
              },
              {
                type: "text",
                size: "medium",
                text: randomScenario.description,
              },
            ],
          },
        ],
        metadata: {
          scenarioId: randomScenario.id,
        },
      });

      ui.navigateTo(post);
    } catch (error) {
      ui.showToast("Error creating CyberQuest Challenge.");
      console.error("Error creating post:", error);
    }
  },
});

Devvit.addCustomPostType({
  name: "CyberQuest",
  height: "tall",
  render: async (context) => {
    const { reddit, ui } = context;
    const [scoreManager] = React.useState(() => new ScoreManager());
    const [currentScenario, setCurrentScenario] =
      React.useState<ChallengeScenario | null>(null);
    const [feedback, setFeedback] = React.useState("");
    const [leaderboard, setLeaderboard] = React.useState<GameScore[]>([]);
    const [username, setUsername] = React.useState("");

    React.useEffect(() => {
      const loadUser = async () => {
        const user = await reddit.getCurrentUser();
        setUsername(user?.username || "Guest");
      };
      loadUser();
    }, []);

    React.useEffect(() => {
      const initializeScenario = async () => {
        if (!context.postId) return;
        
        try {
          const post = await reddit.getPostById(context.postId);
          const scenarioId = post?.metadata?.scenarioId;
          const scenario = challengeScenarios.find((s) => s.id === scenarioId);
          setCurrentScenario(scenario || challengeScenarios[0]);
        } catch (error) {
          console.error("Error fetching post:", error);
          setCurrentScenario(challengeScenarios[0]); // Fallback to first scenario
        }
      };
      initializeScenario();
    }, [context.postId]);

    React.useEffect(() => {
      const fetchCommentsAndUpdateScores = async () => {
        if (!context.postId || !currentScenario) return;

        try {
          const comments = await reddit.getComments({ postId: context.postId });
          comments.forEach((comment) => {
            const text = comment?.body?.toLowerCase().trim() || "";
            const username = comment.author?.name || "Unknown";

            if (validateAnswer(text, currentScenario.id)) {
              scoreManager.addPoints(username, 1);
              setFeedback(
                "Correct! \u2705\uFE0F " + username + " earned a point."
              );
            } else {
              setFeedback(`❌ Incorrect! ${username}, try again.`);
            }
          });

          setLeaderboard(scoreManager.getLeaderboard());
        } catch (error) {
          console.error("Error fetching comments:", error);
          setFeedback("Failed to fetch comments. Please try again later.");
        }
      };

      fetchCommentsAndUpdateScores();
      const interval = setInterval(fetchCommentsAndUpdateScores, 5000);
      return () => clearInterval(interval);
    }, [context.postId, currentScenario]);

    if (!currentScenario) {
      return ui.render({
        type: "vstack",
        alignment: "center middle",
        padding: "large",
        grow: true,
        children: [
          {
            type: "spinner",
            size: "large",
          },
          {
            type: "text",
            size: "medium",
            weight: "bold",
            text: "Loading challenge...",
          },
        ],
      });
    }

    return ui.render({
      type: "vstack",
      height: "100%",
      width: "100%",
      gap: "medium",
      alignment: "top center",
      padding: "medium",
      backgroundColor: "#DAE0E6",
      children: [
        // Header
        {
          type: "hstack",
          width: "100%",
          alignment: "center",
          padding: "small",
          backgroundColor: "#FFFFFF",
          cornerRadius: "medium",
          children: [
            {
              type: "text",
              size: "xlarge",
              weight: "bold",
              color: "#FF4500",
              text: "🛡 CyberQuest",
            },
          ],
        },

        // Challenge Card
        {
          type: "vstack",
          width: "100%",
          padding: "large",
          backgroundColor: "#FFFFFF",
          cornerRadius: "medium",
          shadow: "small",
          gap: "medium",
          children: [
            {
              type: "text",
              size: "large",
              weight: "bold",
              color: "#1A1A1B",
              text: "Challenge:",
            },
            {
              type: "text",
              size: "medium",
              color: "#1A1A1B",
              text: currentScenario.description,
            },
            {
              type: "vstack",
              gap: "small",
              padding: "small",
              backgroundColor: "#F6F7F8",
              cornerRadius: "small",
              children: [
                {
                  type: "text",
                  size: "small",
                  weight: "bold",
                  color: "#787C7E",
                  text: "Hint:",
                },
                {
                  type: "text",
                  size: "small",
                  color: "#787C7E",
                  text: `Correct answers include: ${currentScenario.correctAnswers.join(
                    ", "
                  )}`,
                },
              ],
            },
          ],
        },

        // User Progress
        {
          type: "vstack",
          width: "100%",
          padding: "medium",
          backgroundColor: "#FFFFFF",
          cornerRadius: "medium",
          gap: "small",
          children: [
            {
              type: "text",
              size: "large",
              weight: "bold",
              color: "#1A1A1B",
              text: "Your Progress",
            },
            {
              type: "hstack",
              alignment: "center",
              gap: "medium",
              children: [
                {
                  type: "vstack",
                  alignment: "center",
                  children: [
                    {
                      type: "text",
                      size: "xlarge",
                      weight: "bold",
                      color: "#FF4500",
                      text: `${scoreManager.getScore(username)?.points || 0}`,
                    },
                    {
                      type: "text",
                      size: "small",
                      color: "#787C7E",
                      text: "Points",
                    },
                  ],
                },
                {
                  type: "vstack",
                  alignment: "center",
                  children: [
                    {
                      type: "text",
                      size: "xlarge",
                      weight: "bold",
                      color: "#FF4500",
                      text: `${
                        scoreManager
                          .getScore(username)
                          ?.badges.filter((b) => b.type === "cyber-guardian")
                          .length || 0
                      }`,
                    },
                    {
                      type: "text",
                      size: "small",
                      color: "#787C7E",
                      text: "Badges",
                    },
                  ],
                },
              ],
            },
            {
              type: "vstack",
              width: "100%",
              gap: "xsmall",
              children: [
                {
                  type: "text",
                  size: "small",
                  weight: "bold",
                  color: "#787C7E",
                  text: "Next badge at 10 points",
                },
                {
                  type: "hstack",
                  width: "100%",
                  height: "12px",
                  backgroundColor: "#EDEFF1",
                  cornerRadius: "full",
                  children: [
                    {
                      type: "hstack",
                      width: `${Math.min(
                        100,
                        (scoreManager.getScore(username)?.points || 0) * 10
                      )}%`,
                      height: "100%",
                      backgroundColor: "#FF4500",
                      cornerRadius: "full",
                    },
                  ],
                },
              ],
            },
          ],
        },

        // Feedback Section
        feedback
          ? {
              type: "vstack",
              width: "100%",
              padding: "medium",
              backgroundColor: "#FFFFFF",
              cornerRadius: "medium",
              children: [
                {
                  type: "text",
                  size: "medium",
                  weight: "bold",
                  color: feedback.includes("Correct") ? "#24A0ED" : "#FF4500",
                  text: feedback,
                },
              ],
            }
          : null,

        // Leaderboard
        {
          type: "vstack",
          width: "100%",
          padding: "medium",
          backgroundColor: "#FFFFFF",
          cornerRadius: "medium",
          gap: "small",
          children: [
            {
              type: "text",
              size: "large",
              weight: "bold",
              color: "#1A1A1B",
              text: "🏆 Leaderboard",
            },
            ...(leaderboard.length > 0
              ? leaderboard.map((entry, index) => ({
                  type: "hstack",
                  width: "100%",
                  alignment: "center",
                  gap: "medium",
                  padding: "small",
                  children: [
                    {
                      type: "text",
                      size: "medium",
                      weight: "bold",
                      color: "#1A1A1B",
                      text: `${index + 1}.`,
                    },
                    {
                      type: "text",
                      size: "medium",
                      color:
                        entry.username === username ? "#FF4500" : "#1A1A1B",
                      grow: true,
                      text: entry.username,
                    },
                    {
                      type: "hstack",
                      gap: "small",
                      alignment: "center",
                      children: [
                        {
                          type: "text",
                          size: "medium",
                          weight: "bold",
                          color: "#1A1A1B",
                          text: `${entry.points}`,
                        },
                        ...(entry.badges.some(
                          (b) => b.type === "cyber-guardian"
                        )
                          ? [
                              {
                                type: "image",
                                url: "https://www.redditstatic.com/gold/awards/icon/Helpful_Placeholder-16.png",
                                imageHeight: 16,
                                imageWidth: 16,
                              },
                            ]
                          : []),
                      ],
                    },
                  ],
                }))
              : [
                  {
                    type: "text",
                    size: "medium",
                    color: "#787C7E",
                    text: "No scores yet. Be the first to answer!",
                  },
                ]),
          ],
        },

        // Instructions
        {
          type: "vstack",
          width: "100%",
          padding: "medium",
          backgroundColor: "#FFFFFF",
          cornerRadius: "medium",
          gap: "small",
          children: [
            {
              type: "text",
              size: "medium",
              weight: "bold",
              color: "#1A1A1B",
              text: "How to Play",
            },
            {
              type: "text",
              size: "small",
              color: "#787C7E",
              text: "1. Read the challenge above",
            },
            {
              type: "text",
              size: "small",
              color: "#787C7E",
              text: "2. Reply to this post with your answer",
            },
            {
              type: "text",
              size: "small",
              color: "#787C7E",
              text: "3. Earn points for correct answers",
            },
            {
              type: "text",
              size: "small",
              color: "#787C7E",
              text: "4. Climb the leaderboard!",
            },
          ],
        },
      ].filter(Boolean), 
    });
  },
});

export default Devvit;
