import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getArrByFormControlKeyPipe'
})
export class GetArrByObjKeyPipe implements PipeTransform {

  transform(value: any[], key: string): any[] {
     return value.map(item => item[key].value);
  }

}
