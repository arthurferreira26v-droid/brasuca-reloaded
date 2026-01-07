import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useSaveLoad, GameSaveParams } from '@/hooks/useSaveLoad';
import { SaveSlot, GameSaveData } from '@/types/gameState';
import { Save, Download, Trash2, Loader2, Clock, Users, DollarSign } from 'lucide-react';
import { formatMarketValue } from '@/utils/marketValue';

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'save' | 'load';
  currentGameData?: GameSaveParams;
  onLoadComplete?: (saveData: GameSaveData) => void;
}

export function SaveLoadModal({ 
  isOpen, 
  onClose, 
  mode, 
  currentGameData,
  onLoadComplete 
}: SaveLoadModalProps) {
  const { slots, loading, saveGame, loadGame, deleteSave, getSaveSlots } = useSaveLoad();
  const [localSlots, setLocalSlots] = useState<SaveSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<number | null>(null);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [slotToOverwrite, setSlotToOverwrite] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      const loadedSlots = getSaveSlots();
      setLocalSlots(loadedSlots);
    }
  }, [isOpen, getSaveSlots]);

  const handleSave = async (slotNumber: number) => {
    if (!currentGameData) {
      return;
    }

    const slot = localSlots.find(s => s.slotNumber === slotNumber);
    if (slot && !slot.isEmpty) {
      setSlotToOverwrite(slotNumber);
      setShowOverwriteConfirm(true);
      return;
    }

    await performSave(slotNumber);
  };

  const performSave = async (slotNumber: number) => {
    if (!currentGameData) return;
    
    const success = await saveGame(slotNumber, currentGameData);
    if (success) {
      const updatedSlots = getSaveSlots();
      setLocalSlots(updatedSlots);
      onClose();
    }
  };

  const handleLoad = async (slotNumber: number) => {
    const saveData = await loadGame(slotNumber);
    if (saveData && onLoadComplete) {
      onLoadComplete(saveData);
      onClose();
    }
  };

  const handleDelete = (slotNumber: number) => {
    setSlotToDelete(slotNumber);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (slotToDelete !== null) {
      await deleteSave(slotToDelete);
      const updatedSlots = getSaveSlots();
      setLocalSlots(updatedSlots);
      setShowDeleteConfirm(false);
      setSlotToDelete(null);
    }
  };

  const confirmOverwrite = async () => {
    if (slotToOverwrite !== null) {
      await performSave(slotToOverwrite);
      setShowOverwriteConfirm(false);
      setSlotToOverwrite(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              {mode === 'save' ? (
                <>
                  <Save className="h-5 w-5 text-[#c8ff00]" />
                  Salvar Jogo
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 text-[#c8ff00]" />
                  Carregar Jogo
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#c8ff00]" />
              </div>
            ) : (
              localSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    slot.isEmpty 
                      ? 'bg-zinc-800/50 border-zinc-700 border-dashed'
                      : 'bg-zinc-800 border-zinc-600'
                  } ${selectedSlot === slot.slotNumber ? 'ring-2 ring-[#c8ff00]' : ''}`}
                  onClick={() => setSelectedSlot(slot.slotNumber)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-500">
                          SLOT {slot.slotNumber}
                        </span>
                        {slot.slotNumber === 1 && (
                          <span className="text-xs bg-[#c8ff00]/20 text-[#c8ff00] px-2 py-0.5 rounded">
                            AUTO-SAVE
                          </span>
                        )}
                      </div>
                      
                      {slot.isEmpty ? (
                        <p className="text-zinc-500 text-sm mt-1">Slot vazio</p>
                      ) : slot.saveData && (
                        <div className="mt-2">
                          <p className="text-white font-semibold">
                            {slot.saveData.clubName}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(slot.saveData.savedAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {slot.saveData.players.length} jogadores
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {formatMarketValue(slot.saveData.budget)}
                            </span>
                          </div>
                          {slot.saveData.currentRound && (
                            <p className="text-xs text-zinc-500 mt-1">
                              Rodada {slot.saveData.currentRound} • Temporada {slot.saveData.season}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {mode === 'save' ? (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(slot.slotNumber);
                          }}
                          className="bg-[#c8ff00] text-black hover:bg-[#b3e600]"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoad(slot.slotNumber);
                          }}
                          disabled={slot.isEmpty}
                          className="bg-[#c8ff00] text-black hover:bg-[#b3e600] disabled:opacity-50"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {!slot.isEmpty && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(slot.slotNumber);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-700">
            <p className="text-xs text-zinc-500">
              {mode === 'save' 
                ? 'Slot 1 é usado para auto-save. Escolha um slot para salvar seu progresso.'
                : 'Selecione um slot para carregar seu progresso salvo.'}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Deletar Save?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Esta ação não pode ser desfeita. O save será permanentemente deletado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Overwrite Confirmation */}
      <AlertDialog open={showOverwriteConfirm} onOpenChange={setShowOverwriteConfirm}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Sobrescrever Save?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Este slot já contém um save. Deseja sobrescrever com o progresso atual?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmOverwrite}
              className="bg-[#c8ff00] text-black hover:bg-[#b3e600]"
            >
              Sobrescrever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
