window.addEventListener("load", async () => {


 //Populates Task Table with all tasks respective to that list.
  const lists = document.querySelector(".lists");
    //Gets the clicked task's Id
  const callBack = (e) => {
    e.stopPropagation();
    const clickedListId = e.target.getAttribute("class").slice(9);
    const clickedList = e.target;

    //Removes all child nodes before populating table
    function removeChildren () {
      const delTable = document.querySelector('#taskTableData');
      while (delTable.children.length > 0) {
        delTable.removeChild(delTable.firstElementChild);
      }
    }
    removeChildren();

    //Fetches all tasks from the list given an id
    async function getAllTasksForList(id) {
        const pickles = await fetch(`/tasks/list/${clickedListId}`, {
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
          newRow.id = `task-${task.id}`
          tasksTable.appendChild(newRow);
          newRow.appendChild(tasktdName);
          newRow.appendChild(tasktdCompleted);
      })})
    }
    getAllTasksForList(clickedListId)
};

//
lists.addEventListener("click", callBack)
});
