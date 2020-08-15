import moment from 'moment';

import createModal from './modal';

window.onCoffeeChat = () => {
  const timeSelectorElem = document.createElement('div');
  timeSelectorElem.classList.add('time-selector');

  for (let i = 0; i < 2; i += 1) {
    const dayElem = document.createElement('div');
    dayElem.classList.add('day');

    const startTime = moment({
      year: 2020,
      month: 8,
      day: 19 + i,
      hour: 9,
      minute: 0,
    });

    const dateLabelElem = document.createElement('div');
    dateLabelElem.classList.add('datelabel');
    dateLabelElem.innerHTML = startTime.format('dddd');
    dayElem.appendChild(dateLabelElem);

    for (let j = 0; j < 10; j += 1) {
      const buttonElem = document.createElement('button');
      buttonElem.classList.add('timeslot');

      buttonElem.innerHTML = startTime.format('LT');
      startTime.add(15, 'minutes');

      dayElem.appendChild(buttonElem);
    }

    timeSelectorElem.appendChild(dayElem);
  }

  createModal('Sign up for a time to chat with Sponsor A', timeSelectorElem, [
    {
      title: 'Submit',
      type: 'submit',
      action: () => {
        console.log('scheduled coffee chat!');
      },
    },
  ]);
};
