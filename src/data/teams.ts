import realMadridLogo from "@/assets/teams/real-madrid.png";
import barcelonaLogo from "@/assets/teams/barcelona.png";
import manCityLogo from "@/assets/teams/man-city.png";
import liverpoolLogo from "@/assets/teams/liverpool.png";
import psgLogo from "@/assets/teams/psg.png";
import vascoLogo from "@/assets/teams/vasco.png";
import santosLogo from "@/assets/teams/santos.png";
import corinthiansLogo from "@/assets/teams/corinthians.png";
import fluminenseLogo from "@/assets/teams/fluminense.png";
import gremioLogo from "@/assets/teams/gremio.svg";
import atleticoMgLogo from "@/assets/teams/atletico-mg.png";

export interface Team {
  id: string;
  name: string;
  league: string;
  rating: number;
  logo: string;
}

export const teams: Team[] = [
  // Brasileiro
  { id: "flamengo", name: "Flamengo", league: "brasileiro", rating: 5, logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg" },
  { id: "palmeiras", name: "Palmeiras", league: "brasileiro", rating: 5, logo: "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg" },
  { id: "santos", name: "Santos", league: "brasileiro", rating: 4, logo: santosLogo },
  { id: "sao-paulo", name: "São Paulo", league: "brasileiro", rating: 4, logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Brasao_do_Sao_Paulo_Futebol_Clube.svg" },
  { id: "corinthians", name: "Corinthians", league: "brasileiro", rating: 4, logo: corinthiansLogo },
  { id: "gremio", name: "Grêmio", league: "brasileiro", rating: 4, logo: gremioLogo },
  { id: "atletico-mg", name: "Atlético Mineiro", league: "brasileiro", rating: 4, logo: atleticoMgLogo },
  { id: "internacional", name: "Internacional", league: "brasileiro", rating: 3, logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Escudo_do_Sport_Club_Internacional.svg" },
  { id: "botafogo", name: "Botafogo", league: "brasileiro", rating: 3, logo: "https://upload.wikimedia.org/wikipedia/commons/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg" },
  { id: "vasco", name: "Vasco da Gama", league: "brasileiro", rating: 3, logo: vascoLogo },
  { id: "fluminense", name: "Fluminense", league: "brasileiro", rating: 3, logo: fluminenseLogo },
  { id: "cruzeiro", name: "Cruzeiro", league: "brasileiro", rating: 3, logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg" },

  // Europeu
  { id: "real-madrid", name: "Real Madrid", league: "europeu", rating: 5, logo: realMadridLogo },
  { id: "barcelona", name: "Barcelona", league: "europeu", rating: 5, logo: barcelonaLogo },
  { id: "man-city", name: "Manchester City", league: "europeu", rating: 5, logo: manCityLogo },
  { id: "liverpool", name: "Liverpool", league: "europeu", rating: 4, logo: liverpoolLogo },
  { id: "bayern", name: "Bayern Munich", league: "europeu", rating: 5, logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg" },
  { id: "psg", name: "Paris Saint-Germain", league: "europeu", rating: 4, logo: psgLogo },
  { id: "juventus", name: "Juventus", league: "europeu", rating: 4, logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Juventus_FC_-_pictogram_black_%28Italy%2C_2017%29.svg" },
  { id: "milan", name: "AC Milan", league: "europeu", rating: 4, logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg" },
  { id: "chelsea", name: "Chelsea", league: "europeu", rating: 4, logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Chelsea_FC.svg" },
  { id: "arsenal", name: "Arsenal", league: "europeu", rating: 4, logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Arsenal_FC.svg" },
  { id: "inter", name: "Inter Milan", league: "europeu", rating: 4, logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg" },
  { id: "atletico", name: "Atlético Madrid", league: "europeu", rating: 4, logo: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Atletico_Madrid_2017_logo.svg" },
];

export const leagues = [
  { id: "brasileiro", name: "Brasileiro", flag: "🇧🇷" },
  { id: "europeu", name: "Europeu", flag: "🇪🇺" },
];
