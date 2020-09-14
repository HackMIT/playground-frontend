import socket from '../socket';

import '../../styles/report.scss';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class ReportPane {
  createReportPane = () => {
    return (
      <div id="report-pane">
        <div id="report-div">
          <textarea rows="4" cols="30" id="report-input" placeholder="Reason?"></textarea>
          <button
            type="submit"
            id="submit-report-button"
            onclick={(event) => {
              event.preventDefault();
              socket.send({
                type: 'report',
                characterId: document.getElementById('reported-id').value,
                text: document.getElementById('report-input').value
              });
              document.getElementById("report-div").innerHTML = "<p>Your report has been received, thank you.</p>";
            }}
          >Submit</button>
        </div>
        <div id="report-pane-arrow" />
        <div id="reported-id" />
      </div>
    );
  };
}

const reportPaneInstance = new ReportPane();
export default reportPaneInstance;
