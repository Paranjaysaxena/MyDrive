async function uploadFile() {
  var file = document.getElementById("choose-file");
  var token = localStorage.getItem("authToken");

  var allFile = new FormData();
  allFile.append("uploadFile", file.files[0]);

  let link;

  if (localStorage.getItem("folder").length === 0) {
    link = "none";
  } else {
    link = localStorage.getItem("folder");
  }

  const myHeaders = new Headers({
    Authorization: "Bearer " + token,
  });

  await fetch(`http://localhost:3000/upload/${link}`, {
    method: "POST",
    headers: myHeaders,
    body: allFile,
  }).then((res) => {
    console.log(res);
    window.location.href = "/drive?";
  });
}
