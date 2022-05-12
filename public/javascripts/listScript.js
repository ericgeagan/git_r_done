//FUNCTION WE CREATED----------------------------

  //Fetches all tasks from the list given an id---
  async function getAllTasksForList(id) {
      const pickles = await fetch(`/tasks/list/${id}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
        },
    })
    //Parses
    .then(response => response.json())
    //Creates table elements and assigns task data
    .then(data => {
        const taskdata = data.tasks;

        taskdata.forEach(task => {

        let tasktdName = document.createElement('td');
        tasktdName.setAttribute('class', "task_row")
        tasktdName.innerText = task.name;
        let tasktdCompleted = document.createElement('td');
        tasktdCompleted.setAttribute('class', "completed_rows")
        tasktdCompleted.innerText = task.completed;
        let tasksTable = document.querySelector("#taskTableData");
        let newRow = document.createElement('tr');
        newRow.id = `task-${task.id}`
        tasksTable.appendChild(newRow);
        newRow.appendChild(tasktdName);
        newRow.appendChild(tasktdCompleted);
    })})
  }

  //Removes all child nodes before populating table---
  function removeChildren () {
    const delTable = document.querySelector('#taskTableData');
    while (delTable.children.length > 0) {
      delTable.removeChild(delTable.firstElementChild);
    }
  }

  //GET All Tasks

  async function getAllTasksForLoggedInUser() {
    const allTasks = await fetch(`/tasks/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
      },
  })
  //Parses
  .then(response => response.json())
  //Creates table elements and assigns task data
  .then(data => {
      removeChildren();
      const taskdata = data.tasks;
      console.log(taskdata,'taskdata---------------');
      taskdata.forEach(task => {

      let tasktdName = document.createElement('td');
      tasktdName.setAttribute('class', "task_row")
      tasktdName.innerText = task.name;
      let tasktdCompleted = document.createElement('td');
      tasktdCompleted.setAttribute('class', "completed_rows")
      tasktdCompleted.innerText = task.completed;
      let tasksTable = document.querySelector("#taskTableData");
      let newRow = document.createElement('tr');
      newRow.id = `task-${task.id}`
      tasksTable.appendChild(newRow);
      newRow.appendChild(tasktdName);
      newRow.appendChild(tasktdCompleted);
  })})
}

// ON WINDOW LOAD ---------------------------------
window.addEventListener("load",  () => {


 //Populates Task Table with all tasks respective to that list.
  const lists = document.querySelector(".lists");
  const allTasks = document.getElementById('allTasks');


  //Click List to Display Lists/tasks CallBack
  const callBack = (e) => {
    e.stopPropagation();
    const clickedListId = e.target.getAttribute("class").slice(9);
    const clickedList = e.target;

    removeChildren();
    getAllTasksForList(clickedListId)

  };

  getAllTasksForLoggedInUser()

  lists.addEventListener("click", callBack)
  allTasks.addEventListener('click', getAllTasksForLoggedInUser)


});
