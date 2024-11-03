import * as React from 'react'
import { ITodo } from '../classes/Project'
import type { TodoStatus } from '../classes/Project'
import { ProjectsManager } from '../classes/ProjectsManager'

interface TodoFormProps {
  onSubmit: (todo: ITodo) => void
  onCancel: () => void
  projectsManager: ProjectsManager
  id: string
}

const initialTodoState: ITodo = {
  id: '',
  name: '',
  description: '',
  status: 'Pending' as TodoStatus,
  date: new Date()
}

export function TodoForm(props: TodoFormProps) {
  const [todo, setTodo] = React.useState<ITodo>(initialTodoState)

  const onFormSubmit = (event) => {
    event.preventDefault()
    const newTodo = props.projectsManager.addProjectTodo(props.id, todo)
    props.onSubmit(newTodo)
    setTodo(initialTodoState)

    const todoFormModal = document.getElementById("todo-form-modal")
    if (!(todoFormModal && todoFormModal instanceof HTMLDialogElement)) { return }
    todoFormModal.close()
  };

  const onInputChange = (event) => {
    const { name, value } = event.target
    setTodo({
      ...todo,
      [name]: name === 'status' ? value as TodoStatus : value
    })
  }

  return (
    <dialog id="todo-form-modal">
      <form onSubmit={onFormSubmit}>
        <h2>Add Todo</h2>
        <div>
          <div className="form-field-container">
            <label htmlFor="todo">Todo</label>
            <input
              type="text"
              id="todo"
              name="name"
              value={todo.name}
              onChange={onInputChange}
            />
          </div>
          <div className="form-field-container">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              name="description"
              value={todo.description}
              onChange={onInputChange}
            ></textarea>
          </div>
          <div className="form-field-container">
            <label htmlFor="status">Status</label>
            <select 
              id="status" 
              name="status"
              value={todo.status}
              onChange={onInputChange}
              >
              <option value="Pending">Pending</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Finished">Finished</option>
            </select> 
          </div>
          <div className="form-field-container">
            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="date" />
          </div>
          <div className="button-group" >
            <button type="submit" className='btn-primary'>Add</button>
            <button type="button" onClick={props.onCancel}>Cancel</button>
          </div>
        </div>
      </form>
    </dialog>
  );
}