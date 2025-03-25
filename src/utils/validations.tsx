// src/utils/validation.ts
  export const validateAnswer = (
    answer: string,
    scenarioId: string
  ): boolean => {
    const scenario = challengeScenarios.find(s => s.id === scenarioId);
    return scenario?.correctAnswers.some(
      correct => correct.toLowerCase() === answer.toLowerCase()
    ) ?? false;
  };