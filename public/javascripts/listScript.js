window.addEventListener("load", async () => {


 //Populates Task Table with all tasks respective to that list.
  const lists = document.querySelector(".lists");
    //Gets the clicked task's Id
  const callBack = (e) => {
    e.stopPropagation();
    const clickedListId = e.target.getAttribute("class").slice(9);
    const clickedList = e.target;
    // console.log(clickedListId);

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
        //   console.log(data);
        //   console.log(data.tasks);

          taskdata.forEach(task => {

          let tasktdName = document.createElement('td');
          tasktdName.innerText = task.name;
          let tasktdCompleted = document.createElement('td');
          tasktdCompleted.innerText = task.completed;
          let tasksTable = document.querySelector("#taskTableData");
          let newRow = document.createElement('tr');
          tasksTable.appendChild(newRow);
          newRow.appendChild(tasktdName);
          newRow.appendChild(tasktdCompleted);


      })})
    }
    getAllTasksForList(clickedListId)

    //Removes event listeners from tasks that have been clicked
    lists.removeEventListener('click', callBack)
    // console.log(data.tasks);

};

//
lists.addEventListener("click", callBack)
});
