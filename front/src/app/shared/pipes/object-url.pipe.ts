import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectUrl'
})
export class ObjectUrlPipe implements PipeTransform {

  transform(value) {
    if (value) {
      return URL.createObjectURL(value);
    } else {
      return value;
    }
  }

}
