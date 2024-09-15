import * as OBC from 'openbim-components'
import { v4 } from 'uuid'
import * as THREE from 'three'
import { TodoCard } from './src/todoCard'

type TodoPriority = "Low" | "Normal" | "High"

interface Todo { 
  uuid: string
  description: string
  date: Date
  fragmentMap: OBC.FragmentIdMap
  camera: {position: THREE.Vector3, target: THREE.Vector3},
  priority: TodoPriority
}

export class TodoCreator extends OBC.Component<Todo[]> implements OBC.UI, OBC.Disposable {
  static uuid = "7d6ed77d-cf89-44e9-961b-f687747020e5"
  onProjectCreated = new OBC.Event<Todo>()
  enabled = true
  onDelete = new OBC.Event()
  uiElement = new OBC.UIElement<{
    activationButton: OBC.Button
    todoList: OBC.FloatingWindow
  }>()

  private _components: OBC.Components
  private _list: Todo[] = []
  
  constructor(components: OBC.Components) {
    super(components)
    this._components = components
    components.tools.add(TodoCreator.uuid, this)
    this.setUI()
  }

  async dispose() {
    this.uiElement.dispose()
    this._list = []
    this.enabled = false
  }

  async setup() {
    const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
    highlighter.add(`${TodoCreator.uuid}-priority-Low`, [new THREE.MeshStandardMaterial({color: 0x59bc59})])
    highlighter.add(`${TodoCreator.uuid}-priority-Normal`, [new THREE.MeshStandardMaterial({color: 0x597cff})])
    highlighter.add(`${TodoCreator.uuid}-priority-High`, [new THREE.MeshStandardMaterial({color: 0xff7676})])
  }

  // Challange 1: Implement the deleteTodo method
  deleteTodo(todo: Todo, TodoCard: TodoCard) {
    TodoCard.dispose()
    this._list = this._list.filter((item) => item.uuid !== todo.uuid)
    // console.log(todo.uuid);
  }

  async addTodo(description: string , priority: TodoPriority = "Normal") {
    if (!this.enabled) {return}
    const camera = this._components.camera
    if (!(camera instanceof OBC.OrthoPerspectiveCamera)) {
      throw new Error("TodoCreator only works with OrthoPerspectiveCamera") 
    }

    const position  = new THREE.Vector3()
    camera.controls.getPosition(position)
    const target = new THREE.Vector3()
    camera.controls.getTarget(target)
    const todoCamerea = {position, target}


    const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
    const todo: Todo = {
      uuid: v4(),
      description,
      date: new Date(),
      fragmentMap: highlighter.selection.select,
      camera: todoCamerea,
      priority
    }
    // console.log(todo);

    this._list.push(todo)

    const todoCard = new TodoCard(this._components)
    todoCard.description = todo.description
    todoCard.date = todo.date
    todoCard.onCardClick.add(() => {
      camera.controls.setLookAt(
        todo.camera.position.x, 
        todo.camera.position.y, 
        todo.camera.position.z,
        todo.camera.target.x, 
        todo.camera.target.y, 
        todo.camera.target.z,
        true
      )
      const fragmentMapLength = Object.keys(todo.fragmentMap).length
      if (fragmentMapLength === 0) { return}
      highlighter.highlightByID("select", todo.fragmentMap)
    })
    const todoList = this.uiElement.get("todoList")
    todoList.addChild(todoCard)
    this.onProjectCreated.trigger(todo)
    todoCard.onDeleted.add(() => {
      this.deleteTodo(todo, todoCard)
    })
  }

  private async setUI() {
    const activationButton = new OBC.Button(this._components)
    activationButton.materialIcon = "construction"
    activationButton.tooltip = "Create a todo"

    const newTodoBtn = new OBC.Button(this._components, {name: "Create"})
    activationButton.addChild(newTodoBtn)

    const form = new OBC.Modal(this._components)
    this._components.ui.add(form) 
    form.title = "Create a new todo"

    const descriptionInput = new OBC.TextArea(this._components)
    descriptionInput.label = "Description"
    form.slots.content.addChild(descriptionInput) 

    const priorityDropdown  = new OBC.Dropdown(this._components)
    priorityDropdown.label = "Priority"
    priorityDropdown.addOption("Low", "Normal", "High")
    priorityDropdown.value = "Normal"
    form.slots.content.addChild(priorityDropdown)

    form.slots.content.get().style.padding = "20px"
    form.slots.content.get().style.display = "flex"
    form.slots.content.get().style.flexDirection = "column"
    form.slots.content.get().style.rowGap = "20px"
    
    form.onAccept.add(() => {
      this.addTodo(descriptionInput.value, priorityDropdown.value as TodoPriority)
      descriptionInput.value = ""
      form.visible = false
    })

    form.onCancel.add(() => {
      form.visible = false
    })

    newTodoBtn.onClick.add(() => form.visible = true)

    const todoList = new OBC.FloatingWindow(this._components)
    this._components.ui.add(todoList)
    todoList.visible = false
    todoList.title = "To-Do list"

    const todoListToolbar = new OBC.SimpleUIComponent(this._components)
    todoList.addChild(todoListToolbar)

    const coloizeBtn = new OBC.Button(this._components)
    coloizeBtn.materialIcon = "format_color_fill"
    todoListToolbar.addChild(coloizeBtn)

    const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
    coloizeBtn.onClick.add(() => {
      coloizeBtn.active = !coloizeBtn.active
      if (coloizeBtn.active) {
        for (const todo of this._list) {
          const fragmentMapLength = Object.keys(todo.fragmentMap).length
          if (fragmentMapLength === 0) { return}
          highlighter.highlightByID(`${TodoCreator.uuid}-priority-${todo.priority}`, todo.fragmentMap)
        }
      } else {
        highlighter.clear(`${TodoCreator.uuid}-priority-Low`)
        highlighter.clear(`${TodoCreator.uuid}-priority-Normal`)
        highlighter.clear(`${TodoCreator.uuid}-priority-High`)
      }
    })

    const todoListBtn = new OBC.Button(this._components, {name: "List"})
    activationButton.addChild(todoListBtn)
    todoListBtn.onClick.add(() => {
      todoList.visible = !todoList.visible
    })

    this.uiElement.set({activationButton, todoList})
  }

  get(): Todo[] {
    return this._list
  }

  getByID(uuid: string): Todo | undefined {
    return this._list.find((todo) => todo.uuid === uuid)
  }
}
