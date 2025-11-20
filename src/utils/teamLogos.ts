import { teams } from "@/data/teams";

/**
 * Mapeia o nome ou ID de um time para seu logo local
 * Retorna o logo local se encontrado, caso contrário retorna o logo fornecido (do banco de dados)
 */
export const getTeamLogo = (teamNameOrId: string, fallbackLogo?: string): string => {
  // Primeiro tenta encontrar pelo nome
  let team = teams.find(t => 
    t.name.toLowerCase() === teamNameOrId.toLowerCase() || 
    t.id === teamNameOrId.toLowerCase()
  );
  
  // Se não encontrar, tenta por correspondência parcial (útil para variações de nomes)
  if (!team) {
    team = teams.find(t => 
      t.name.toLowerCase().includes(teamNameOrId.toLowerCase()) ||
      teamNameOrId.toLowerCase().includes(t.name.toLowerCase())
    );
  }
  
  // Retorna o logo local se encontrado, senão retorna o fallback ou uma string vazia
  return team?.logo || fallbackLogo || "";
};
