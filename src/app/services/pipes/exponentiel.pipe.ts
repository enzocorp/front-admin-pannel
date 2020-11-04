import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exponentiel'
})
export class ExponentielPipe implements PipeTransform {


  transform(value: number|string,decimals : number = 6): number {
    try {
      const num = +value
      let trunc : number = Math.trunc(num)
      let len : number //Longeur de la partie entiere
      if(trunc > 0)
        len = trunc.toString().length
      else
        len = 0

      let enleve =  Math.floor(len * 1.5)
      if(len > 0 && len <=3 && decimals - enleve > 0) //Plus la partie entiere est longue moins on veut récupèrer de chiffres après la virgule
        decimals -= enleve
      else if(len > 0) //Si la partie entière est + grande que le nombre de décimals souhaitée on ne prend aucune décimals
        decimals = 0

      let val : number = +num.toFixed(decimals)
      if(trunc === 0 && Math.trunc(val * 10*decimals) === 0 ) //Si le nombre de "0" consécutifs dépasse la qté de décimales souhaité, alors j'écrit le nombre en notation scientifique
        val = +val.toExponential()
      return val
    }
    catch (err){
      return +value
    }
  }

}
