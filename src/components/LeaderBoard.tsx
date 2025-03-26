import { Devvit } from '@devvit/public-api';
import { useState, useEffect } from '@devvit/public-api';
import { getTopUsers } from '../utils/storage';
import { UserScore } from '../types';

export function Leaderboard() {
  const [users, setUsers] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadLeaderboard();
  }, []);
  
  async function loadLeaderboard() {
    try {
      setLoading(true);
      const topUsers = await getTopUsers(10);
      setUsers(topUsers);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    } finally {
      setLoading(false);
    }
  }
  
  if (loading) {
    return (
      <vstack padding="medium" gap="medium" alignment="center">
        <text weight="bold">Loading Leaderboard...</text>
        <icon name="sync" color="accent" size="large" animation="spin" />
      </vstack>
    );
  }
  
  if (users.length === 0) {
    return (
      <vstack padding="medium" gap="medium" alignment="center" width="100%">
        <text weight="bold">Leaderboard</text>
        <text size="small" color="textSecondary">No players yet. Be the first to play!</text>
      </vstack>
    );
  }
  
  return (
    <vstack padding="medium" gap="small" width="100%">
      <text weight="bold" size="xlarge" alignment="center">Top Cyber Defenders</text>
      
      {users.map((user, index) => (
        <hstack 
          key={user.userId}
          padding="medium"
          cornerRadius="medium"
          backgroundColor={index < 3 ? "neutralSoft" : "neutralWeak"}
          width="100%"
          animation="fadeIn"
          animationDelay={index * 100}
        >
          {/* Rank */}
          <vstack alignment="center" width="32px">
            {index === 0 && <text size="large">🥇</text>}
            {index === 1 && <text size="large">🥈</text>}
            {index === 2 && <text size="large">🥉</text>}
            {index > 2 && <text weight="bold">{index + 1}</text>}
          </vstack>
          
          {/* Username */}
          <vstack style={{ flex: 1 }}>
            <text weight="bold">{user.username || `User ${user.userId.substring(0, 6)}`}</text>
          </vstack>
          
          {/* Score */}
          <vstack>
            <text weight="bold" color={index < 3 ? "accent" : undefined}>
              {user.score} pts
            </text>
          </vstack>
        </hstack>
      ))}
      
      <button
        appearance="secondary"
        icon="sync"
        onPress={() => loadLeaderboard()}
      >
        Refresh Leaderboard
      </button>
    </vstack>
  );
}