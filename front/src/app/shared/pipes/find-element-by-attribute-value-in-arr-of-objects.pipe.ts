import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'findElementByAttributeValueInArrOfObjectsPipe'
})
export class FindElementByAttributeValueInArrOfObjectsPipe implements PipeTransform {

  transform(arr: any[], key: string, value): any {
     return arr.find(item => item[key] === value);
  }
}
