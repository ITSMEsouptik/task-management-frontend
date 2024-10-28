import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthServiceService } from './auth/auth-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'task-management-frontend';
  isCentered: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
          if (event.url === '/tasks' || event.url === '/tasks/create') {
            this.isCentered = false;
          } else {
            this.isCentered = true;
          }
        }
      },
    });
    if (!this.authService.getToken()) {
      this.authService.redirectToLogin();
    }
  }
}
