export interface Global{
  coinapi : {
    limit : string
    remaining : string
    dateReflow : string
  }
}

export interface graphConfig {
  isfor : number
  START_GRAPH : number //Point de depart du graphique
  END_GRAPH: number //Point de fin du graphique
  PAS_GRAPH: number//Saut entre chaque points du graphique
}
