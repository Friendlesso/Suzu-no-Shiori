const dayjs = require('dayjs');

const { ipcRenderer } = require('electron');

document.querySelector('.js-close-application').addEventListener('click', () => {
  ipcRenderer.send('close-app');
});

document.querySelector('.js-date').innerHTML = `date - ${dayjs().format('DD.M.YYYY')}`

function Timer() {
  const taskNameInput = document.querySelector('.js-name-input');
  const startingTimeInput = document.querySelector('.js-starting-time');
  const endingTimeInput = document.querySelector('.js-ending-time');
  const startTimerBtn = document.querySelector('.js-start-timer');
  const totalTimerBox = document.querySelector('.js-total-time-box');

  let taskState = 'idle'; // Possible values: 'idle', 'running', 'finished'

  totalTimerBox.classList.add('stop-showing');

  startTimerBtn.addEventListener('click', () => {
    let mySound = document.querySelector('.audio');
    mySound.src = 'sound_effects/buttonSound.mp3'
    mySound.play();
    mySound.volume = 0.1;
    if (taskState === 'idle') {

      startingTimeInput.value = dayjs().format('HH:mm');
      startTimerBtn.innerText = 'End Task!';
      taskState = 'running';
      totalTimerBox.classList.add('stop-showing');

    } else if (taskState === 'running') {

      endingTimeInput.value = dayjs().format('HH:mm');
      const result = calculateTime();
      totalTimerBox.innerHTML = `total time:<br>${result.readable}`;
      totalTimerBox.classList.remove('stop-showing');
      startTimerBtn.innerText = 'Add a task!';
      taskState = 'finished';

      const taskName = taskNameInput.value;
      const totalTime = result;
      saveToLocalStorage(taskName, totalTime);

      
    } else if (taskState === 'finished') {
      taskNameInput.value = '';
      startingTimeInput.value = '';
      endingTimeInput.value = '';
      startTimerBtn.innerText = 'Start task!';
      totalTimerBox.classList.add('stop-showing');
      taskState = 'idle';
      mySound.src = 'sound_effects/ding-126626.mp3';
      mySound.play();
    }
  });
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function calculateTime() {
  let totalMinutes = 0;

  const start = document.querySelector('.js-starting-time').value;
  const end = document.querySelector('.js-ending-time').value;

  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  totalMinutes += (endMinutes - startMinutes);

  const hours = totalMinutes / 60;

  return {
    totalMinutes,
    totalHours: hours,
    roundedHours: Math.floor(hours),
    readable: `${Math.floor(hours)}h ${totalMinutes % 60}min`
  }
}


function saveToLocalStorage(taskName, totalTime) {
  const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');

  const newTask = {
    name: taskName,
    totalTime: totalTime.totalMinutes,
    timestamp: dayjs().format('DD.MM.YYYY'),
  };

  savedTasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(savedTasks));
}

Timer();