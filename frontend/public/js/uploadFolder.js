function fireUploadFolderModal() {
  document.getElementById("choose-folder").click();
}

async function uploadFolder() {
  var f = document.getElementById("choose-folder");

  // Get folder name

  var res = f.files[0].webkitRelativePath;
  var foldername = "";
  for (let l of res) {
    if (l !== "/") {
      foldername += l;
    } else {
      break;
    }
  }

  // Upload parent folder

  let link;
  let newLink;

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

  await fetch(`http://localhost:3000/addfolder`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(obj),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      newLink = data;
    });

  // Upload all subfiles of the parent folder

  for (let file of f.files) {
    var token = localStorage.getItem("authToken");

    var allFile = new FormData();
    allFile.append("uploadFile", file);

    const myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });

    await fetch(`http://localhost:3000/upload/${newLink}`, {
      method: "POST",
      headers: myHeaders,
      body: allFile,
    });
  }
}
