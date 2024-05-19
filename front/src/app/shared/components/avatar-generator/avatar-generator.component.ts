import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-avatar-generator',
  templateUrl: './avatar-generator.component.html',
  styleUrls: ['./avatar-generator.component.scss']
})
export class AvatarGeneratorComponent implements OnInit {

  @Input('width') width = 50;
  @Input('height') height = 50;
  @Input('fontSize') fontSize = 13;
  @Input('avatar') avatar = null;
  @Input('firstName') firstName = null;
  @Input('lastName') lastName = null;
  @Input('setLocalStorageColorById') setLocalStorageColorById = null;
  @Input('color') color = null;
  @Input('radius') radius = 50;
  colors: string[] = ['#eebf39', '#3983e6', '#7f8eab', '#d54323', '#a284f4', '#e79221', '#52b452'];

  constructor() {
  }

  ngOnInit(): void {
    if (!this.color) {
      this.color = this.colors[Math.round(Math.random() * 7)];
    }
    if (this.setLocalStorageColorById) {
      if (this.avatar) {
        localStorage.setItem(this.setLocalStorageColorById, this.avatar);
      } else {
        localStorage.setItem(this.setLocalStorageColorById, this.color);
      }
    }
  }

}
