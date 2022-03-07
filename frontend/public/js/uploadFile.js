function fireUploadFileModal() {
  document.getElementById("choose-file").click();
}

async function uploadFile() {
  var file = document.getElementById("choose-file");
  var token = localStorage.getItem("authToken");

  let link;

  if (localStorage.getItem("folder").length === 0) {
    link = "none";
  } else {
    link = localStorage.getItem("folder");
  }

  var allFile = new FormData();
  let p = [];

  for (let newFile of file.files) {
    allFile.set("uploadFile", newFile);

    const myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });

    p.push(
      fetch(`http://localhost:3000/upload/${link}`, {
        method: "POST",
        headers: myHeaders,
        body: allFile,
      }).then((res) => {
        return res.json();
      })
    );
  }

  Promise.all(p)
    .then((res) => alert("Uploaded " + res.length + " files"))
    .catch((err) => alert("Error uploading"));
}
