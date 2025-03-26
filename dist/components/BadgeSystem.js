import { jsx as _jsx, jsxs as _jsxs } from "@devvit/public-api/jsx-runtime";
export function BadgeSystem({ score, showName = true, animation = false }) {
    let badge = null;
    if (score >= 20) {
        badge = { name: 'Cyber Master', icon: '🏅' };
    }
    else if (score >= 10) {
        badge = { name: 'Cyber Expert', icon: '🥈' };
    }
    else if (score >= 5) {
        badge = { name: 'Cyber Novice', icon: '🥉' };
    }
    if (!badge) {
        return (_jsx("text", { size: "small", color: "textSecondary", children: "No badge yet" }));
    }
    return (_jsxs("hstack", { gap: "small", padding: "small", cornerRadius: "medium", backgroundColor: "neutralWeak", animation: animation ? "bounce" : undefined, children: [_jsx("text", { size: "large", children: badge.icon }), showName && _jsx("text", { weight: "medium", children: badge.name })] }));
}
