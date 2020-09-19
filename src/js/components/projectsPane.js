
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
    if (data.projects) {
      data.projects.forEach(project => {
        document.getElementById("projects-list").appendChild(<div class="project-submission">
          <a href={project.zoom || ''}>{project.name}</a>
        </div>
        )
      });
    }
  }

  clear = () => {
    document.getElementById("projects-list").innerHTML = '';
  }

  handleJoinPacket = (data) => {
    if (data.project) {
      document.getElementById("projects-list").appendChild(<div class="project-submission">
        <a href={data.project.zoom}>{data.project.name}</a>
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
