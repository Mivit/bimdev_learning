import { IProject, Project } from './Project'
import type { ProjectStatus, ProjectUserRole } from './Project'

const  availableColors = ["#ca8134", "#55ad99", "#a55d93", "#ad99b9", "#ad2133", "#21ad33", "#bbaaaa"]

export class ProjectsManager {
  list: Project[] = []
  ui: HTMLElement
  todoUI: HTMLElement

  constructor(container: HTMLElement) {
    this.ui = container
    this.newProject({
      name: "Default Project",
      description: "This is just a default app project",
      projectStatus: "Pending",
      userRole: "Architect",
      finishDate: new Date(),
      todos: [
        {
          title: "Default Todo",
          description: "This is just a default todo",
          status: "Finished",
          dueDate: new Date()
        }
      ]
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
    const pElemen = newProject.ui.getElementsByTagName("p")
    pElemen[0].style.backgroundColor = availableColors[Math.floor(Math.random()*6)]
    newProject.ui.addEventListener("click", () => {
      const projectsPage = document.getElementById("projects-page")
      const detailsPage = document.getElementById("project-details")
      if (!(projectsPage && detailsPage)) { return }
      projectsPage.style.display = "none"
      detailsPage.style.display = "flex"
      this.setDetailsPage(newProject)
      // console.log('newProject', newProject.todos);
      
    })
    // append the new project to the projects list in the UI and our list
    this.ui.append(newProject.ui)
    this.list.push(newProject)   
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

    this.setDetailsPage(project)
    this.setProjectsPage(project)
    return project
  }

  private setDetailsPage(project: Project) {
    const detailsPage = document.getElementById("project-details")
    const todosContainer = document.getElementById("todo-container")
    if (!detailsPage) { return }

    for (const key in project) {
      const HTMLElements = detailsPage.querySelectorAll(`[data-project-info=${key}]`)
      if (HTMLElements) {
        if (key === "finishDate") {
          HTMLElements[0].textContent = project.finishDate.toLocaleDateString('sv-SE');
        } else if (key === "progress") {
          const progress = HTMLElements[0] as HTMLElement;
          progress.style.width = project.progress + "%";
          progress.textContent = project.progress.toString() + "%";
        } else {
          for (const element of HTMLElements) {  
            element.textContent = project[key]
          }
        }        
      }
    }
    if (!todosContainer) { return }
    const todoElement = document.createElement("div")
    if (project.todos.length < 1) {
      todoElement.textContent = "No todos"
      todosContainer.append(todoElement)
      return
    } else  {
      todosContainer.innerHTML = ""
      for (const todo of project.todos) {
        const todoElement = document.createElement("div")
        todoElement.className = "todo-item"
        todoElement.style.display = "flex"
        todoElement.style.justifyContent = "space-between"
        todoElement.style.alignItems = "center"
        todoElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex;  align-items: center; border-radius: 5px; padding: 10px; background-color: #969696;">
                <span class="material-icons-round">
                  construction
                  </span>
              </div>
              <div style="padding: 0 10px;">
                <h5 id="todo_title">${todo.title}</h5>
                <p id="todo_description">${todo.description}</p>
                <p id="todo_status" style="padding: 10px 0 0 0;">${todo.status}</p>
              </div>
            </div>
            <p class="todo-date">Fri, 20 sep</p>
        `
        switch (todo.status) {
          case "Pending":
            todoElement.className = "todo-item alert"

            break;
          case "Ongoing":
            todoElement.className = "todo-item warning"
            break;
          case "Finished":
            todoElement.className = "todo-item ok"
            break;
        }

        todosContainer.append(todoElement)

        todoElement.addEventListener("click", () => {
          const todoStatus = todoElement.getElementsByTagName("p")[1]
          
          switch (todo.status) {  
            case "Pending":
              todoElement.className = "todo-item warning";
              todo.status = "Ongoing";
              todoStatus.textContent = "Ongoing"
              break;
            case "Ongoing":
              todoElement.className = "todo-item ok"
              todo.status = "Finished"
              todoStatus.textContent = "Finished"
              break;
            case "Finished":
              todoElement.className = "todo-item alert"
              todo.status = "Pending"
              todoStatus.textContent = "Pending"
              break;
          }
        })
      }
    }
  }

  private setProjectsPage(project: Project) {
    // console.log('setProjectsPage', project);
    project.ui.getElementsByTagName("h5")[0].textContent = project.name
    project.ui.getElementsByTagName("p")[1].textContent = project.description    
    project.ui.getElementsByTagName("p")[3].textContent = project.projectStatus    
    project.ui.getElementsByTagName("p")[5].textContent = project.userRole    
  }
  
  private addTodo(name: string, todoData: any) {
    const project = this.getProjectsByName(name)[0]
    if (project) {
      console.log('Current Todos:', project.todos);
      
      if (!todoData.dueDate || !this.isValidDate(todoData.dueDate)) {
        todoData.dueDate = new Date(Date.now() + 12096e5) //Today + 14 days
      } 
      project.addTodo(todoData)
      this.setDetailsPage(project)

    } else {
      throw new Error(`Project with id: "${name}" not found`)
    }    
  }

  getProject(id: string): Project | undefined {
    return this.list.find(project => project.id === id)
  }

  getProjectsByName(name: string): Project[] {
    return this.list.filter(project => project.name === name)
  }

  deleteProject(id: string): void {
    const project = this.getProject(id)
    if (!project) {return}
    project.ui.remove()
    const remainingProjects = this.list.filter(project => project.id !== id)
    this.list = remainingProjects
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
          this.newProject(project)
          // console.log(project);
          
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