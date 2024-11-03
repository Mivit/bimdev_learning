import { v4 as uuidv4 } from 'uuid'

export type ProjectStatus = "Pending" | "Active" | "Finished"
export type TodoStatus = "Pending" | "Ongoing" | "Finished"
export type ProjectUserRole = "Architect" | "Engineer" | "Developer"

export interface IProject {
  name: string
	description: string
	projectStatus: ProjectStatus
	userRole: ProjectUserRole
	finishDate: Date
}

export interface ITodo {
  name: string
  description: string
  status: TodoStatus
  date: Date
}

export class Todo implements ITodo {
  name: string
  description: string
  status: TodoStatus
  date: Date
  id: string

  constructor(data: ITodo) {
    for (const key in data) {
      this[key] = data[key]
    }
    this.id = uuidv4()
  }

  getID() {
    return this.id
  }
}

export class Project implements IProject {
	//To satisfy IProject
  name: string
	description: string
	projectStatus: ProjectStatus
	userRole: ProjectUserRole
  finishDate: Date
  
  //Class internals
  cost: number = 1000
  progress: number = 0
  id: string
  todos: ITodo[] = []

  constructor(data: IProject) {
    for (const key in data) {
      this[key] = data[key]
    }
    this.id = uuidv4()
  }

  getID() {
    return this.id
  }

  addTodo(todo: ITodo) {
    // Check if a todo with the same ID already exists
    const todoExists = this.todos.some(existingTodo => existingTodo.id === todo.id)
    if (!todoExists) {
      this.todos.push(todo)
    } else {
      console.warn(`Todo with ID ${todo.id} already exists in the project.`)
    }
  }
}