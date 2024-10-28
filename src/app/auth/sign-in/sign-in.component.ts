import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs';
import { Credentials } from '../../model/credentials.model';
import { AuthServiceService } from '../auth-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent implements OnInit {
  myForm!: FormGroup;
  errorMsg!: any;

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.myForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  onSubmit() {
    const name = this.myForm.value.username;
    const password = this.myForm.value.password;
    const payload: Credentials = {
      username: name,
      password,
    };
    this.authService.login(payload).subscribe({
      next: (token) => {localStorage.setItem('accessToken', token)
        if(this.authService.getToken()){
          this.router.navigate(['/tasks'])
        }
      },
      error: (error) => {
        this.errorMsg = error.error.message;
        console.log('error: ', this.errorMsg);
      },
    });
  }

  goToSignUp() {
    this.router.navigate(['/signUp'])
  }
}
