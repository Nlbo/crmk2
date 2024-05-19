import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'returnArrFieldsPipe'
})
export class ReturnArrFieldsPipe implements PipeTransform {

  transform(value: any[], key: string): any {
     return value.map(item => item[key]).join();
  }
}
