window.addEventListener("load", async () => {
  const lists = document.querySelector(".lists");
  lists.addEventListener("click", (e) => {
    e.stopPropagation();
    const clickedList = e.target.getAttribute("class").slice(9);
    console.log(clickedList);
    async function getAllTasksForList(id) {
        const pickles = await fetch(`/tasks/list/${clickedList}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
       console.log(pickles);
    }
    getAllTasksForList(clickedList);
  });

  console.log("This is working!!!!");

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
