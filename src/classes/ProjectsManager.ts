import { IProject, Project } from './Project'
import type { ProjectStatus, ProjectUserRole } from './Project'

const  availableColors = ["#ca8134", "#55ad99", "#a55d93", "#ad99b9", "#ad2133", "#21ad33", "#bbaaaa"]

export class ProjectsManager {
  list: Project[] = []
  ui: HTMLElement

  constructor(container: HTMLElement) {
    this.ui = container
    this.newProject({
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
    const pElemen = newProject.ui.getElementsByTagName("p")
    pElemen[0].style.backgroundColor = availableColors[Math.floor(Math.random()*6)]
    newProject.ui.addEventListener("click", () => {
      const projectsPage = document.getElementById("projects-page")
      const detailsPage = document.getElementById("project-details")
      if (!(projectsPage && detailsPage)) { return }
      projectsPage.style.display = "none"
      detailsPage.style.display = "flex"
      this.setDetailsPage(newProject)
    })
    this.ui.appendChild(newProject.ui)
    this.list.push(newProject)
    return newProject
  }

  updateProject(data: IProject, name: string): Project {
    const project = this.getProjectsByName(name)[0]
    // Set updated values 
    console.log(data.name.length);
    
    if (data.name.length <5) {
      throw new Error(`Project name: "${data.name}" is too short`)
    }
    if (data.description.length <3) {
      throw new Error(`Decscription is too short`)
    }
    if (!["Pending", "Active", "Finished"].indexOf(data.projectStatus)) {
      throw new Error('Status not set')
    }
    if (!["Achitecht", "Engineer", "Developer"].indexOf(data.userRole)) {
      throw new Error('UserRole not set')
    }
    if (!data.finishDate || !this.isValidDate(data.finishDate)) {
      data.finishDate = new Date(Date.now() + 12096e5) //Today + 14 days
    } 
    project.name = data.name
    project.description = data.description
    project.userRole = data.userRole
    project.projectStatus = data.projectStatus
    project.finishDate = new Date(data.finishDate)
    console.log(project);

    this.setDetailsPage(project)
    return project
  }

  private setDetailsPage(project: Project) {
    const detailsPage = document.getElementById("project-details")
    if (!detailsPage) { return }
    const name = detailsPage.querySelector("[data-project-info='name']")
    if (name) {name.textContent = project.name }
    const desc = detailsPage.querySelector("[data-project-info='description']")
    if (desc) {desc.textContent = project.description }
    
    // CARD
    const abbr = detailsPage.querySelector("[data-project-info='abbr']")
    if (abbr) {abbr.textContent = project.name.slice(0, 2)}
    const cardName = detailsPage.querySelector("[data-project-info='cardName']")
    if (cardName) {cardName.textContent = project.name }
    const cardDescription = detailsPage.querySelector("[data-project-info='cardDescription']")
    if (cardDescription) {cardDescription.textContent = project.description }
    const projectStatus = detailsPage.querySelector("[data-project-info='projectStatus']")
    if (projectStatus) {projectStatus.textContent = project.projectStatus }
    const cost = detailsPage.querySelector("[data-project-info='cost']")
    if (cost) {cost.textContent = '$ ' + project.cost.toString()}
    const userRole = detailsPage.querySelector("[data-project-info='userRole']")
    if (userRole) {userRole.textContent = project.userRole }
    const finishDate = detailsPage.querySelector("[data-project-info='finishDate']")
    if (finishDate) {
      if(project.finishDate) {
        finishDate.textContent = project.finishDate.toLocaleDateString("sv-SE") 
      } else {
        const today = Date.now();

        finishDate.textContent = Date.now().toLocaleString("sv-SE") 
      }
    }

    //Load TODOs

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

  // TODOS
  getTodos() {}

  addTodo() {}

  exportToJSON(fileName: string = "projects") {
    const json = JSON.stringify(this.list, null, 2)

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