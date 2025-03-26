import { Devvit } from '@devvit/public-api';

interface BadgeSystemProps {
  score: number;
  showName?: boolean;
  animation?: boolean;
}

export function BadgeSystem({ score, showName = true, animation = false }: BadgeSystemProps) {
  let badge = null;
  
  if (score >= 20) {
    badge = { name: 'Cyber Master', icon: '🏅' };
  } else if (score >= 10) {
    badge = { name: 'Cyber Expert', icon: '🥈' };
  } else if (score >= 5) {
    badge = { name: 'Cyber Novice', icon: '🥉' };
  }
  
  if (!badge) {
    return (
      <text size="small" color="textSecondary">No badge yet</text>
    );
  }
  
  return (
    <hstack 
      gap="small" 
      padding="small" 
      cornerRadius="medium"
      backgroundColor="neutralWeak"
      animation={animation ? "bounce" : undefined}
    >
      <text size="large">{badge.icon}</text>
      {showName && <text weight="medium">{badge.name}</text>}
    </hstack>
  );
}