import createModal from './modal';

function sponsorModal() {
  const sponsorQueue = document.createElement('div');
  const queueHeader = document.createElement('h2');
  const hackers = document.createElement('table');

  queueHeader.innerHTML = "Sponsor A's hacker queue"

  // use conn to get the current queue
  const currentQueue = [
    { "name": "Jack Zhang", "id": "h48h398r" },
    { "name": "Justin Cook", "id": "jbn3urh83" },
    { "name": "Hannah Yu", "id": "bruh329rj3" },
    { "name": "Jamie Liu", "id": "3mk1415njfa" },
    { "name": "Nadia Fu", "id": "jf238ffg" },
    { "name": "Angela Waid", "id": "0oa9r34hj" },
  ]

  for (let i = 0; i < currentQueue.length; i += 1) {
    const row = document.createElement('tr');
    const hacker = document.createElement('th');
    hacker.innerHTML = currentQueue[i].name;
    const removeButton = document.createElement('button');
    removeButton.innerHTML = "Remove";

    // add onclick for removeButton that sends message

    row.appendChild(hacker);
    row.appendChild(removeButton);
    hackers.appendChild(row);
  }

  sponsorQueue.appendChild(queueHeader);
  sponsorQueue.appendChild(hackers);
  createModal(sponsorQueue);
};

export default sponsorModal;
