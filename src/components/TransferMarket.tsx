import { useState } from "react";
import { X, Search, ShoppingCart, DollarSign } from "lucide-react";
import { Player } from "@/data/players";
import { calculateMarketValue, formatMarketValue } from "@/utils/marketValue";

// Jogadores disponíveis no mercado
const marketPlayers: Player[] = [
  { id: "m1", name: "Lucas Silva", number: 8, position: "VOL", overall: 78 },
  { id: "m2", name: "Rafael Costa", number: 11, position: "PE", overall: 80 },
  { id: "m3", name: "Diego Souza", number: 9, position: "ATA", overall: 82 },
  { id: "m4", name: "Marcos Vinicius", number: 5, position: "ZAG", overall: 77 },
  { id: "m5", name: "André Luiz", number: 1, position: "GOL", overall: 79 },
  { id: "m6", name: "Felipe Santos", number: 7, position: "PD", overall: 76 },
  { id: "m7", name: "Carlos Eduardo", number: 10, position: "MC", overall: 83 },
  { id: "m8", name: "Thiago Mendes", number: 6, position: "VOL", overall: 81 },
  { id: "m9", name: "Bruno Henrique", number: 17, position: "LE", overall: 75 },
  { id: "m10", name: "Gabriel Barbosa", number: 99, position: "ATA", overall: 85 },
  { id: "m11", name: "Pedro Raul", number: 19, position: "ATA", overall: 79 },
  { id: "m12", name: "Matheus Cunha", number: 20, position: "MC", overall: 84 },
];

interface TransferMarketProps {
  budget: number;
  onClose: () => void;
  onBuyPlayer: (player: Player, price: number) => void;
}

export const TransferMarket = ({ budget, onClose, onBuyPlayer }: TransferMarketProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState<string>("ALL");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const positions = ["ALL", "GOL", "ZAG", "LD", "LE", "VOL", "MC", "PD", "PE", "ATA"];

  const filteredPlayers = marketPlayers.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition === "ALL" || player.position === filterPosition;
    return matchesSearch && matchesPosition;
  });

  const handleBuy = (player: Player) => {
    const price = calculateMarketValue(player.overall);
    if (budget >= price) {
      onBuyPlayer(player, price);
      setSelectedPlayer(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-black border-b border-zinc-800 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-[#c8ff00]" />
            <h2 className="text-xl font-bold text-white">Mercado de Transferências</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Budget Display */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-900/40 via-green-800/40 to-green-900/40 border border-green-700/50 rounded-lg px-6 py-3">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-300/80 font-medium">Caixa Disponível:</span>
            <span className="text-xl font-bold text-green-400">
              {formatMarketValue(budget)}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar jogador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8ff00]"
            />
          </div>
        </div>

        {/* Position Filter */}
        <div className="px-4 pb-4 flex gap-2 overflow-x-auto">
          {positions.map((pos) => (
            <button
              key={pos}
              onClick={() => setFilterPosition(pos)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterPosition === pos
                  ? "bg-[#c8ff00] text-black"
                  : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              {pos === "ALL" ? "Todos" : pos}
            </button>
          ))}
        </div>
      </div>

      {/* Players List */}
      <div className="p-4 space-y-3">
        {filteredPlayers.map((player) => {
          const price = calculateMarketValue(player.overall);
          const canAfford = budget >= price;

          return (
            <div
              key={player.id}
              className="bg-zinc-900 rounded-lg p-4 border border-zinc-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-black border-2 border-white rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{player.number}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{player.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-zinc-400">{player.position}</span>
                      <span className="px-2 py-0.5 bg-blue-600 rounded text-xs font-bold text-white">
                        {player.overall}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">
                    {formatMarketValue(price)}
                  </div>
                  <button
                    onClick={() => handleBuy(player)}
                    disabled={!canAfford}
                    className={`mt-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                      canAfford
                        ? "bg-[#c8ff00] text-black hover:bg-[#b8ef00]"
                        : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                    }`}
                  >
                    {canAfford ? "Comprar" : "Sem Fundos"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            Nenhum jogador encontrado
          </div>
        )}
      </div>
    </div>
  );
};
