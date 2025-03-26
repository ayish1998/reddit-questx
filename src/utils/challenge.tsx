import { Devvit } from '@devvit/public-api';
import { Challenge } from '../types';

// Preset challenge scenarios
const CHALLENGE_SCENARIOS: Challenge[] = [
  {
    id: 'phishing-email',
    title: 'Suspicious Email Alert',
    scenario: 'You receive an email claiming to be from your bank stating there is a problem with your account. It asks you to click a link and enter your login credentials to verify your identity. The email address looks slightly different from your bank\'s official email.',
    correctAnswer: 'report',
    explanation: 'This is a classic phishing attempt. Never click on suspicious links or provide your credentials through email links. Report such emails to prevent others from falling victim.',
    icon: 'mail',
  },
  {
    id: 'public-wifi',
    title: 'Public WiFi Connection',
    scenario: 'You\'re at a coffee shop and need to check your bank account balance. The shop has an open WiFi network called "FreeCoffeeShopWiFi" with no password required.',
    correctAnswer: 'ignore',
    explanation: 'Unsecured public WiFi networks are prime targets for hackers. Avoid accessing sensitive information like bank accounts on such networks, or use a VPN if absolutely necessary.',
    icon: 'wifi',
  },
  {
    id: 'social-media-friend',
    title: 'Unusual Friend Request',
    scenario: 'You receive a friend request on social media from someone claiming to be a distant relative. Their profile was created last week and has very little information or activity.',
    correctAnswer: 'ignore',
    explanation: 'This could be an attempt at social engineering. It\'s best to verify the identity through other means before accepting friend requests from people you don\'t know well.',
    icon: 'user-plus',
  },
  {
    id: 'suspicious-attachment',
    title: 'Unknown Email Attachment',
    scenario: 'You receive an email with an attachment named "INVOICE.exe" from an unknown sender. The email says "Please check attached invoice" with no other details.',
    correctAnswer: 'delete',
    explanation: 'Executable files (.exe) in email attachments from unknown sources are almost always malicious. Delete such emails immediately without opening the attachment.',
    icon: 'file-text',
  },
  {
    id: 'password-sharing',
    title: 'Password Sharing Request',
    scenario: 'A colleague at work asks for your system login password because they need to access a file urgently and their account is having issues.',
    correctAnswer: 'ignore',
    explanation: 'Never share your passwords with anyone, even colleagues. Direct them to IT support for their account issues instead.',
    icon: 'key',
  },
  {
    id: 'public-computer',
    title: 'Public Computer Login',
    scenario: 'You need to check your email urgently and use a computer at a public library. After checking your email, what should you do?',
    correctAnswer: 'delete',
    explanation: 'Always delete browsing history and log out of all accounts when using public computers. This prevents the next user from accessing your information.',
    icon: 'desktop',
  },
  {
    id: 'strange-call',
    title: 'Unexpected Tech Support Call',
    scenario: 'You receive a call from someone claiming to be from Microsoft. They say they\'ve detected a virus on your computer and need remote access to fix it.',
    correctAnswer: 'block',
    explanation: 'This is a common tech support scam. Microsoft and other tech companies don\'t proactively call users about viruses. Hang up and block the number.',
    icon: 'phone',
  },
  {
    id: 'two-factor',
    title: 'Authentication Code Request',
    scenario: 'You receive a text with a verification code for your email account, but you didn\'t request it. Shortly after, you get a call from someone claiming to be from Google asking for the code to verify your identity.',
    correctAnswer: 'block',
    explanation: 'This is an attempt to bypass two-factor authentication. Never share verification codes with anyone, even if they claim to be from the service provider.',
    icon: 'shield',
  },
  {
    id: 'usb-found',
    title: 'Found USB Drive',
    scenario: 'You find a USB drive in the parking lot of your workplace with your company\'s logo on it.',
    correctAnswer: 'report',
    explanation: 'Unknown USB drives could contain malware. Turn it in to your IT department rather than plugging it into your computer, as this could be a deliberate attempt to introduce malware into the company network.',
    icon: 'hard-drive',
  },
  {
    id: 'social-oversharing',
    title: 'Social Media Quiz',
    scenario: 'A fun quiz on social media asks for your first pet\'s name, the street you grew up on, and your mother\'s maiden name to generate your "celebrity name".',
    correctAnswer: 'ignore',
    explanation: 'These questions are common security questions for account recovery. Sharing this information publicly could help hackers gain access to your accounts.',
    icon: 'list',
  }
];

/**
 * Get a challenge for a specific post
 */
export async function getChallenges(postId: string): Promise<Challenge | null> {
  try {
    const KVStore = Devvit.use('KVStore');
    const challengeData = await KVStore.get(`post:${postId}:challenge`);
    
    if (challengeData) {
      return JSON.parse(challengeData);
    }
    
    return null;
  } catch (error) {
    console.error("Error getting challenge:", error);
    return null;
  }
}

/**
 * Create a new challenge for a post
 */
export async function createChallenge(postId: string, challenge: Challenge): Promise<void> {
  try {
    const KVStore = Devvit.use('KVStore');
    await KVStore.put(`post:${postId}:challenge`, JSON.stringify(challenge));
  } catch (error) {
    console.error("Error creating challenge:", error);
  }
}

/**
 * Get a random challenge from the pre-defined scenarios
 */
export function getRandomChallenge(): Challenge {
  const randomIndex = Math.floor(Math.random() * CHALLENGE_SCENARIOS.length);
  return CHALLENGE_SCENARIOS[randomIndex];
}