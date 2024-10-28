import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
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
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  myForm!: FormGroup;
  errorMsg!: any;
  isArray!: boolean;

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
    this.authService.register(payload).subscribe({
      error: (error) => {
        this.errorMsg = error.error.message;
        this.isArray = this.errorMsg instanceof Array;
        console.log('error: ', this.errorMsg);
        if(!this.errorMsg){
          this.router.navigate(['/signIn'])
        }
      },
    });
  }
}
