// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Start an Adventure Quest',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Creating a new Adventure Quest...");

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

// Add a custom "Adventure Quest" post type
Devvit.addCustomPostType({
  name: 'Adventure Quest',
  height: 'regular',
  render: (_context) => {
    const [votes, setVotes] = useState({ choiceA: 0, choiceB: 0 });

    return (
      <vstack height="100%" width="100%" gap="medium" alignment="center middle">
        <text size="large">🧙‍♂️ A mysterious traveler approaches...</text>
        <text size="medium">What should you do?</text>

        <button
          appearance="primary"
          onPress={() => setVotes((prev) => ({ ...prev, choiceA: prev.choiceA + 1 }))}
        >
          🏹 Attack the traveler! ({votes.choiceA} votes)
        </button>

        <button
          appearance="secondary"
          onPress={() => setVotes((prev) => ({ ...prev, choiceB: prev.choiceB + 1 }))}
        >
          🤝 Greet the traveler! ({votes.choiceB} votes)
        </button>
      </vstack>
    );
  },
});

export default Devvit;
