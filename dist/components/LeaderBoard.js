import { jsx as _jsx, jsxs as _jsxs } from "@devvit/public-api/jsx-runtime";
import { useState, useEffect } from '@devvit/public-api';
import { getTopUsers } from '../utils/storage';
export function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadLeaderboard();
    }, []);
    async function loadLeaderboard() {
        try {
            setLoading(true);
            const topUsers = await getTopUsers(10);
            setUsers(topUsers);
        }
        catch (error) {
            console.error("Error loading leaderboard:", error);
        }
        finally {
            setLoading(false);
        }
    }
    if (loading) {
        return (_jsxs("vstack", { padding: "medium", gap: "medium", alignment: "center", children: [_jsx("text", { weight: "bold", children: "Loading Leaderboard..." }), _jsx("icon", { name: "sync", color: "accent", size: "large", animation: "spin" })] }));
    }
    if (users.length === 0) {
        return (_jsxs("vstack", { padding: "medium", gap: "medium", alignment: "center", width: "100%", children: [_jsx("text", { weight: "bold", children: "Leaderboard" }), _jsx("text", { size: "small", color: "textSecondary", children: "No players yet. Be the first to play!" })] }));
    }
    return (_jsxs("vstack", { padding: "medium", gap: "small", width: "100%", children: [_jsx("text", { weight: "bold", size: "xlarge", alignment: "center", children: "Top Cyber Defenders" }), users.map((user, index) => (_jsxs("hstack", { padding: "medium", cornerRadius: "medium", backgroundColor: index < 3 ? "neutralSoft" : "neutralWeak", width: "100%", animation: "fadeIn", animationDelay: index * 100, children: [_jsxs("vstack", { alignment: "center", width: "32px", children: [index === 0 && _jsx("text", { size: "large", children: "\uD83E\uDD47" }), index === 1 && _jsx("text", { size: "large", children: "\uD83E\uDD48" }), index === 2 && _jsx("text", { size: "large", children: "\uD83E\uDD49" }), index > 2 && _jsx("text", { weight: "bold", children: index + 1 })] }), _jsx("vstack", { style: { flex: 1 }, children: _jsx("text", { weight: "bold", children: user.username || `User ${user.userId.substring(0, 6)}` }) }), _jsx("vstack", { children: _jsxs("text", { weight: "bold", color: index < 3 ? "accent" : undefined, children: [user.score, " pts"] }) })] }, user.userId))), _jsx("button", { appearance: "secondary", icon: "sync", onPress: () => loadLeaderboard(), children: "Refresh Leaderboard" })] }));
}
