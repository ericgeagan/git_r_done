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
        tasktdName.innerText = task.name;
        let tasktdCompleted = document.createElement('td');
        tasktdCompleted.innerText = task.completed;
        let tasksTable = document.querySelector("#taskTableData");
        let newRow = document.createElement('tr');
        newRow.id = `task-row-${task.id}`
        tasktdName.id = `task-${task.id}`
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
      taskdata.forEach(task => {

      let tasktdName = document.createElement('td');
      tasktdName.innerText = task.name;
      let tasktdCompleted = document.createElement('td');
      tasktdCompleted.innerText = task.completed;
      let tasksTable = document.querySelector("#taskTableData");
      let newRow = document.createElement('tr');
      newRow.id = `task-row-${task.id}`
      tasktdName.id = `task-${task.id}`
      tasksTable.appendChild(newRow);
      newRow.appendChild(tasktdName);
      newRow.appendChild(tasktdCompleted);
  })})
}

  //Show Clicked Tasks Details
//   async function showDetails(taskId) {
//     const taskDetails = await fetch(`/tasks/${taskId}`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//       },
//   })
//   //Parses
//   .then(response => response.json())
//   //Creates table elements and assigns task data
//   .then(data => {
     
      
// //finding the HTML containers for the details info
//       const taskName = document.getElementById('')
//       const priority = document.getElementById('')
//       const dueDate = document.getElementById('')
//       const startDate = document.getElementById('startDate')
//       const completed = document.getElementById('completed')
//       const estimatedTime = document.getElementById('estimatedTime')
//       const note = document.getElementById('note')
//       const listId = document.getElementById('listId')
//       const createdAt = document.getElementById('createdAt')
//       const updatedAt = document.getElementById('updatedAt')


//     //  taskName.innerText = data.name

//       console.log(data.name,'DATA NAME---------------');
//       taskdata.forEach(task => {

//       let tasktdName = document.createElement('td');
//       tasktdName.innerText = task.name;
//       let tasktdCompleted = document.createElement('td');
//       tasktdCompleted.innerText = task.completed;
//       let tasksTable = document.querySelector("#taskTableData");
//       let newRow = document.createElement('tr');
//       newRow.id = `task-${task.id}`
//       tasksTable.appendChild(newRow);
//       newRow.appendChild(tasktdName);
//       newRow.appendChild(tasktdCompleted);
//   }
//   )})
// }

async function showDetails(taskId) {

  const clickedTask = await fetch(`/tasks/${taskId}`)
  .then(res => res.json())
  .then(taskData=>{
    console.log(taskData.name)

      //finding the HTML containers for the details info
      const taskName = document.getElementById('taskName')
      const priority = document.getElementById('priority')
      const dueDate = document.getElementById('dueDate')
      const startDate = document.getElementById('startDate')
      const completed = document.getElementById('completed')
      const estimatedTime = document.getElementById('estimatedTime')
      const note = document.getElementById('note')
      const listId = document.getElementById('listId')
      const createdAt = document.getElementById('createdAt')
      const updatedAt = document.getElementById('updatedAt')



    taskName.innerText = taskData.name
    priority.innerText = taskData.priority
    dueDate.innerText = taskData.dueDate
    startDate.innerText = taskData.startDate
    completed.innerText = taskData.completed
    estimatedTime.innerText = taskData.estimatedTime
    note.innerText = taskData.note
    listId.innerText = taskData.listId
    createdAt.innerText = taskData.createdAt
    updatedAt.innerText = taskData.updatedAt


  })
}

// ON WINDOW LOAD ---------------------------------
window.addEventListener("load",  () => {


 //Populates Task Table with all tasks respective to that list.
  const lists = document.querySelector(".lists");
  const allTasks = document.getElementById('allTasks');
  const taskDetailPane = document.querySelector('.taskTable')

  //Click List to Display Lists/tasks CallBack
  const callBack = (e) => {
    e.stopPropagation();
    const clickedListId = e.target.getAttribute("class").slice(9);
    const clickedList = e.target;

    removeChildren();
    getAllTasksForList(clickedListId)

  };

  const taskDetailCallBack = (e)=> {
    e.stopPropagation();
    const clickedTask = e.target;
    const clickedTaskId = e.target.getAttribute('id').slice(5)
    //console.log(clickedTaskId)
    showDetails(clickedTaskId)

  }

  getAllTasksForLoggedInUser() //running on page load

  //Event Listeners
  lists.addEventListener("click", callBack)
  allTasks.addEventListener('click', getAllTasksForLoggedInUser)
//add event listener for clicking task and displaying its details
  taskDetailPane.addEventListener('click', taskDetailCallBack )

});
