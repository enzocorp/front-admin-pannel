import {MongoPaginate, Paginate} from "../../models/pagination";

export class RequesterApi {

  constructor() {
  }
  static v1(query : MongoPaginate | Object = {}) : Array<any>{
    const obj : MongoPaginate = {
      limit : Infinity,
      match : {},
      sort : {_id: 1},
      skip : 0,
      ...query
    }
    const paginate : Array<any> = [{ $skip: obj.skip }, { $limit: obj.limit }]
    if (obj.project)
      paginate.push(obj.project)
    const aggregate : Array<any> = [
      { $match : obj.match  },
      { $sort : obj.sort },
      { $facet : {
          metadata: [ { $count: "total" }],
          data: paginate
        }}
    ]
    if (obj.addFields)
      aggregate.splice(1, 0, {$addFields : obj.addFields})
    if (obj.lookups){
      obj.lookups.forEach((lookup,i)=>{
        aggregate.splice(i + 1, 0, {$lookup : lookup})
      })
    }
    return aggregate
  }

  static v2(rawRequest : Record<number, any>&Partial<Paginate>) {

    const {skip = 0,limit = 20,...rawReq}  = rawRequest
    const facet = {$facet : {
        metadata: [ { $count: "total" }],
        data: [{ $skip: skip}, { $limit: limit }]
      }}
    let aggregate : Object[] = []
    if(rawReq){
      const len : number = Object.keys(rawReq).length
      for (let key in rawReq ){
        if(isNaN(+key))
          throw `La requête est mauvaise car une des clés n'est pas un nombre (${key})`
        if( +key > len-1)
          throw `La requête est mauvaise car l'index de la clé(${key}) est supérieur a la taille du tableau -1 (${len-1})`
        aggregate[+key] = rawReq[+key]
      }
    }
    if(aggregate.includes(undefined))
      throw "La requête est mauvaise car le tableau d'aggrégation possède un Trou de vide OU un champ indéfini ! "
    aggregate.push(facet)
    return aggregate
  }

}
