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
       // tasktdCompleted.innerText = task.completed;
        let tasksTable = document.querySelector("#taskTableData");
        let newRow = document.createElement('tr');
        newRow.id = `task-row-${task.id}`
        tasktdName.id = `task-${task.id}`
        tasksTable.appendChild(newRow);
        newRow.appendChild(tasktdName);
        newRow.appendChild(tasktdCompleted);

        //CREATING CHECKBOXES
        const checkbox = document.createElement('input')
        checkbox.setAttribute('type','checkbox')
        tasktdCompleted.appendChild(checkbox)
        checkbox.checked = task.completed;
        //CHECKBOX EVENT LISTENER TO UPDATE THE TASK 'COMPLETED' VALUE
        checkbox.addEventListener('click', async (e) => {

          await fetch (`/tasks/${task.id}/edit`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({completed: !task.completed})
            })
            .then(res=>res.json()).then(body=>console.log(body))
        })
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
      tasktdName.setAttribute('class', "task_row")
      tasktdName.innerText = task.name;
      let tasktdCompleted = document.createElement('td');
      tasktdCompleted.setAttribute('class', "completed_rows")
     // tasktdCompleted.innerText = task.completed;
      let tasksTable = document.querySelector("#taskTableData");
      let newRow = document.createElement('tr');
      newRow.id = `task-row-${task.id}`
      tasktdName.id = `task-${task.id}`
      tasksTable.appendChild(newRow);
      newRow.appendChild(tasktdName);
      newRow.appendChild(tasktdCompleted);

          //CREATING CHECKBOXES
          const checkbox = document.createElement('input')
          checkbox.setAttribute('type','checkbox')
          tasktdCompleted.appendChild(checkbox)
          checkbox.checked = task.completed;
          //CHECKBOX EVENT LISTENER TO UPDATE THE TASK 'COMPLETED' VALUE
          checkbox.addEventListener('click', async (e) => {

            await fetch (`/tasks/${task.id}/edit`, {
              method: "PUT",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({completed: !task.completed})
              })
              .then(res=>res.json()).then(body=>console.log(body))
          })
  })})
}
//delete tasks callback
const deleteTaskCallBack = async (e) => {
  e.stopPropagation();
  e.preventDefault();
  const deleteButton = e.target;
  const deleteButtonId = deleteButton.getAttribute('id').slice(7);
  const relevantTask = document.getElementById(`task-row-${deleteButtonId}`);
  relevantTask.remove()

   await fetch(`/tasks/${deleteButtonId}/delete`,
  { method: "DELETE"}
  ).then(res=>res.json()).then(data=>console.log(data))
}

//delete lists callback
// const deleteListCallBack = async (e) => {
//   e.stopPropagation();
//   e.preventDefault();
//   const deleteListButton = e.target;
//   const deleteListId = deleteListButton.getAttribute('id').slice(3);
//   const relevantList = document.getElementById(`dlb${deleteListId}`);
//   relevantList.remove();

//     await fetch(`/lists/${deleteListId}/delete`, {
//       method: "DELETE"
//     }).then(res=>res.json()).then(data=>console.log(data))
// }

//Show Clicked Tasks Details
async function showDetails(taskId) {

  const clickedTask = await fetch(`/tasks/${taskId}`)
  .then(res => res.json())
  .then(taskData=>{

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
    const taskDeleteButtonContainer = document.getElementById('taskDeleteButtonContainer')
    const deleteButtonCheck = document.querySelector('.deleteTaskButton')

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

    //Removes a button if it exists from another list being clicked so only 1 delete button gets displayed
    if (deleteButtonCheck) {
    taskDeleteButtonContainer.removeChild(deleteButtonCheck)
    }
    const deleteTaskButton = document.createElement('button');
    deleteTaskButton.setAttribute('type','submit')
    deleteTaskButton.setAttribute('class','deleteTaskButton')
    deleteTaskButton.setAttribute('id',`delete-${taskId}`)
    deleteTaskButton.innerText = 'DELETE TASK'

    taskDeleteButtonContainer.appendChild(deleteTaskButton)



    deleteTaskButton.addEventListener('click', deleteTaskCallBack)

  })
}

// ON WINDOW LOAD ---------------------------------
window.addEventListener("load",  () => {
  //console.log(document.querySelectorAll('.delete-list-button'))
  const listDeleteButton = document.querySelectorAll('.delete-list-button');
  listDeleteButton.forEach(button=> {
    button.addEventListener('click', async (e) => {
      let currentB = e.target;
      let currentId =currentB.getAttribute('id').slice(3);
      // items to be removed
      let deletedListItem = document.querySelector(`.listItem_${currentId}`)
      let deletedDelete = document.getElementById(`dlb${currentId}`)
      let deletedEdit = document.getElementById(`edit_${currentId}`)
      // delete the elements
      deletedListItem.remove()
      deletedDelete.remove()
      deletedEdit.remove()
      // fetch data from db to be removed
      await fetch(`/lists/${currentId}/delete`, {
        method: "DELETE"
      }).then(res=>res.json()).then(data=>console.log(data))
    })

      
  })
 //Populates Task Table with all tasks respective to that list.
  const lists = document.querySelector(".lists");
  const allTasks = document.getElementById('allTasks');

  const taskDetailPane = document.querySelector('.taskTable')

//CALLBACKS FOR EVENT LISTENER
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
    showDetails(clickedTaskId)

  }



  getAllTasksForLoggedInUser() //running on page load

  //Event Listeners
  lists.addEventListener("click", callBack)
  allTasks.addEventListener('click', getAllTasksForLoggedInUser)
  taskDetailPane.addEventListener('click', taskDetailCallBack) //add event listener for clicking task and displaying its details


});
