export interface Team {
  id: string;
  name: string;
  league: string;
  rating: number;
  logo: string;
}

export const teams: Team[] = [
  // 🇧🇷 Brasileiro
  { id: "flamengo", name: "Flamengo", league: "brasileiro", rating: 5, logo: "/teams/flamengo.png" },
  { id: "palmeiras", name: "Palmeiras", league: "brasileiro", rating: 5, logo: "/teams/palmeiras.svg" },
  { id: "santos", name: "Santos", league: "brasileiro", rating: 4, logo: "/teams/santos.png" },
  { id: "sao-paulo", name: "São Paulo", league: "brasileiro", rating: 4, logo: "/teams/sao-paulo.svg" },
  { id: "corinthians", name: "Corinthians", league: "brasileiro", rating: 4, logo: "/teams/corinthians.png" },
  { id: "gremio", name: "Grêmio", league: "brasileiro", rating: 4, logo: "/teams/gremio.svg" },
  { id: "atletico-mg", name: "Atlético Mineiro", league: "brasileiro", rating: 4, logo: "/teams/atletico-mg.png" },
  { id: "internacional", name: "Internacional", league: "brasileiro", rating: 3, logo: "/teams/internacional.svg" },
  { id: "botafogo", name: "Botafogo", league: "brasileiro", rating: 3, logo: "/teams/botafogo.svg" },
  { id: "vasco", name: "Vasco da Gama", league: "brasileiro", rating: 3, logo: "/teams/vasco.png" },
  { id: "fluminense", name: "Fluminense", league: "brasileiro", rating: 3, logo: "/teams/fluminense.png" },
  { id: "cruzeiro", name: "Cruzeiro", league: "brasileiro", rating: 3, logo: "/teams/cruzeiro.svg" },

  // ➕ Brasileiros adicionais
  { id: "athletico-pr", name: "Athletico Paranaense", league: "brasileiro", rating: 4, logo: "/teams/athletico-pr.svg" },
  { id: "bahia", name: "Bahia", league: "brasileiro", rating: 3, logo: "/teams/bahia.png" },
  { id: "bragantino", name: "Bragantino", league: "brasileiro", rating: 3, logo: "/teams/bragantino.png" },
  { id: "vitoria", name: "Vitória", league: "brasileiro", rating: 2, logo: "/teams/vitoria.png" },
  { id: "coritiba", name: "Coritiba", league: "brasileiro", rating: 2, logo: "/teams/coritiba.png" },
  { id: "chapecoense", name: "Chapecoense", league: "brasileiro", rating: 2, logo: "/teams/chapecoense.png" },
  { id: "mirassol", name: "Mirassol", league: "brasileiro", rating: 2, logo: "/teams/mirassol.png" },
  { id: "remo", name: "Remo", league: "brasileiro", rating: 2, logo: "/teams/remo.png" },

  // 🇪🇺 Europeu
  { id: "real-madrid", name: "Real Madrid", league: "europeu", rating: 5, logo: "/teams/real-madrid.png" },
  { id: "barcelona", name: "Barcelona", league: "europeu", rating: 5, logo: "/teams/barcelona.png" },
  { id: "man-city", name: "Manchester City", league: "europeu", rating: 5, logo: "/teams/man-city.png" },
  { id: "liverpool", name: "Liverpool", league: "europeu", rating: 4, logo: "/teams/liverpool.png" },
  { id: "bayern", name: "Bayern Munich", league: "europeu", rating: 5, logo: "/teams/bayern.svg" },
  { id: "psg", name: "Paris Saint-Germain", league: "europeu", rating: 4, logo: "/teams/psg.png" },
  { id: "juventus", name: "Juventus", league: "europeu", rating: 4, logo: "/teams/juventus.svg" },
  { id: "milan", name: "AC Milan", league: "europeu", rating: 4, logo: "/teams/milan.svg" },
  { id: "chelsea", name: "Chelsea", league: "europeu", rating: 4, logo: "/teams/chelsea.svg" },
  { id: "arsenal", name: "Arsenal", league: "europeu", rating: 4, logo: "/teams/arsenal.svg" },
  { id: "inter", name: "Inter Milan", league: "europeu", rating: 4, logo: "/teams/inter.svg" },
  { id: "atletico", name: "Atlético Madrid", league: "europeu", rating: 4, logo: "/teams/atletico-madrid.svg" },
];

export const leagues = [
  { id: "brasileiro", name: "Brasileiro", flag: "🇧🇷" },
  { id: "europeu", name: "Europeu", flag: "🇪🇺" },
];










