import { jsx as _jsx, jsxs as _jsxs } from "@devvit/public-api/jsx-runtime";
export function ProgressBar({ score, maxScore = 20 }) {
    // Calculate progress percentage
    const progressPercent = Math.min(100, (score / maxScore) * 100);
    // Determine next badge threshold
    let nextBadgeThreshold = 5; // Cyber Novice
    if (score >= 5 && score < 10)
        nextBadgeThreshold = 10; // Cyber Expert
    if (score >= 10 && score < 20)
        nextBadgeThreshold = 20; // Cyber Master
    // Calculate remaining points for next badge
    const remainingPoints = score >= 20 ? 0 : nextBadgeThreshold - score;
    return (_jsxs("vstack", { gap: "small", children: [_jsx("hstack", { cornerRadius: "full", height: "12px", backgroundColor: "neutralWeak", overflow: "hidden", children: _jsx("spacer", { width: `${progressPercent}%`, height: "100%", backgroundColor: getColorForScore(score), animation: "grow-x", animationDuration: 1000 }) }), _jsxs("hstack", { children: [_jsx("spacer", { style: { flex: 1 } }), _jsxs("vstack", { alignment: "center", style: { position: 'absolute', left: '25%', transform: 'translateX(-50%)' }, children: [_jsx("text", { size: "small", children: "5" }), _jsx("icon", { name: "circle", size: "small", color: score >= 5 ? "success" : "neutral" })] }), _jsxs("vstack", { alignment: "center", style: { position: 'absolute', left: '50%', transform: 'translateX(-50%)' }, children: [_jsx("text", { size: "small", children: "10" }), _jsx("icon", { name: "circle", size: "small", color: score >= 10 ? "success" : "neutral" })] }), _jsxs("vstack", { alignment: "center", style: { position: 'absolute', left: '100%', transform: 'translateX(-50%)' }, children: [_jsx("text", { size: "small", children: "20" }), _jsx("icon", { name: "circle", size: "small", color: score >= 20 ? "success" : "neutral" })] })] }), remainingPoints > 0 && (_jsxs("text", { size: "small", alignment: "center", children: [remainingPoints, " point", remainingPoints !== 1 ? 's' : '', " until your next badge!"] })), score >= 20 && (_jsx("text", { size: "small", alignment: "center", color: "success", children: "Congratulations! You've reached the highest badge level!" }))] }));
}
function getColorForScore(score) {
    if (score >= 20)
        return "success";
    if (score >= 10)
        return "accent";
    if (score >= 5)
        return "info";
    return "primary";
}
