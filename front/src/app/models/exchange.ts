export interface Exchange{
  _id : string
  name : string
  id_exchange : string
  symbolsCount : number
  website: string
  exclusion : {
    exchangeIsExclude : boolean
    reasons : string[]
    severity : number
    excludeBy : string
    note? : string
    date? : Date
  }
  date? : Date
}
