// main.tsx
import { Devvit, } from "@devvit/public-api";
// Sample cybersecurity challenges
const CHALLENGES = [
    {
        id: "phishing1",
        scenario: "You receive an email claiming to be from Reddit support asking for your password. The sender address is support@redditt.com. What should you do?",
        correctAnswer: "report",
        options: ["report", "ignore", "delete", "block"],
        points: 5,
    },
    {
        id: "scam1",
        scenario: "A user messages you offering free Reddit coins if you click a link. The URL looks suspicious. How do you respond?",
        correctAnswer: "report",
        options: ["report", "ignore", "delete", "block"],
        points: 5,
    },
    {
        id: "moderation1",
        scenario: "As a moderator, you see a post containing personal information about another user. What action should you take?",
        correctAnswer: "delete",
        options: ["report", "ignore", "delete", "block"],
        points: 10,
    },
    {
        id: "impersonation1",
        scenario: "You notice an account pretending to be a well-known Reddit admin. The username is slightly misspelled. What do you do?",
        correctAnswer: "report",
        options: ["report", "ignore", "delete", "block"],
        points: 10,
    },
];
// Store game state in memory (for demo purposes - consider KVStore for production)
const gameState = {
    userStats: {},
    leaderboard: [],
};
// Helper function to update leaderboard
const updateLeaderboard = () => {
    gameState.leaderboard = Object.values(gameState.userStats)
        .sort((a, b) => b.points - a.points)
        .slice(0, 10);
};
// Helper function to award badges
const checkBadges = (username) => {
    const user = gameState.userStats[username];
    if (!user)
        return;
    if (user.points >= 20 && !user.badges.includes("🏅 Cyber Master")) {
        user.badges.push("🏅 Cyber Master");
    }
    else if (user.points >= 10 && !user.badges.includes("🥈 Cyber Expert")) {
        user.badges.push("🥈 Cyber Expert");
    }
    else if (user.points >= 5 && !user.badges.includes("🥉 Cyber Novice")) {
        user.badges.push("🥉 Cyber Novice");
    }
};
// Create a new challenge post
Devvit.addMenuItem({
    label: "Start CyberQuest Challenge",
    location: "subreddit",
    forUserType: "moderator",
    onPress: async (event, context) => {
        const reddit = context.reddit;
        // Select a random challenge
        const randomChallenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
        gameState.activeChallenge = randomChallenge;
        // Create the post
        await reddit.submitPost({
            title: `🚨 CyberQuest Challenge: Can you solve this?`,
            subredditName: event.subreddit.name,
            preview: (<vstack padding="medium" gap="medium" cornerRadius="medium" backgroundColor="#1A1A1B">
            <text style="heading" size="xxlarge" color="#FF5700">
              🔒 CyberQuest Challenge
            </text>
            <text style="heading" size="large" color="#FFFFFF">
              {randomChallenge.scenario}
            </text>
          </vstack>),
        });
        return context.ui.showToast(`Challenge posted!`);
    },
});
// Handle user responses to challenges
Devvit.addTrigger({
    event: "CommentSubmit",
    onEvent: async (event, context) => {
        if (!gameState.activeChallenge)
            return;
        const reddit = context.reddit;
        const comment = await reddit.getCommentById(event.comment.id);
        // Only process comments on the active challenge post
        if (comment.postId !== context.postId)
            return;
        const username = comment.authorName;
        // Initialize user stats if not exists
        if (!gameState.userStats[username]) {
            gameState.userStats[username] = {
                username,
                points: 0,
                badges: [],
            };
        }
        const userAnswer = comment.body?.toLowerCase().trim();
        const isCorrect = userAnswer === gameState.activeChallenge.correctAnswer;
        // Update user stats
        if (isCorrect) {
            gameState.userStats[username].points += gameState.activeChallenge.points;
            gameState.userStats[username].lastChallengeCompleted =
                gameState.activeChallenge.id;
            checkBadges(username);
            updateLeaderboard();
            // Add a reply with feedback
            await reddit.submitComment({
                id: comment.id,
                text: `✅ Correct! You earned ${gameState.activeChallenge.points} points. Your total: ${gameState.userStats[username].points} points.`,
            });
        }
        else {
            await reddit.submitComment({
                id: comment.id,
                text: `❌ Incorrect. The correct answer was "${gameState.activeChallenge.correctAnswer}". Try the next challenge!`,
            });
        }
    },
});
// Custom post component for challenges
Devvit.addCustomPostType({
    name: "CyberQuest Challenge",
    render: (context) => {
        if (!gameState.activeChallenge) {
            return (<vstack padding="medium" gap="medium">
            <text style="heading" size="large">
              No active challenge
            </text>
            <text>Wait for a moderator to post a new challenge!</text>
          </vstack>);
        }
        return (<vstack padding="medium" gap="medium" cornerRadius="medium" backgroundColor="#1A1A1B">
          <text style="heading" size="xxlarge" color="#FF5700">
            🔒 CyberQuest Challenge
          </text>
          <text style="heading" size="large" color="#FFFFFF">
            {gameState.activeChallenge.scenario}
          </text>
  
          <vstack gap="small" padding="medium" backgroundColor="#343536" cornerRadius="medium">
            <text style="heading" size="medium" color="#FFFFFF">
              How would you respond?
            </text>
            <hstack gap="small" wrap="wrap">
              {gameState.activeChallenge.options.map((option) => (<button size="small" appearance="primary" disabled>
                  {option}
                </button>))}
            </hstack>
          </vstack>
  
          <text size="small" color="#818384">
            Reply to this post with one of the options above to participate!
          </text>
  
          <vstack gap="small" padding="medium" backgroundColor="#343536" cornerRadius="medium">
            <text style="heading" size="medium" color="#FFFFFF">
              Scoring
            </text>
            <text color="#FFFFFF">✅ Correct answer: Earn points</text>
            <text color="#FFFFFF">
              ❌ Incorrect answer: Learn the right approach
            </text>
          </vstack>
        </vstack>);
    },
});
// Leaderboard menu item
Devvit.addMenuItem({
    label: "View Leaderboard",
    location: "subreddit",
    onPress: async (_, context) => {
        context.ui.showToast("Opening leaderboard...");
        return context.ui.showModal({
            title: "CyberQuest Leaderboard",
            body: (<vstack padding="medium" gap="medium">
            <text style="heading" size="xxlarge" color="#FF5700">
              🏆 CyberQuest Leaderboard
            </text>
  
            {gameState.leaderboard.length === 0 ? (<text>
                No participants yet. Be the first to complete a challenge!
              </text>) : (<vstack gap="small">
                {gameState.leaderboard.map((user, index) => (<hstack alignment="start" gap="medium" padding="medium" backgroundColor={user.username === context.userName ? "#FF570033" : "#343536"} cornerRadius="medium">
                    <text weight="bold" color="#FFFFFF">
                      {index + 1}.
                    </text>
                    <vstack gap="small" grow>
                      <text weight="bold" color="#FFFFFF">
                        {user.username}
                      </text>
                      <hstack gap="small">
                        {user.badges.map((badge) => (<text>{badge}</text>))}
                      </hstack>
                    </vstack>
                    <text weight="bold" color="#FF5700">
                      {user.points} pts
                    </text>
                  </hstack>))}
              </vstack>)}
          </vstack>),
            size: "large",
        });
    },
});
export default Devvit;
