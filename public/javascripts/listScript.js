window.addEventListener("load", async () => {
  const lists = document.querySelector(".lists");
  const callBack = (e) => {
    e.stopPropagation();
    const clickedListId = e.target.getAttribute("class").slice(9);
    const clickedList = e.target;
    console.log(clickedListId);
    async function getAllTasksForList(id) {
        const pickles = await fetch(`/tasks/list/${clickedListId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
          },
      })
      .then(response => response.json())
      .then(data => {
          const taskdata = data.tasks;
          console.log(data);
          console.log(data.tasks);

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
    lists.removeEventListener('click', callBack)
    // console.log(data.tasks);
};
lists.addEventListener("click", callBack)

//   console.log("This is working!!!!");

  //  try {
  //     const response = await fetch(`/list/${list.id}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
});
