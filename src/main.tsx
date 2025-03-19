// Import Statements
import { Devvit } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

// ✅ Add a menu item for moderators to create a CyberQuest post
Devvit.addMenuItem({
  label: 'Start CyberQuest Challenge',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Creating a CyberQuest Challenge...");

    const scenarios = [
      "⚠️ Scenario: You receive an email saying you've won $1,000! What do you do?",
      "⚠️ Scenario: A pop-up appears saying your computer is infected. What do you do?",
      "⚠️ Scenario: You get a text message asking for your password. What do you do?",
      "⚠️ Scenario: A stranger on social media asks for your personal information. What do you do?",
    ];

    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    try {
      const subreddit = await reddit.getCurrentSubreddit();
      if (!subreddit || !subreddit.name) {
        throw new Error("Failed to fetch subreddit information.");
      }

      const post = await reddit.submitPost({
        title: '🛡️ CyberQuest: Online Safety Challenge! 🛡️',
        subredditName: subreddit.name,
        postType: 'CyberQuest',
        blocks: [
          {
            type: "vstack",
            alignment: "center middle",
            children: [
              { type: "text", size: "large", text: "🛡️ CyberQuest Challenge! 🛡️" },
              { type: "text", size: "medium", text: randomScenario },
              { type: "text", size: "small", text: "(Comment: 'Report', 'Ignore', 'Delete', 'Block', or another action)" }
            ]
          }
        ]
      });

      if (!post) {
        throw new Error("Failed to create post.");
      }

      ui.navigateTo(post);
    } catch (error) {
      ui.showToast("Error creating CyberQuest Challenge.");
      console.error("Error creating post:", error);
    }
  },
});

// ✅ CyberQuest Challenge UI
Devvit.addCustomPostType({
  name: 'CyberQuest',
  height: 'regular',
  render: async (context) => {
    const { reddit, useState, useEffect } = context;

    // ✅ State variables
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [leaderboard, setLeaderboard] = useState<{ [username: string]: number }>({});
    const [currentScenario, setCurrentScenario] = useState("⚠️ Loading your CyberQuest challenge...");

    const correctAnswers = new Set(["report", "change", "ignore", "delete", "block"]);

    const scenarios = [
      "⚠️ You receive an email saying you've won $1,000! What do you do?",
      "⚠️ A pop-up appears saying your computer is infected. What do you do?",
      "⚠️ You get a text message asking for your password. What do you do?",
      "⚠️ A stranger on social media asks for your personal information. What do you do?",
    ];

    // ✅ Load a random scenario when the component mounts
    useEffect(() => {
      setCurrentScenario(scenarios[Math.floor(Math.random() * scenarios.length)]);
    }, []);

    // ✅ Fetch comments and update scores
    async function fetchComments() {
      if (!context.postId) {
        setFeedback("Error: Post ID is missing.");
        return;
      }

      try {
        console.log("Fetching comments for post ID:", context.postId);
        const comments = await reddit.getComments({ postId: context.postId });

        if (!Array.isArray(comments)) {
          throw new Error("Invalid comments data received.");
        }

        let newScore = 0;
        let feedbackMessage = "";
        const updatedLeaderboard: { [username: string]: number } = { ...leaderboard };

        for (const comment of comments) {
          const text = comment?.body?.toLowerCase().trim() || "";
          const username = comment.author?.name || "Unknown";

          if (correctAnswers.has(text)) {
            newScore++;
            updatedLeaderboard[username] = (updatedLeaderboard[username] || 0) + 1;
            feedbackMessage = `✅ Correct! ${username} earned a point.`;
          } else {
            feedbackMessage = `❌ Incorrect! ${username}, try again.`;
          }
        }

        setScore(newScore);
        setLeaderboard(updatedLeaderboard);
        setFeedback(feedbackMessage);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setFeedback("Failed to fetch comments. Please try again later.");
      }
    }

    // ✅ Poll for new comments every 5 seconds
    useEffect(() => {
      fetchComments();
      const interval = setInterval(fetchComments, 5000);
      return () => clearInterval(interval);
    }, [context.postId]);

    // ✅ Sort leaderboard by score
    const sortedLeaderboard = Object.entries(leaderboard)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5);

    // ✅ Calculate progress bar width
    const progressBarWidth = Math.min((score / 10) * 100, 100);

    // ✅ Badge system
    const badge = score >= 10 ? "🏆 CyberGuardian Badge Unlocked!" : "";

    return (
      <vstack 
        height="100%" 
        width="100%" 
        gap="medium" 
        alignment="center middle" 
        padding="large" 
        backgroundColor="#f4f4f4" 
        cornerRadius="large"
        shadow="medium"
      >
        <text size="large" weight="bold" color="#1e88e5">🛡️ CyberQuest Challenge! 🛡️</text>
        <text size="medium" weight="bold" color="#333">How safe are you online?</text>

        {/* ✅ Challenge Scenario */}
        <box width="90%" padding="medium" backgroundColor="#ffffff" cornerRadius="medium" shadow="small">
          <text size="medium" weight="bold" color="#d32f2f">{currentScenario}</text>
          <text size="small" color="#666">(Comment: 'Report', 'Ignore', 'Delete', 'Block', or another action)</text>
        </box>

        {/* ✅ Score and Feedback */}
        <text size="medium" weight="bold" color="#388e3c">✅ Your Cyber Score: {score}</text>
        <text size="small" color="#333">{feedback}</text>
        {badge && <text size="medium" weight="bold" color="gold">{badge}</text>}

        {/* ✅ Progress Bar */}
        <hstack width="80%" height="10px" backgroundColor="#ddd" cornerRadius="full">
          <hstack width={`${progressBarWidth}%`} height="100%" backgroundColor="#4caf50" cornerRadius="full" />
        </hstack>
        <text size="small" color="#555">🎯 Complete 10 challenges to earn a badge!</text>

        {/* ✅ Leaderboard */}
        <text size="medium" weight="bold" color="#ff9800">🏆 Leaderboard</text>
        {sortedLeaderboard.length > 0 ? (
          sortedLeaderboard.map(([username, points], index) => (
            <text size="small" key={username} color="#333">
              {index + 1}. {username}: {points} points
            </text>
          ))
        ) : (
          <text size="small" color="#666">No scores yet! Be the first to earn points.</text>
        )}
      </vstack>
    );
  },
});

export default Devvit;
