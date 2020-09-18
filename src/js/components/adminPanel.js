import socket from '../socket';

import '../../styles/adminPanel.scss';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class AdminPanel {
  constructor() {
    this.sponsorArray = [
      ['ArrowStreet', 'arrowstreet'],
      ['Citadel', 'citadel'],
      ['CMT', 'cmt'],
      ['DRW', 'drw'],
      ['Facebook', 'facebook'],
      ['Goldman Sachs', 'goldman'],
      ['IBM', 'ibm'],
      ['Intersystems', 'intersystems'],
      ['MISTI', 'misti'],
      ['Linode', 'linode'],
      ['Nasdaq', 'nasdaq'],
      ['OCA Ventures', 'oca'],
      ['Pegasystems', 'pega'],
      ['QuantCo', 'quantco'],
      ['Yext', 'yext'],
    ];

    this.sponsorMap = new Map(this.sponsorArray);
  }

  handleLogOff = () => {
    localStorage.setItem('token', null);
    window.location.reload();
  };


  createAdminDropdown = () => {
    const select = document.createElement('select');
    select.setAttribute('id', 'admin-sponsor-ids');

    const defaultSelection = document.createElement('option');
    defaultSelection.disabled = true;
    defaultSelection.text = 'Sponsor Name';
    defaultSelection.selected = true;
    select.add(defaultSelection);

    const addAsMentor = document.createElement('option');
    addAsMentor.text = 'Add as mentor';
    addAsMentor.value = 'mentor';
    select.add(addAsMentor);

    const addAsOrganizer = document.createElement('option');
    addAsOrganizer.text = 'Add as organizer';
    addAsOrganizer.value = 'organizer';
    select.add(addAsOrganizer);

    this.sponsorMap.forEach((sponsorId, sponsorName) => {
      const el = document.createElement('option');
      el.textContent = sponsorName;
      el.value = sponsorId;
      select.appendChild(el);
    });

    return select;
  };

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
            const select = document.getElementById('admin-sponsor-ids').value;
            if (select === 'organizer') {
              socket.send({
                type: 'add_email',
                email: document.getElementById('admin-sponsor-email').value,
                role: 1,
              });
            } else if (select === 'mentor') {
              socket.send({
                type: 'add_email',
                email: document.getElementById('admin-sponsor-email').value,
                role: 3,
              });
            } else {
              socket.send({
                type: 'add_email',
                email: document.getElementById('admin-sponsor-email').value,
                role: 2,
                sponsorId: select,
              });
            }
          }}
        >
          Submit
        </button>
        <button id="admin-logout" onclick={this.handleLogOff}>
          LOG OFF
        </button>
      </div>
    );
  };

  onClose = this.unsubscribe;
}

const adminPanelInstance = new AdminPanel();
export default adminPanelInstance;
