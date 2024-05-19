import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'joinByObjectKeyInArr'
})
export class JoinByObjectKeyInArr implements PipeTransform {

  transform(value: any[], key1: string, key2: string): unknown {
    const arr = [];
    value.forEach(item => {
      item[key1].forEach(item2 => {
        arr.push(item2[key2]);
      });
    });
    return arr;
  }

}
