import * as React from 'react';
import { Project } from '../classes/Project';

interface ProjectCardProps {
  project: Project
}

export function ProjectCard(props: ProjectCardProps) {
  return (
    <div className='project-card'>
      <div className="card-header">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <p id="round" className="round-abbr">
            PN
          </p>
          <div style={{ alignContent: "bottom", padding: "0 0 0 10px" }}>
            <h5>{props.project.name}</h5>
            <p>{props.project.description}</p>
          </div>
        </div>
      </div>
      <div className="card-content">
        <div className="card-property">
          <p style={{ color: "#969696" }}>Status</p>
          <p>
            {props.project.projectStatus}
          </p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Role</p>
          <p>
            {props.project.userRole}
          </p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Cost</p>
          <p>
            {props.project.cost}
          </p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Estimated Progress</p>
          <p>
            {props.project.progress * 100}%
          </p>
        </div>
      </div>
    </div>

  )
}