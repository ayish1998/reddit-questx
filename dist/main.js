import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Description: This is the main file for the CyberQuest Challenge extension.
// It adds a menu item for moderators to create a CyberQuest post and a custom post type for the challenge.
import { Devvit } from "@devvit/public-api";
import { useState, useEffect } from "react";
// ✅ Configure Devvit with Reddit API
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
            "⚠ Scenario: You receive an email saying you've won $1,000! What do you do?",
            "⚠ Scenario: A pop-up appears saying your computer is infected. What do you do?",
            "⚠ Scenario: You get a text message asking for your password. What do you do?",
            "⚠ Scenario: A stranger on social media asks for your personal information. What do you do?",
        ];
        console.log("Scenarios:", scenarios); // Debugging line
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        console.log("Selected Scenario:", randomScenario); // Debugging line
        try {
            const subreddit = await reddit.getCurrentSubreddit();
            const post = await reddit.submitPost({
                title: '🛡 CyberQuest: Online Safety Challenge! 🛡',
                subredditName: subreddit.name,
                text: randomScenario, // Use `text` instead of `preview`
            });
            ui.navigateTo(post);
        }
        catch (error) {
            ui.showToast("Error creating CyberQuest Challenge.");
            console.error("Error creating post:", error);
        }
    },
});
// ✅ CyberQuest Challenge Post Type
Devvit.addCustomPostType({
    name: 'CyberQuest',
    height: 'regular',
    render: (context) => {
        const { reddit } = context;
        const [score, setScore] = useState(0);
        const [feedback, setFeedback] = useState("");
        const [leaderboard, setLeaderboard] = useState({});
        const correctAnswers = {
            "report": true,
            "ignore": true,
            "delete": true,
            "block": true,
            "change": true,
        };
        useEffect(() => {
            async function fetchComments() {
                if (!context.postId)
                    return;
                try {
                    const comments = await reddit.getComments({ postId: context.postId });
                    let newScore = 0;
                    const newLeaderboard = {};
                    for (const comment of comments) {
                        const text = comment.body.toLowerCase().trim();
                        const username = comment.author?.name || "Unknown";
                        if (text in correctAnswers && correctAnswers[text]) {
                            newScore++;
                            newLeaderboard[username] = (newLeaderboard[username] || 0) + 1;
                            setFeedback(`✅ Correct! ${username} earned a point.`);
                        }
                        else {
                            setFeedback(`❌ Incorrect! ${username}, try again.`);
                        }
                    }
                    setScore(newScore);
                    setLeaderboard(newLeaderboard);
                }
                catch (error) {
                    console.error("Error fetching comments:", error);
                    setFeedback("Failed to fetch comments. Please try again later.");
                }
            }
            fetchComments();
            const interval = setInterval(fetchComments, 5000); // Refresh comments every 5 seconds
            return () => clearInterval(interval); // Cleanup interval on unmount
        }, [context.postId]);
        const sortedLeaderboard = Object.entries(leaderboard)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        const progressBarWidth = (score / 10) * 100;
        return (_jsxs("vstack", { height: "100%", width: "100%", gap: "medium", alignment: "center middle", children: [_jsx("text", { size: "large", children: "\uD83D\uDEE1 CyberQuest Challenge! \uD83D\uDEE1" }), _jsx("text", { size: "medium", children: "How safe are you online?" }), _jsx("text", { size: "medium", children: "\u26A0 Scenario: You receive an email saying you've won $1,000! What do you do?" }), _jsx("text", { size: "small", children: "(Comment: 'Report', 'Ignore', 'Delete', 'Block', or other action)" }), _jsxs("text", { size: "medium", children: ["\u2705 Your Cyber Score: ", score] }), _jsx("text", { size: "small", children: feedback }), _jsx("hstack", { width: "100%", height: "10px", backgroundColor: "#ddd", cornerRadius: "full", children: _jsx("hstack", { width: `${progressBarWidth}%`, height: "100%", backgroundColor: "#4caf50", cornerRadius: "full" }) }), _jsx("text", { size: "small", children: "\uD83C\uDFAF Complete 10 challenges to earn a badge!" }), _jsx("text", { size: "medium", children: "\uD83C\uDFC6 Leaderboard" }), sortedLeaderboard.map(([username, points], index) => (_jsxs("text", { size: "small", children: [index + 1, ". ", username, ": ", points, " points"] }, username)))] }));
    },
});
export default Devvit;
