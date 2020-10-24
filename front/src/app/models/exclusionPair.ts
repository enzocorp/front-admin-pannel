export interface Reason {
  status : string
  for : string
  description : string
}

export interface Severity {
  severity : number
  description : string
}

export interface ExclusionPair {
  market : string
  reasons : string[]
  severity : number
  note? : string
  excludeBy? : string
  date? : Date
}

export interface ExclusionMarket{
  reasons : string[]
  severity : number
  note? : string
  excludeBy? : string
  date? : Date
}
