import { Devvit } from '@devvit/public-api';

interface ProgressBarProps {
  score: number;
  maxScore?: number;
}

export function ProgressBar({ score, maxScore = 20 }: ProgressBarProps) {
  // Calculate progress percentage
  const progressPercent = Math.min(100, (score / maxScore) * 100);
  
  // Determine next badge threshold
  let nextBadgeThreshold = 5; // Cyber Novice
  if (score >= 5 && score < 10) nextBadgeThreshold = 10; // Cyber Expert
  if (score >= 10 && score < 20) nextBadgeThreshold = 20; // Cyber Master
  
  // Calculate remaining points for next badge
  const remainingPoints = score >= 20 ? 0 : nextBadgeThreshold - score;
  
  return (
    <vstack gap="small">
      {/* Progress bar */}
      <hstack cornerRadius="full" height="12px" backgroundColor="neutralWeak" overflow="hidden">
        <spacer 
          width={`${progressPercent}%`} 
          height="100%" 
          backgroundColor={getColorForScore(score)}
          animation="grow-x"
          animationDuration={1000}
        />
      </hstack>
      
      {/* Progress milestones */}
      <hstack>
        <spacer style={{ flex: 1 }} />
        <vstack alignment="center" style={{ position: 'absolute', left: '25%', transform: 'translateX(-50%)' }}>
          <text size="small">5</text>
          <icon name="circle" size="small" color={score >= 5 ? "success" : "neutral"} />
        </vstack>
        <vstack alignment="center" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <text size="small">10</text>
          <icon name="circle" size="small" color={score >= 10 ? "success" : "neutral"} />
        </vstack>
        <vstack alignment="center" style={{ position: 'absolute', left: '100%', transform: 'translateX(-50%)' }}>
          <text size="small">20</text>
          <icon name="circle" size="small" color={score >= 20 ? "success" : "neutral"} />
        </vstack>
      </hstack>
      
      {remainingPoints > 0 && (
        <text size="small" alignment="center">
          {remainingPoints} point{remainingPoints !== 1 ? 's' : ''} until your next badge!
        </text>
      )}
      
      {score >= 20 && (
        <text size="small" alignment="center" color="success">
          Congratulations! You've reached the highest badge level!
        </text>
      )}
    </vstack>
  );
}

function getColorForScore(score: number): string {
  if (score >= 20) return "success";
  if (score >= 10) return "accent";
  if (score >= 5) return "info";
  return "primary";
}