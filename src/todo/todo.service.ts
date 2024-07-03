import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './interfaces/todo.interface';
import { CreateTodoDto, UpdateTodoDto } from './dto/create-todo.dto';

import * as fs from 'fs';
import * as path from 'path';

const FILE_PATH = path.resolve(__dirname, 'todos.json');

@Injectable()
export class TodoService {
  private todos: Todo[] = [];

  constructor() {
    this.loadTodos();
  }

  private loadTodos() {
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, 'utf8');
      this.todos = JSON.parse(data);
    }
  }

  private saveTodos() {
    fs.writeFileSync(FILE_PATH, JSON.stringify(this.todos, null, 2));
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find(todo => todo.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  create(createTodoDto: CreateTodoDto): Todo {
    const newTodo: Todo = {
      id: this.todos.length ? Math.max(...this.todos.map(todo => todo.id)) + 1 : 1,
      ...createTodoDto,
      completed: false,
    };
    this.todos.push(newTodo);
    this.saveTodos();
    return newTodo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Todo {
    const todo = this.findOne(id);
    Object.assign(todo, updateTodoDto);
    this.saveTodos();
    return todo;
  }

  remove(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
  }
}
