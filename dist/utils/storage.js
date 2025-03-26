import { Devvit } from '@devvit/public-api';
// In-memory storage for development
const memoryStorage = {
    userScores: {},
};
/**
 * Get a user's score
 */
export async function getUserScore(userId) {
    try {
        const KVStore = Devvit.use('KVStore');
        const score = await KVStore.get(`user:${userId}:score`);
        if (score !== null) {
            return Number(score);
        }
        // Fallback to memory storage
        return memoryStorage.userScores[userId] || 0;
    }
    catch (error) {
        console.error("Error getting user score:", error);
        // Fallback to memory storage
        return memoryStorage.userScores[userId] || 0;
    }
}
/**
 * Update a user's score
 */
export async function updateUserScore(userId, score) {
    try {
        const KVStore = Devvit.use('KVStore');
        await KVStore.put(`user:${userId}:score`, score.toString());
        // Update memory storage as well
        memoryStorage.userScores[userId] = score;
        // Also update the list of users in the leaderboard
        const userIds = new Set(await getLeaderboardUserIds());
        userIds.add(userId);
        await KVStore.put('leaderboard:userIds', JSON.stringify(Array.from(userIds)));
    }
    catch (error) {
        console.error("Error updating user score:", error);
        // Update memory storage as fallback
        memoryStorage.userScores[userId] = score;
    }
}
/**
 * Get the list of user IDs in the leaderboard
 */
async function getLeaderboardUserIds() {
    try {
        const KVStore = Devvit.use('KVStore');
        const userIdsStr = await KVStore.get('leaderboard:userIds');
        if (userIdsStr) {
            return JSON.parse(userIdsStr);
        }
        return Object.keys(memoryStorage.userScores);
    }
    catch (error) {
        console.error("Error getting leaderboard user IDs:", error);
        return Object.keys(memoryStorage.userScores);
    }
}
/**
 * Get the top N users by score
 */
export async function getTopUsers(limit = 10) {
    try {
        const userIds = await getLeaderboardUserIds();
        const users = [];
        for (const userId of userIds) {
            const score = await getUserScore(userId);
            if (score !== null) {
                users.push({ userId, score });
            }
        }
        // Sort by score in descending order
        users.sort((a, b) => b.score - a.score);
        // Return only the top N users
        return users.slice(0, limit);
    }
    catch (error) {
        console.error("Error getting top users:", error);
        // Fallback to memory storage
        const users = Object.entries(memoryStorage.userScores).map(([userId, score]) => ({
            userId,
            score,
        }));
        users.sort((a, b) => b.score - a.score);
        return users.slice(0, limit);
    }
}
