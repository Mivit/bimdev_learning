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

export class Project implements IProject {
	//To satisfy IProject
  name: string
	description: string
	projectStatus: ProjectStatus
	userRole: ProjectUserRole
  finishDate: Date
  
  //Class internals
  ui: HTMLDivElement
  todoUi: HTMLDivElement
  cost: number = 1000
  progress: number = 0
  id: string
  todos: [] = []

  constructor(data: IProject) {
    for (const key in data) {
      this[key] = data[key]
    }
    this.id = uuidv4()
  }

  addTodo(todo: any) {
    todo.id = uuidv4()
    this.todos.push(todo)
    console.log(this.todos);
    
  }
}