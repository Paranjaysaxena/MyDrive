function fireUploadFolderModal() {
  document.getElementById("choose-folder").click();
}

async function uploadFolder(event) {
  var f = document.getElementById("choose-folder");
  var files = f.files;

  // Get folder name

  var res = files[0].webkitRelativePath;
  var foldername = "";
  for (let l of res) {
    if (l !== "/") {
      foldername += l;
    } else {
      break;
    }
  }

  // for (let i = 0; i < files.length; i++) {
  //   console.log(files[i].webkitRelativePath);
  // }

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
  let p = [];
  var allFile = new FormData();

  for (let file of f.files) {
    var token = localStorage.getItem("authToken");
    allFile.set("uploadFile", file);

    const myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });

    p.push(
      fetch(`http://localhost:3000/upload/${newLink}`, {
        method: "POST",
        headers: myHeaders,
        body: allFile,
      }).then((response) => response.json())
    );
  }

  Promise.all(p)
    .then((res) => alert("Uploaded " + res.length + " files"))
    .catch((err) => alert("Failed"));
}
