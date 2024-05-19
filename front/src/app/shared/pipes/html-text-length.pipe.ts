import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlTextLength'
})
export class HtmlTextLengthPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): number {
    const div = document.createElement('div');
    div.innerHTML = value;
    return div.innerText.length;
  }

}
