import { Devvit } from '@devvit/public-api';
import { ChallengePost } from './components/ChallengePost';
import { Leaderboard } from './components/LeaderBoard';
import { BadgeSystem } from './components/BadgeSystem';
import { getChallenges, createChallenge, getRandomChallenge } from './utils/challenge';
import { getUserScore, updateUserScore, getTopUsers } from './utils/storage';

Devvit.configure({
  redditAPI: true,
});

// Custom post type for cybersecurity challenges
Devvit.addCustomPostType({
  name: 'CyberQuest Challenge',
  render: ChallengePost,
});

// Add a menu item for moderators to create a new challenge
Devvit.addMenuItem({
  label: 'Start CyberQuest Challenge',
  location: 'subreddit',
  onPress: async (context, { reddit, ui }) => {
    const challenge = getRandomChallenge();
    
    try {
      const post = await reddit.submitPost({
        title: `CyberQuest Challenge: ${challenge.title}`,
        subredditName: context.subredditName || 'RedditQuestTest',
        preview: async (slots) => {
          slots.render({
            component: ChallengePost,
            data: {
              challenge,
              isPreview: true,
            },
          });
        },
      });
      
      if (post) {
        // Store the challenge for this post
        await createChallenge(post.id, challenge);
        
        ui.showToast({
          text: 'Challenge created successfully!',
          appearance: 'success',
        });
      }
    } catch (error) {
      ui.showToast({
        text: `Error creating challenge: ${error}`,
        appearance: 'error',
      });
    }
  },
  requiresModPermissions: true,
});

// Add a menu item to view the leaderboard
Devvit.addMenuItem({
  label: 'View RedditQuest Leaderboard',
  location: 'subreddit',
  onPress: async (context, { ui }) => {
    ui.showModal({
      title: 'RedditQuest Leaderboard',
      component: Leaderboard,
    });
  },
});

// Comment listener to process user answers
Devvit.addCommentEventHandler({
  onPosted: async (event, context) => {
    const { reddit, ui } = context;
    const comment = event.comment;
    const postId = comment.postId;
    
    // Check if this is a challenge post
    const challenge = await getChallenges(postId);
    if (!challenge) return;
    
    // Process the answer
    const answerText = comment.body.toLowerCase().trim();
    const validAnswers = ['report', 'ignore', 'delete', 'block'];
    
    if (validAnswers.includes(answerText)) {
      const isCorrect = answerText === challenge.correctAnswer.toLowerCase();
      const userId = comment.authorId;
      const points = isCorrect ? 1 : 0;
      
      // Update user score
      const currentScore = await getUserScore(userId) || 0;
      const newScore = currentScore + points;
      await updateUserScore(userId, newScore);
      
      // Reply to the comment with feedback
      const feedbackMessage = isCorrect 
        ? `✅ Correct! That was the best action to take in this scenario. You now have ${newScore} points.` 
        : `❌ That's not the best action for this scenario. The correct answer was: ${challenge.correctAnswer}. Try again!`;
      
      await reddit.createComment({
        parentId: comment.id,
        text: feedbackMessage,
      });
      
      // Check if user unlocked a new badge
      if (isCorrect) {
        let badge = null;
        
        if (newScore >= 20) {
          badge = { name: 'Cyber Master', icon: '🏅' };
        } else if (newScore >= 10) {
          badge = { name: 'Cyber Expert', icon: '🥈' };
        } else if (newScore >= 5) {
          badge = { name: 'Cyber Novice', icon: '🥉' };
        }
        
        if (badge) {
          await reddit.createComment({
            parentId: comment.id,
            text: `🎉 Congratulations! You've earned the ${badge.icon} ${badge.name} badge!`,
          });
        }
      }
    }
  },
});

// Set up custom post preview
Devvit.addCustomPostPreview({
  render: (data) => {
    return {
      component: ChallengePost,
      data: {
        ...data,
        isPreview: true
      },
    };
  },
});

export default Devvit;
