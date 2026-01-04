import { Player } from "@/data/players";

export interface EvolutionResult {
  player: Player;
  changed: boolean;
  oldOvr: number;
  newOvr: number;
}

/**
 * Evolui o OVR dos jogadores baseado na idade
 * - Jovens (< 24): +1 OVR (30% chance por jogo)
 * - Idade média (24-30): mantém estável
 * - Velhos (> 30): -1 OVR (20% chance por jogo)
 * OVR mínimo: 50, máximo: 99
 */
export const evolvePlayerOvr = (player: Player): EvolutionResult => {
  const oldOvr = player.overall;
  let newOvr = oldOvr;
  let changed = false;

  if (player.age < 24) {
    // Jovem: chance de melhorar
    if (Math.random() < 0.30) {
      newOvr = Math.min(99, oldOvr + 1);
      changed = newOvr !== oldOvr;
    }
  } else if (player.age > 30) {
    // Veterano: chance de piorar
    if (Math.random() < 0.20) {
      newOvr = Math.max(50, oldOvr - 1);
      changed = newOvr !== oldOvr;
    }
  }
  // Idade média (24-30): sem mudança

  return {
    player: {
      ...player,
      overall: newOvr,
      ovrChange: changed ? (newOvr - oldOvr) : 0,
    },
    changed,
    oldOvr,
    newOvr,
  };
};

/**
 * Evolui todos os jogadores do time e retorna estatísticas
 */
export const evolveTeamPlayers = (players: Player[]): {
  evolvedPlayers: Player[];
  improvements: number;
  declines: number;
  improvedNames: string[];
  declinedNames: string[];
} => {
  let improvements = 0;
  let declines = 0;
  const improvedNames: string[] = [];
  const declinedNames: string[] = [];

  const evolvedPlayers = players.map((player) => {
    const result = evolvePlayerOvr(player);
    
    if (result.changed) {
      if (result.newOvr > result.oldOvr) {
        improvements++;
        improvedNames.push(`${player.name} (${result.oldOvr} → ${result.newOvr})`);
      } else {
        declines++;
        declinedNames.push(`${player.name} (${result.oldOvr} → ${result.newOvr})`);
      }
    }
    
    return result.player;
  });

  return {
    evolvedPlayers,
    improvements,
    declines,
    improvedNames,
    declinedNames,
  };
};

/**
 * Limpa os indicadores de mudança de OVR (após mostrar)
 */
export const clearOvrChanges = (players: Player[]): Player[] => {
  return players.map((p) => ({ ...p, ovrChange: 0 }));
};
