import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinByObjectKey'
})
export class JoinByObjectKeyPipe implements PipeTransform {

  transform(value: any[], key1: string, key2: string): unknown {
     return value.map(item => item[key1][key2]).join();
  }

}
