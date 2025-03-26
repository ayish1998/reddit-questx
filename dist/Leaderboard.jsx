"use strict";
// Leaderboard.tsx
// import { Devvit } from '@devvit/public-api';
// Devvit.addCustomPostType({
//   name: 'Leaderboard',
//   render: (context) => {
//     const { data, currentUser } = context.props;
//     return (
//       <blocks>
//         <vstack padding="medium" gap="medium">
//           <text style="heading" size="xxlarge" color="#FF5700">🏆 CyberQuest Leaderboard</text>
//           {data.length === 0 ? (
//             <text>No participants yet. Be the first to complete a challenge!</text>
//           ) : (
//             <vstack gap="small">
//               {data.map((user, index) => (
//                 <hstack 
//                   alignment="start" 
//                   gap="medium" 
//                   padding="medium" 
//                   backgroundColor={user.username === currentUser ? '#FF570033' : '#343536'}
//                   cornerRadius="medium"
//                 >
//                   <text weight="bold" color="#FFFFFF">{index + 1}.</text>
//                   <vstack gap="small" grow>
//                     <text weight="bold" color="#FFFFFF">{user.username}</text>
//                     <hstack gap="small">
//                       {user.badges.map((badge) => (
//                         <text>{badge}</text>
//                       ))}
//                     </hstack>
//                   </vstack>
//                   <text weight="bold" color="#FF5700">{user.points} pts</text>
//                 </hstack>
//               ))}
//             </vstack>
//           )}
//         </vstack>
//       </blocks>
//     );
//   },
// });
// export default Leaderboard;
