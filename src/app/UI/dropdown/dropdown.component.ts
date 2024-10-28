import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskStatus } from '../../model/status.model';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent {
  @Input({required: true}) placeHolder!: string | undefined;
  @Output() selectionChange = new EventEmitter<TaskStatus>();
  isDropdownOpen: boolean = false;
  options: TaskStatus[] = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  selectedOption!: TaskStatus
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  setOption(option: TaskStatus){
    this.selectedOption = option;
    this.selectionChange.emit(this.selectedOption)
    this.toggleDropdown()
  }
}
