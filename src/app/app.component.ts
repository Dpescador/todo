import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Todo } from '../models/todo.model'; 

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public todos: Todo[] = [];
  public form: FormGroup;
  public mode: String = 'list';
  public title: string = 'Minhas tarefas';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(60),
        Validators.required,
      ])]
    });

    this.load();
  }

  changeMode(mode: String) {
    this.mode = mode;
  }

  add() {
    const title = this.form.controls['title'].value;
    const id = this.todos.length + 1;
    this.todos.push(new Todo(id, title, false));
    this.save();
    this.clear();
    this.changeMode('list');
  }

  clear() {
    this.form.reset();
  }

  remove(todo: Todo) {
    const index = this.todos.indexOf(todo);
    if (index !== -1) {
      this.todos.splice(index, 1);
    }
    this.save();
  }

  markAsDone(todo: Todo) {
    todo.done = true;
    this.save();
  }

  markAsUndone(todo: Todo) {
    todo.done = false;
    this.save();
  }

  save() {
    if (typeof localStorage !== 'undefined') {
      const data = JSON.stringify(this.todos);
      localStorage.setItem('todos', data);
    }
  }

  load() {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('todos');
      if (data) {
        this.todos = JSON.parse(data);
      } else {
        this.todos = [];
      }
    }
  }
}
