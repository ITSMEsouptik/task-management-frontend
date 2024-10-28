import { Component, OnInit } from '@angular/core';
import { DropdownComponent } from '../UI/dropdown/dropdown.component';
import { TasksService } from './tasks.service';
import { Task } from '../model/task.model';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../auth/auth-service.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TaskStatus } from '../model/status.model';
import { BehaviorSubject, debounceTime, Observable, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    DropdownComponent,
    CommonModule,
    CreateTaskComponent,
    RouterOutlet,
    FormsModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  search!: string;
  searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();
  listOfTasks!: Task[];
  filteredTasks!: Task[];
  error!: string;
  filterPlaceHolder: string | TaskStatus = 'No status filter';
  constructor(
    private taskService: TasksService,
    private authService: AuthServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.taskService.tasks$.subscribe({
      next: (tasks) => {
        this.listOfTasks = tasks;
        this.filteredTasks = tasks;
      },
    });
    this.search$
      .pipe(
        debounceTime(800),
        switchMap((searchTerm) => this.filterTasks(searchTerm))
      )
      .subscribe({
        next: (filtered: Task[]) => {
          this.filteredTasks = filtered;
        },
      });
    // this.searchSubject.next(this.search);
  }

  filterTasks(searchTerm: string): Observable<Task[]> {
    if (searchTerm) {
      return new Observable<Task[]>((observer) => {
        observer.next(
          this.listOfTasks.filter(
            (task) =>
              task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              task.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        observer.complete();
      });
    } else {
      return new Observable<Task[]>((observer) => {
        observer.next(this.listOfTasks);
        observer.complete();
      });
    }
  }

  filterOption(option: TaskStatus) {
    this.filterPlaceHolder = option;
    this.filteredTasks = this.listOfTasks.filter(
      (task) => task.status === option
    );
  }

  remove(id?: string) {
    this.taskService.delete(id).subscribe({
      next: () => {
        this.taskService.removeTask(id);
      },
    });
    // this.taskService.removeTask(id)
  }

  onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  logout() {
    this.authService.logout();
  }

  createTask(): void {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  handleStatusChange(option: TaskStatus, id: string | undefined) {
    const task: Observable<Task> = this.taskService.update(id, {
      status: option,
    });
    task.subscribe({
      next: (task: Task) => {
        this.taskService.updateTask(task);
      },
    });
  }
}
