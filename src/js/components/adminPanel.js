import socket from '../socket';

import '../../styles/adminPanel.scss';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class AdminPanel {
  constructor() {
    this.sponsorArray = [["ArrowStreet", "arrowstreet"], ["Citadel", "citadel"], ["CMT", "cmt"], ["DRW", "drw"], ["Facebook", "facebook"], ["Goldman Sachs", "goldman"], ["IBM", "ibm"], ["Intersystems", "intersystems"], ["Linode", "linode"], ["Nasdaq", "nasdaq"], ["OCA Ventures", "oca"], ["Pegasystems", "pega"], ["QuantCo", "quantco"], ["Yext", "yext"]]
    this.sponsorMap = new Map(this.sponsorArray)
    console.log("admin", this.sponsorMap)
    
  }

  createAdminDropdown = () => {
    const select = document.createElement("select")
    select.setAttribute("id", "admin-sponsor-ids")

    const defaultSelection = document.createElement("option")
    defaultSelection.disabled = true
    defaultSelection.text = "Sponsor Name"
    defaultSelection.selected = true
    
    select.add(defaultSelection)
    // eslint-disable-next-line
    for(const [sponsorName, sponsorId] of this.sponsorMap) {
      const el = document.createElement("option");
      el.textContent = sponsorName;
      el.value = sponsorId;
      select.appendChild(el);
    }
    return select;
  }

  createAdminModal = () => {
    return (
      <div id="admin-panel">
        <h1>Admin Panel</h1>
        <div id="admin-inputs">
          <input id="admin-sponsor-email" placeholder="Sponsor Email" />
          {this.createAdminDropdown()}
        </div>
        <button
          id="admin-panel-submit green"
          onclick={() => {
            socket.send({
              type: 'add_email',
              email: document.getElementById(
                'admin-sponsor-email'
              ).value,
              role: 2,
              sponsorId: document.getElementById('admin-sponsor-ids').value
            });
          }}
        >
          Submit
        </button>
      </div>
    );
  };

  onClose = this.unsubscribe;
}

const adminPanelInstance = new AdminPanel();
export default adminPanelInstance;
