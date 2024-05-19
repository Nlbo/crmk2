import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '@api/auth/auth.service';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import {AuthHelperService} from '@pages/auth/services/auth-helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  isSubmitting$ = of(false);
  passwordVisible = false;
  validateForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService, private router: Router, private authHelperService: AuthHelperService) {
  }

  ngOnInit(): void {
    this.initializeValues();
  }

  login() {
    if (this.validateForm.valid) {
      this.validateForm.get('email').setValue(this.validateForm.get('email').value.trim());
      this.isSubmitting$ = of(true);
      this.authService.login(this.validateForm.value).subscribe((data) => {
        localStorage.setItem('token', data.token);
        this.authService.getUserInfo().subscribe(user => {
          localStorage.setItem('language', user.language);
          this.authHelperService.setUserInfoAndSetAvailablePermissions(user);
          this.router.navigate(['', 'bots']);
          this.isSubmitting$ = of(false);
        }, error => {
          this.isSubmitting$ = of(false);
        });
      }, err => {
        this.isSubmitting$ = of(false);
      });
    }
  }

  initializeValues(): void {
  }
}
