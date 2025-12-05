// Calcula o valor de mercado baseado no overall do jogador
export const calculateMarketValue = (overall: number): number => {
  // Fórmula: valor cresce exponencialmente com o overall
  // Base: jogador 70 overall = 500k, 85 overall = ~15M
  if (overall <= 70) return 500000;
  if (overall <= 75) return 1000000 + (overall - 70) * 200000;
  if (overall <= 80) return 2000000 + (overall - 75) * 600000;
  if (overall <= 85) return 5000000 + (overall - 80) * 2000000;
  if (overall <= 90) return 15000000 + (overall - 85) * 5000000;
  return 40000000 + (overall - 90) * 10000000;
};

// Formata o valor em milhões ou milhares
export const formatMarketValue = (value: number): string => {
  if (value >= 1000000) {
    const millions = value / 1000000;
    return `$ ${millions.toFixed(1)}M`;
  }
  const thousands = value / 1000;
  return `$ ${thousands.toFixed(0)}K`;
};
