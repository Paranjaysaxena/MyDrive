function createFolder() {
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

  function callCreateFolder() {
    var foldername = document.getElementById("foldername").value;

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
  }
}
