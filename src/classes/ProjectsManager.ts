import { IProject, ITodo, Project } from './Project'
import type { ProjectStatus, ProjectUserRole } from './Project'
import { v4 as uuidv4 } from 'uuid'

const  availableColors = ["#ca8134", "#55ad99", "#a55d93", "#ad99b9", "#ad2133", "#21ad33", "#bbaaaa"]

export class ProjectsManager {
  list: Project[] = []
  // events to handle projects, accepting projects as arguments
  onProjectCreated = (project: Project) => {}
  onProjectUpdated = (project: Project) => {}
  onProjectDeleted = (project: Project) => {}

  todoUI: HTMLElement

  constructor() {
    const project = this.newProject({
      name: "Default Project",
      description: "This is just a default app project",
      projectStatus: "Pending",
      userRole: "Architect",
      finishDate: new Date()
    })
  }
  
  newProject(data: IProject): Project {
    const projectNames = this.list.map((project) => {      
      return project.name
    })

    const nameInUse = projectNames.includes(data.name)
    if (nameInUse) {
      throw new Error(`A project with the name "${data.name}" is already in use`)
    } else if (data.name.length <5) {
      throw new Error(`Project name: "${data.name}" is too short`)
    } 
    if (!data.finishDate || !this.isValidDate(data.finishDate)) {
      data.finishDate = new Date(Date.now() + 12096e5) //Today + 14 days
    } 
    
    const newProject = new Project(data) 

    this.list.push(newProject)   
    this.onProjectCreated(newProject)
    return newProject
  }

  updateProject(data: IProject, id: string): Project {
    const project = this.getProject(id)

    if (!project) {
      throw new Error(`Project with id: "${id}" not found`)
    }
    
    if (data.name && data.name.length < 5) {
      throw new Error(`Project name: "${data.name}" is too short`)
    }
    if (data.description && data.description.length < 3) {
      throw new Error(`Description is too short`)
    }
    if (!["Pending", "Active", "Finished"].includes(data.projectStatus.toString())) {
      throw new Error('Status not set')
    }
    if (!["Architect", "Engineer", "Developer"].includes(data.userRole)) {
      throw new Error('UserRole not set')
    }
    if (!data.finishDate || !this.isValidDate(new Date(data.finishDate))) {
      data.finishDate = new Date(Date.now() + 12096e5) //Today + 14 days
    } 
    project.name = data.name
    project.description = data.description
    project.userRole = data.userRole
    project.projectStatus = data.projectStatus
    project.finishDate = new Date(data.finishDate)

    // console.log('project', project);
    
    this.onProjectUpdated(project)
    return project
  }
  addProjectTodo(projectId: string, todoData: ITodo): ITodo {
    const project = this.getProject(projectId)
    if (project) {
      const newTodo = {
        ...todoData,
        id: uuidv4() // Ensure a unique ID for each todo
      }
      project.todos.push(newTodo)
      return newTodo
    }
    throw new Error('Project not found')
  }
  updateProjectTodos(id: string, todo: ITodo) {}
  deleteProjectTodos(id: string, todo: ITodo) {}

  getProject(id: string): Project | undefined {
    return this.list.find(project => project.id === id)
  }

  getProjectsByName(name: string): Project[] {
    return this.list.filter(project => project.name === name)
  }

  deleteProject(id: string): void {
    const project = this.getProject(id)
    if (!project) {return}
    const remainingProjects = this.list.filter(project => project.id !== id)
    this.list = remainingProjects
    this.onProjectDeleted(project)
  }

  totalCost(): number {
    return this.list.reduce((total, project) => total + project.cost, 0)
  }

  isValidDate(d: any) {
    return d instanceof Date && !isNaN(d)
  }

  exportToJSON(fileName: string = "projects") {
    const json = JSON.stringify(this.list, null, 2)
    console.log(json);
    const blob = new Blob([json], { type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  importFromJSON() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()
    reader.addEventListener("load", () => {
      const json = reader.result
      if (!json) { return }
      const projects: IProject[] = JSON.parse(json as string)
      for (const project of projects) {
        try {
          if (this.list.find(p => p.id=== project.id)) {
            this.updateProject(project, project.id)
          } 
            this.newProject(project)          
        } catch (error) {
          // console.log(error);
          
        }
      }
    })
    input.addEventListener('change', () => {
      const filesList = input.files
      if (!filesList) { return }
      reader.readAsText(filesList[0])
    })
    input.click()
  }
}