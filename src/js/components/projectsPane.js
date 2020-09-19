
import socket from '../socket';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class ProjectsPane {
  constructor() {
    socket.subscribe('init', this.handleInitPacket);
    socket.subscribe('join', this.handleJoinPacket);
  }

  handleInitPacket = (data) => {
    document.getElementById("projects-list").innerHTML = '';
    if (data.character.project) {
      document.getElementById("project-pane-zoom").innerHTML = `<p>Make sure to stay on <a target="_blank" href=${data.character.project.zom}>your Zoom link</a> as you check out other projects! Click on the links below to meet other hackers.</p>`;
    }
    if (data.projects) {
      data.projects.forEach(project => {
        document.getElementById("projects-list").appendChild(<div className="project-submission">
          <a target="_blank" href={project.zoom || ''}>{project.name}</a>
          <p>{project.pitch}</p>
        </div>
        )
      });
    }
  }

  handleJoinPacket = (data) => {
    if (data.project) {
      document.getElementById("projects-list").appendChild(<div className="project-submission">
        <a target="_blank" href={data.project.zoom}>{data.project.name}</a>
        <p>{data.project.pitch}</p>
      </div>)
    }
  }

  show = () => {
    document.getElementById("arena-projects-pane").style.display = "block";
  }

  hide = () => {
    document.getElementById("arena-projects-pane").style.display = "none";
  }
}

const projectPaneInstance = new ProjectsPane();
export default projectPaneInstance;
