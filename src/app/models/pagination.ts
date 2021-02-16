export interface Paginate {limit : number, skip : number}

export interface MongoPaginate extends Paginate{
  match? : Object
  sort? : Object
  project? : Object
  lookups? : Array<Object>,
  addFields? : Object
}

