import { jsx as _jsx, jsxs as _jsxs } from "@devvit/public-api/jsx-runtime";
import { useEffect, useState } from 'react';
import { Devvit } from '@devvit/public-api';
import { ProgressBar } from './PorgressBar';
import { getUserScore } from '../utils/storage';
import { getChallenges } from '../utils/challenge';
export function ChallengePost({ postId, isPreview, challenge: initialChallenge }) {
    const [challenge, setChallenge] = useState(initialChallenge || null);
    const [userScore, setUserScore] = useState(0);
    const [loading, setLoading] = useState(!initialChallenge);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const context = Devvit.useContext();
    const { reddit, currentUser } = context;
    useEffect(() => {
        async function loadData() {
            if (!initialChallenge && postId) {
                // Load challenge data
                const challengeData = await getChallenges(postId);
                if (challengeData) {
                    setChallenge(challengeData);
                }
            }
            if (currentUser) {
                // Load user score
                const score = await getUserScore(currentUser.id);
                setUserScore(score || 0);
            }
            setLoading(false);
        }
        loadData();
    }, [postId, currentUser, initialChallenge]);
    const handleAnswerSelection = async (answer) => {
        if (!challenge || isPreview)
            return;
        setSelectedAnswer(answer);
        const correct = answer.toLowerCase() === challenge.correctAnswer.toLowerCase();
        setIsCorrect(correct);
        setShowFeedback(true);
        // Submit the answer as a comment
        if (currentUser && !isPreview) {
            try {
                await reddit.submitComment({
                    postId,
                    text: answer,
                });
            }
            catch (error) {
                console.error("Error submitting comment:", error);
            }
        }
    };
    if (loading) {
        return (_jsx("blocks", { children: _jsxs("vstack", { padding: "medium", alignment: "center", gap: "medium", children: [_jsx("text", { size: "xxlarge", weight: "bold", children: "Loading challenge..." }), _jsx("spinner", {})] }) }));
    }
    if (!challenge) {
        return (_jsx("blocks", { children: _jsxs("vstack", { padding: "medium", alignment: "center", children: [_jsx("text", { size: "xxlarge", weight: "bold", children: "Challenge not found" }), _jsx("text", { children: "This doesn't appear to be a valid CyberQuest challenge post." })] }) }));
    }
    return (_jsx("blocks", { children: _jsxs("vstack", { padding: "medium", gap: "large", children: [_jsxs("hstack", { gap: "small", alignment: "center", children: [_jsx("icon", { name: "shield-check", color: "green" }), _jsx("text", { size: "xxlarge", weight: "bold", children: "RedditQuest: CyberQuest Challenge" })] }), currentUser && !isPreview && (_jsxs("vstack", { gap: "small", padding: "small", cornerRadius: "medium", backgroundColor: "neutral", children: [_jsx("text", { weight: "bold", children: "Your Progress" }), _jsx(ProgressBar, { score: userScore }), _jsxs("text", { children: ["Score: ", userScore, " points"] })] })), _jsxs("vstack", { gap: "medium", padding: "large", cornerRadius: "medium", backgroundColor: "accent", border: "thin", children: [_jsx("text", { size: "xlarge", weight: "bold", children: challenge.title }), _jsx("text", { children: challenge.scenario }), _jsxs("vstack", { padding: "large", backgroundColor: "neutral", cornerRadius: "medium", alignment: "center", children: [_jsx("icon", { name: challenge.icon || "globe", size: "xxlarge", color: "accent" }), _jsx("text", { size: "small", alignment: "center", children: "Scenario Illustration" })] }), _jsx("text", { weight: "medium", children: "What should you do in this situation?" }), _jsx("vstack", { gap: "small", children: ['Report', 'Ignore', 'Delete', 'Block'].map((action) => (_jsx("hstack", { gap: "small", children: _jsx("button", { appearance: selectedAnswer === action ? 'primary' : 'secondary', onPress: () => handleAnswerSelection(action), disabled: isPreview || showFeedback, icon: getActionIcon(action), size: "large", fullWidth: true, children: action }) }, action))) }), showFeedback && !isPreview && (_jsxs("vstack", { padding: "medium", backgroundColor: isCorrect ? "success" : "danger", cornerRadius: "medium", animation: "fade", animationDuration: 500, children: [_jsx("text", { weight: "bold", color: "white", children: isCorrect ? "✅ Correct!" : "❌ Incorrect!" }), _jsx("text", { color: "white", children: isCorrect
                                        ? "That was the best action to take in this scenario."
                                        : `The best action would be to ${challenge.correctAnswer}.` }), _jsx("text", { color: "white", size: "small", children: challenge.explanation })] }))] }), !isPreview && (_jsxs("vstack", { gap: "small", padding: "medium", cornerRadius: "medium", backgroundColor: "neutral", children: [_jsx("text", { weight: "bold", children: "How to Play:" }), _jsx("text", { children: "1. Read the cybersecurity scenario above" }), _jsx("text", { children: "2. Choose the appropriate action: report, ignore, delete, or block" }), _jsx("text", { children: "3. Earn points for correct answers and unlock badges!" })] }))] }) }));
}
function getActionIcon(action) {
    switch (action.toLowerCase()) {
        case 'report': return 'flag';
        case 'ignore': return 'x';
        case 'delete': return 'trash';
        case 'block': return 'shield-x';
        default: return 'help-circle';
    }
}
