import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceBy'
})
export class ReplaceByPipe implements PipeTransform {

  transform(value: string, toReplace : string, replaceWith : string): string | number {
    try {
      let regex = new RegExp(toReplace,'g')
      value = value.replace(regex,replaceWith)
      return value
    }catch (err){
      // console.log('porbleme dans le pipe "replace by"')
      return value
    }
  }

}
