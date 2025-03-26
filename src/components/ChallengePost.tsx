import { useEffect, useState } from 'react';
import { Devvit } from '@devvit/public-api';
import { ProgressBar } from './PorgressBar';
import { getUserScore } from '../utils/storage';
import { getChallenges } from '../utils/challenge';
import { Challenge } from '../types';

export function ChallengePost({ postId, isPreview, challenge: initialChallenge }) {
  const [challenge, setChallenge] = useState<Challenge | null>(initialChallenge || null);
  const [userScore, setUserScore] = useState(0);
  const [loading, setLoading] = useState(!initialChallenge);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
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

  const handleAnswerSelection = async (answer: string) => {
    if (!challenge || isPreview) return;
    
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
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

  if (loading) {
    return (
      <blocks>
        <vstack padding="medium" alignment="center" gap="medium">
          <text size="xxlarge" weight="bold">Loading challenge...</text>
          <spinner />
        </vstack>
      </blocks>
    );
  }

  if (!challenge) {
    return (
      <blocks>
        <vstack padding="medium" alignment="center">
          <text size="xxlarge" weight="bold">Challenge not found</text>
          <text>This doesn't appear to be a valid CyberQuest challenge post.</text>
        </vstack>
      </blocks>
    );
  }

  return (
    <blocks>
      <vstack padding="medium" gap="large">
        {/* Header */}
        <hstack gap="small" alignment="center">
          <icon name="shield-check" color="green" />
          <text size="xxlarge" weight="bold">RedditQuest: CyberQuest Challenge</text>
        </hstack>
        
        {/* User Progress */}
        {currentUser && !isPreview && (
          <vstack gap="small" padding="small" cornerRadius="medium" backgroundColor="neutral">
            <text weight="bold">Your Progress</text>
            <ProgressBar score={userScore} />
            <text>Score: {userScore} points</text>
          </vstack>
        )}
        
        {/* Challenge Scenario */}
        <vstack 
          gap="medium" 
          padding="large" 
          cornerRadius="medium" 
          backgroundColor="accent"
          border="thin"
        >
          <text size="xlarge" weight="bold">{challenge.title}</text>
          <text>{challenge.scenario}</text>
          
          {/* Challenge Image - using an icon as a placeholder since we can't use images */}
          <vstack padding="large" backgroundColor="neutral" cornerRadius="medium" alignment="center">
            <icon name={challenge.icon || "globe"} size="xxlarge" color="accent" />
            <text size="small" alignment="center">Scenario Illustration</text>
          </vstack>
          
          <text weight="medium">What should you do in this situation?</text>
          
          {/* Answer Options */}
          <vstack gap="small">
            {['Report', 'Ignore', 'Delete', 'Block'].map((action) => (
              <hstack key={action} gap="small">
                <button
                  appearance={selectedAnswer === action ? 'primary' : 'secondary'}
                  onPress={() => handleAnswerSelection(action)}
                  disabled={isPreview || showFeedback}
                  icon={getActionIcon(action)}
                  size="large"
                  fullWidth
                >
                  {action}
                </button>
              </hstack>
            ))}
          </vstack>
          
          {/* Feedback */}
          {showFeedback && !isPreview && (
            <vstack 
              padding="medium" 
              backgroundColor={isCorrect ? "success" : "danger"} 
              cornerRadius="medium"
              animation="fade" 
              animationDuration={500}
            >
              <text weight="bold" color="white">
                {isCorrect ? "✅ Correct!" : "❌ Incorrect!"}
              </text>
              <text color="white">
                {isCorrect 
                  ? "That was the best action to take in this scenario."
                  : `The best action would be to ${challenge.correctAnswer}.`}
              </text>
              <text color="white" size="small">
                {challenge.explanation}
              </text>
            </vstack>
          )}
        </vstack>
        
        {/* Instructions for Comment-based Gameplay */}
        {!isPreview && (
          <vstack gap="small" padding="medium" cornerRadius="medium" backgroundColor="neutral">
            <text weight="bold">How to Play:</text>
            <text>1. Read the cybersecurity scenario above</text>
            <text>2. Choose the appropriate action: report, ignore, delete, or block</text>
            <text>3. Earn points for correct answers and unlock badges!</text>
          </vstack>
        )}
      </vstack>
    </blocks>
  );
}

function getActionIcon(action: string): string {
  switch (action.toLowerCase()) {
    case 'report': return 'flag';
    case 'ignore': return 'x';
    case 'delete': return 'trash';
    case 'block': return 'shield-x';
    default: return 'help-circle';
  }
}
