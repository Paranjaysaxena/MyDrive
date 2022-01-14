async function renameFile(file_id, link) {
  var renamePopup = document.getElementById("rename-popup");
  renamePopup.click();
  var formPopup = document.getElementById("rename-form-popup");
  formPopup.addEventListener("submit", async () => {
    var newName = document.getElementById("rename").value;

    const obj = {
      newName: newName,
    };

    const myHeaders = new Headers({
      "Content-type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + localStorage.getItem("authToken"),
    });

    await fetch("http://localhost:3000/rename/" + file_id, {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify(obj),
    });

    document.getElementById("renameModalClose").click();
  });
}
