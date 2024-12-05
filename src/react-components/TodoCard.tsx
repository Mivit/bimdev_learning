import * as React from 'react';
import { ITodo, Project } from '../classes/Project';

interface TodoCardProps {
  todo: ITodo
}


// change status on todo

// edit todo

// delete todo

export function TodoCard(props: TodoCardProps) {
  // console.log('TodoCard', props.todo)

  const { todo } = props
  
  return (
    <div className='todo-item'>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: 5,
            padding: 10,
            backgroundColor: "#969696"
          }}>
          <span className="material-icons-round">construction</span>
          <span className="material-icons-round">check</span>
        </div>
        <div style={{ padding: "0 10px" }}>
          <h5 id="todo_title">
            {todo.name}
          </h5>
          <p id="todo_description">
            {todo.description}
          </p>
          <p id="todo_status" style={{ padding: "10px 0 0 0" }}>
            {todo.status}
          </p>
        </div>
        <p className="todo-date">{todo.date.toLocaleDateString()}</p>
      </div>
    </div>

  )
}