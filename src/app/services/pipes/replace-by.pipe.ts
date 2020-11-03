import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceBy'
})
export class ReplaceByPipe implements PipeTransform {

  transform(value: string|number, to : string, by : string): string | number {
    try {
      let strValue = value.toString()
      let regex = new RegExp(to,'g')
      strValue = strValue.replace(regex,by)
      return strValue
    }catch (err){
      // console.log('porbleme dans le pipe "replace by"')
      return value
    }
  }

}
