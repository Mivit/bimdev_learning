import { IProject, Project } from './Project'

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
    }
    const newProject = new Project(data)
    newProject.ui.addEventListener("click", () => {
      console.log("click");
      
      const projectsPage = document.getElementById("projects-page")
      const detailsPage = document.getElementById("project-details")
      if (!(projectsPage && detailsPage)) { return }
      projectsPage.style.display = "none"
      detailsPage.style.display = "flex"
      console.log(projectsPage.style);
      console.log(detailsPage.style);
      
    })
    this.ui.appendChild(newProject.ui)
    this.list.push(newProject)
    return newProject
  }

  getProject(id: string): Project | undefined {
    return this.list.find(project => project.id === id)
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

  getProjectByNames(name: string): Project[] {
    return this.list.filter(project => project.name === name)
  }

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