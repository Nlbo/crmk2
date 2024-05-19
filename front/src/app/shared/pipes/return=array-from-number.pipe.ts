import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'returnArrayFromNumberPipe'
})
export class ReturnArrayFromNumberPipe implements PipeTransform {

  transform(value: number): any[] {
     return new Array(value);
  }
}
