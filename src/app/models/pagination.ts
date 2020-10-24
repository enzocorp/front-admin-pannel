export interface Paginate {limit : number, skip : number}

export interface MongoPaginate{
  limit? : number,
  skip? : number
  match? : Object
  sort? : Object
  project? : Object
  lookups? : Array<Object>,
  addFields? : any
}

export interface MongoPaginatev2{
  limit? : number,
  skip? : number
  aggregate? : Array<Record<string,Object>>
  facet? : Array<Record<string,Object>>
}
