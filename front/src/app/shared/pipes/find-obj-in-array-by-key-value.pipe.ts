import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findObjInArrayByKeyValue'
})
export class FindObjInArrayByKeyValuePipe implements PipeTransform {

  transform(list: any[], key: string, value: string) {
    if (list?.length) {
      return list.find(item => item[key] === value);
    } else {
      return list;
    }
  }

}
