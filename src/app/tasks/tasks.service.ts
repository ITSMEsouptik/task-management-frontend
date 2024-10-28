import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../model/task.model';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { TaskStatus } from '../model/status.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getTasks();
  }
  getTasks() {
    this.http
      .get<Task[]>(`http://localhost:3000/tasks`)
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (tasks) => {
          this.tasksSubject.next(tasks);
        },
        error: (err) => console.log('Failed to fetch data: ', err),
      });
  }
  createTask(task: Task): Observable<any> {
    return this.http.post(`http://localhost:3000/tasks`, task).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  update(
    id: string | undefined,
    status: { status: TaskStatus }
  ): Observable<Task> {
    return this.http
      .patch<Task>(`http://localhost:3000/tasks/${id}/status`, status)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  delete(
    id: string | undefined
  ): Observable<any>{
    return this.http.delete(`http://localhost:3000/tasks/${id}`).pipe(
      catchError((error) => {
        return throwError(() => error)
      })
    )
  }

  addTask(task: Task) {
    this.tasksSubject.next([...this.tasksSubject.value, task]);
  }
  removeTask(id: string | undefined) {
    const taskToRemove: Task | undefined = this.tasksSubject.value.find(
      (item) => item.id === id
    );
    const filtered = this.tasksSubject.value.filter(
      (task) => task !== taskToRemove
    );
    this.tasksSubject.next(filtered);
  }
  updateTask(task: Task) {
    const updated: Task[] = this.tasksSubject.value.map((t) => {
      if (t.id === task.id) {
        return { ...t, status: task.status };
      }
      return t;
    });
    this.tasksSubject.next(updated);
  }
}
