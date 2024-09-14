import * as OBC from 'openbim-components'
import { TodoCard } from './src/todoCard'

interface Todo { 
  description: string
  date: Date
  fragmentMap: OBC.FragmentIdMap
}

export class TodoCreator extends OBC.Component<Todo[]> implements OBC.UI {
  static uuid = "7d6ed77d-cf89-44e9-961b-f687747020e5"
  enabled = true
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

  async addTodo(description: string) {
    const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
    const todo: Todo = {
      description,
      date: new Date(),
      fragmentMap: highlighter.selection.select
    }
    // this._list.push(todo)    
    const todoCard = new TodoCard(this._components)
    todoCard.description = todo.description
    todoCard.date = todo.date
    todoCard.onCardClick.add(() => {
      const fragmentMapLength = Object.keys(todo.fragmentMap).length
      if (fragmentMapLength === 0) { return}
      highlighter.highlightByID("select", todo.fragmentMap)
    })
    const todoList = this.uiElement.get("todoList")
    todoList.addChild(todoCard)
  }

  private setUI() {
    const activationButton = new OBC.Button(this._components)
    activationButton.materialIcon = "construction"
    // activationButton.tooltip = "Create a todo"

    const newTodoBtn = new OBC.Button(this._components, {name: "Create"})
    activationButton.addChild(newTodoBtn)

    const form = new OBC.Modal(this._components)
    this._components.ui.add(form) 
    form.title = "Create a new todo"

    const descriptionInput = new OBC.TextArea(this._components)
    descriptionInput.label = "Description"
    form.slots.content.addChild(descriptionInput) 

    form.slots.content.get().style.padding = "20px"
    form.slots.content.get().style.display = "flex"
    form.slots.content.get().style.flexDirection = "column"
    form.slots.content.get().style.rowGap = "20px"
    
    form.onAccept.add(() => {
      this.addTodo(descriptionInput.value)
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
}
