import * as React from 'react';
import { Project } from '../classes/Project';

interface TodoCardProps {
  project: Project
}

// change status on todo

// edit todo

// delete todo

export function TodoCard(props: TodoCardProps) {
  return (
    <div className='todo-card'>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: 5,
            padding: 10,
            backgroundColor: "#969696"
          }}
        >
          <span className="material-icons-round">construction</span>
        </div>
        <div style={{ padding: "0 10px" }}>
          <h5 id="todo_title">
            ${"{"}todo.title{"}"}
          </h5>
          <p id="todo_description">
            ${"{"}todo.description{"}"}
          </p>
          <p id="todo_status" style={{ padding: "10px 0 0 0" }}>
            ${"{"}todo.status{"}"}
          </p>
        </div>
      </div>
      <p className="todo-date">Fri, 20 sep</p>
    </div>

  )
}