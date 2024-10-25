import * as React from 'react';

interface TodoFormProps {
  onSubmit: (todo: string) => void
  onCancel: () => void
}

export function TodoForm(props: TodoFormProps) {
  const [todo, setTodo] = React.useState('')

  const onHandleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    props.onSubmit(todo)
  };

  return (
    <dialog id="todo-form-modal">
      <form onSubmit={onHandleSubmit}>
        <h2>Add Todo</h2>
        <div>
          <div className="form-field-container">
            <label htmlFor="todo">Todo</label>
            <input
              type="text"
              id="todo"
              name="todo"
              value={todo.name}
              onChange={(e) => setTodo(e.target.value)}
            />
          </div>
          <div className="form-field-container">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description"></textarea>
          </div>
          <div className="form-field-container">
            <label htmlFor="status">Status</label>
            <select id="status" name="status">
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