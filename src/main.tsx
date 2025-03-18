// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

// ✅ Add a menu item for moderators to create an Adventure Quest post
Devvit.addMenuItem({
  label: 'Start an Adventure Quest',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Creating an Adventure Quest...");

    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: '🌟 New Adventure Quest Begins! 🌟',
      subredditName: subreddit.name,
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading your adventure...</text>
        </vstack>
      ),
    });

    ui.navigateTo(post);
  },
});

// ✅ Custom post type: "Adventure Quest" with dynamic voting
Devvit.addCustomPostType({
  name: 'Adventure Quest',
  height: 'regular',
  render: async (context) => {
    const { reddit } = context;
    const [votes, setVotes] = useState({ choiceA: 0, choiceB: 0 });

    useEffect(() => {
      const fetchComments = async () => {
        const post = await reddit.getCurrentPost();
        const comments = await reddit.getComments({ postId: post.id });

        let attackVotes = 0;
        let greetVotes = 0;

        comments.forEach(async (comment) => {
          const text = comment.body.toLowerCase();

          if (text === "attack") {
            attackVotes++;
            await reddit.vote({ id: comment.id, direction: 1 }); // Upvote correct comment
          } else if (text === "greet") {
            greetVotes++;
            await reddit.vote({ id: comment.id, direction: 1 }); // Upvote correct comment
          } else {
            await reddit.vote({ id: comment.id, direction: -1 }); // Downvote invalid comment
          }
        });

        setVotes({ choiceA: attackVotes, choiceB: greetVotes });
      };

      fetchComments();
    }, []);

    return (
      <vstack height="100%" width="100%" gap="medium" alignment="center middle">
        <text size="large">🧙‍♂️ A mysterious traveler approaches...</text>
        <text size="medium">What should you do?</text>

        <text size="medium">🏹 Attack the traveler! ({votes.choiceA} votes)</text>
        <text size="medium">🤝 Greet the traveler! ({votes.choiceB} votes)</text>

        <text size="small">⚠️ To vote, comment "Attack" or "Greet". Invalid comments will be downvoted.</text>
      </vstack>
    );
  },
});

export default Devvit;