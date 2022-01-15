async function folderCheck(foldername, link) {
  let found;

  let obj = {
    foldername,
    link,
  };

  const myHeaders = new Headers({
    "Content-type": "application/json; charset=UTF-8",
    Authorization: "Bearer " + localStorage.getItem("authToken"),
  });

  await fetch(`http://localhost:3000/check`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(obj),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      found = data.msg;
    })
    .catch((err) => console.log(err));

  return found;
}

async function createFolder() {
  var popup = document.getElementById("create-popup");
  popup.click();
  var formPopup = document.getElementById("folder-form-popup");
  formPopup.addEventListener(
    "submit",
    () => {
      callCreateFolder();
    },
    { once: true }
  );

  async function callCreateFolder() {
    var foldername = document.getElementById("foldername").value;
    let link = localStorage.getItem("folder");
    let exist = await folderCheck(foldername, link);

    if (!exist) {
      let link;

      if (localStorage.getItem("folder").length === 0) {
        link = "none";
      } else {
        link = localStorage.getItem("folder");
      }

      const obj = {
        link,
        foldername,
      };

      const myHeaders = new Headers({
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      });

      fetch(`http://localhost:3000/addfolder`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(obj),
      });

      alert("Folder added");
    } else {
      alert("Foldername already exist");
    }
    document.getElementById("newFolderModalClose").click();
  }
}
