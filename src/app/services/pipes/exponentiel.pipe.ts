import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exponentiel'
})
export class ExponentielPipe implements PipeTransform {


  transform(value: number,arr : number = 6): string | number {
    try {
      let len : number = Math.trunc(value).toString().length //Longeur de la partie entiere
      if(len >= 2 && len <= arr )
        arr = arr - len
      else if (len > arr)
        arr = 0
      let val : number = +value.toFixed(arr)
      if(Math.trunc(val) === 0 && Math.trunc(val * 10) === 0 )
        val = +val.toExponential()
      return val
    }
    catch (err){
      return value
    }
  }

}
