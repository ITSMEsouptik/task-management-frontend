import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TasksService } from '../tasks.service';
import { Task } from '../../model/task.model';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
  imports: [FormsModule],
  standalone: true
})
export class CreateTaskComponent {
  error!: string
  task: Task = { title: '', description: '' };

  constructor(private router: Router,
    private taskService: TasksService
  ) { }

  onSubmit() {
    console.log('Task Created:', this.task);
    this.taskService.createTask({
      ...this.task
    }).subscribe({
      next: (res: Task) => {
        this.taskService.addTask(res)
        this.close();
      },
      error: (err) => {
        this.error = err;
      }
    })
  }

  close() {
    this.router.navigate(['tasks']);
  }
}
