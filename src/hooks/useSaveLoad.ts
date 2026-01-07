import { useState, useCallback, useEffect } from 'react';
import { 
  GameSaveData, 
  SaveSlot, 
  CURRENT_SAVE_VERSION, 
  MAX_SAVE_SLOTS,
  generateSaveId,
  validateSaveData,
  migrateSaveData,
  SavedPlayer,
  SeasonStats
} from '@/types/gameState';
import { Player } from '@/data/players';
import { toast } from 'sonner';

const SAVE_STORAGE_KEY = 'football_manager_saves';

export interface SaveLoadHook {
  slots: SaveSlot[];
  loading: boolean;
  saveGame: (slotNumber: number, data: GameSaveParams) => Promise<boolean>;
  loadGame: (slotNumber: number) => Promise<GameSaveData | null>;
  deleteSave: (slotNumber: number) => Promise<boolean>;
  getSaveSlots: () => SaveSlot[];
  autoSave: (data: GameSaveParams) => Promise<boolean>;
}

export interface GameSaveParams {
  clubName: string;
  season: string;
  budget: number;
  totalSales: number;
  totalPurchases: number;
  hasActiveInvestment: boolean;
  players: Player[];
  championshipId?: string;
  currentRound?: number;
  seasonStats?: Partial<SeasonStats>;
}

function getStoredSaves(): SaveSlot[] {
  try {
    const stored = localStorage.getItem(SAVE_STORAGE_KEY);
    if (!stored) return initializeEmptySlots();
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return initializeEmptySlots();
    
    // Ensure we have all slots
    const slots: SaveSlot[] = [];
    for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
      const existingSlot = parsed.find((s: SaveSlot) => s.slotNumber === i);
      if (existingSlot) {
        slots.push(existingSlot);
      } else {
        slots.push({
          id: `slot_${i}`,
          slotNumber: i,
          saveData: null,
          isEmpty: true
        });
      }
    }
    
    return slots;
  } catch {
    return initializeEmptySlots();
  }
}

function initializeEmptySlots(): SaveSlot[] {
  return Array.from({ length: MAX_SAVE_SLOTS }, (_, i) => ({
    id: `slot_${i + 1}`,
    slotNumber: i + 1,
    saveData: null,
    isEmpty: true
  }));
}

function storeSaves(slots: SaveSlot[]): void {
  try {
    localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(slots));
  } catch (error) {
    console.error('Failed to store saves:', error);
    toast.error('Erro ao salvar no armazenamento local');
  }
}

function convertPlayersToSavedPlayers(players: Player[]): SavedPlayer[] {
  return players.map(player => ({
    ...player,
    status: player.isStarter ? 'titular' : 'reserva' as const,
    evolutionHistory: player.ovrChange !== undefined ? [player.ovrChange] : []
  }));
}

export function useSaveLoad(): SaveLoadHook {
  const [slots, setSlots] = useState<SaveSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedSlots = getStoredSaves();
    setSlots(loadedSlots);
    setLoading(false);
  }, []);

  const getSaveSlots = useCallback((): SaveSlot[] => {
    return getStoredSaves();
  }, []);

  const saveGame = useCallback(async (slotNumber: number, params: GameSaveParams): Promise<boolean> => {
    try {
      setLoading(true);
      
      const currentSlots = getStoredSaves();
      const slotIndex = currentSlots.findIndex(s => s.slotNumber === slotNumber);
      
      if (slotIndex === -1) {
        toast.error('Slot de save inválido');
        return false;
      }

      const saveData: GameSaveData = {
        id: generateSaveId(),
        version: CURRENT_SAVE_VERSION,
        savedAt: new Date().toISOString(),
        slotName: `Save ${slotNumber}`,
        clubName: params.clubName,
        season: params.season || '2024',
        budget: params.budget,
        totalSales: params.totalSales,
        totalPurchases: params.totalPurchases,
        hasActiveInvestment: params.hasActiveInvestment,
        players: convertPlayersToSavedPlayers(params.players),
        championshipId: params.championshipId,
        currentRound: params.currentRound,
        seasonStats: {
          matchesPlayed: params.seasonStats?.matchesPlayed ?? 0,
          wins: params.seasonStats?.wins ?? 0,
          draws: params.seasonStats?.draws ?? 0,
          losses: params.seasonStats?.losses ?? 0,
          goalsFor: params.seasonStats?.goalsFor ?? 0,
          goalsAgainst: params.seasonStats?.goalsAgainst ?? 0,
          position: params.seasonStats?.position,
          points: params.seasonStats?.points
        },
        settings: {
          autoSave: true
        }
      };

      currentSlots[slotIndex] = {
        id: `slot_${slotNumber}`,
        slotNumber,
        saveData,
        isEmpty: false,
        lastModified: saveData.savedAt
      };

      storeSaves(currentSlots);
      setSlots(currentSlots);
      
      toast.success(`Jogo salvo no Slot ${slotNumber}!`);
      return true;
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Erro ao salvar o jogo');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadGame = useCallback(async (slotNumber: number): Promise<GameSaveData | null> => {
    try {
      setLoading(true);
      
      const currentSlots = getStoredSaves();
      const slot = currentSlots.find(s => s.slotNumber === slotNumber);
      
      if (!slot || slot.isEmpty || !slot.saveData) {
        toast.error('Nenhum save encontrado neste slot');
        return null;
      }

      // Validate save data
      if (!validateSaveData(slot.saveData)) {
        toast.error('Save corrompido! Os dados não puderam ser validados.');
        return null;
      }

      // Migrate if needed
      const migratedData = migrateSaveData(slot.saveData);
      
      toast.success(`Save carregado: ${migratedData.clubName}`);
      return migratedData;
    } catch (error) {
      console.error('Load error:', error);
      toast.error('Erro ao carregar o save');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSave = useCallback(async (slotNumber: number): Promise<boolean> => {
    try {
      setLoading(true);
      
      const currentSlots = getStoredSaves();
      const slotIndex = currentSlots.findIndex(s => s.slotNumber === slotNumber);
      
      if (slotIndex === -1) {
        toast.error('Slot não encontrado');
        return false;
      }

      currentSlots[slotIndex] = {
        id: `slot_${slotNumber}`,
        slotNumber,
        saveData: null,
        isEmpty: true
      };

      storeSaves(currentSlots);
      setSlots(currentSlots);
      
      toast.success('Save deletado com sucesso');
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Erro ao deletar o save');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const autoSave = useCallback(async (params: GameSaveParams): Promise<boolean> => {
    // Auto-save always uses slot 1
    return saveGame(1, params);
  }, [saveGame]);

  return {
    slots,
    loading,
    saveGame,
    loadGame,
    deleteSave,
    getSaveSlots,
    autoSave
  };
}
