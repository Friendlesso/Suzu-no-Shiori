
window.addEventListener('DOMContentLoaded', () => {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const container = document.querySelector('.js-display-task-container');

  const { ipcRenderer } = require('electron');

  document.querySelector('.js-close-application').addEventListener('click', () => {
    ipcRenderer.send('close-app');
  });

  function minutesToReadable(totalMinutes){
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return  `${hours}h ${minutes}min`;
  }

  function renderTaks() {
    const mergedTasks = {};

    tasks.forEach(task => {
      const time = parseInt(task.totalTime);
      if (mergedTasks[task.name]){
        mergedTasks[task.name].totalTime += time;
      } else {
        mergedTasks[task.name] = {
          name: task.name,
          totalTime: time
        };
      }
    });
    const uniqueTasks = Object.values(mergedTasks);

    container.innerHTML = uniqueTasks.map((task , index) => `
      <div class="task">
        <div class="task-name-date">
          <p class="task-name">${index + 1}.${task.name} </p>
          <p class="task-date"> ,Total time:${minutesToReadable(task.totalTime)}</p>
          <div class="delete-task js-delete-task"><img src="images/icons/pixelarticons_delete.png"></div>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.js-delete-task').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        const nameToDelete = uniqueTasks[idx].name;

        const filtered = tasks.filter(t => t.name !== nameToDelete);
        localStorage.setItem('tasks', JSON.stringify(filtered));

        tasks.length= 0;
        tasks.push(...filtered);
        renderTaks();

        const deleteBtnSound = document.querySelector('.js-delete-task-sound');
        deleteBtnSound.volume = 0.1;
        if (deleteBtnSound) deleteBtnSound.play();
      })
    })
  }
  renderTaks()
});
