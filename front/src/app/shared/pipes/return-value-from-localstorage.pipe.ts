import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'returnValueFromLocalstorage'
})
export class ReturnValueFromLocalstoragePipe implements PipeTransform {

  transform(key: string): string {
    return localStorage.getItem(key);
  }

}
