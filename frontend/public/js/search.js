let timer;

function search() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    callSearch();
  }, 800);
}

async function callSearch() {
  var search_term = document.getElementById("search").value;
  if (search_term.length === 0) {
    getFileList();
  } else {
    const myHeaders = new Headers({
      Authorization: "Bearer " + localStorage.getItem("authToken"),
    });
    await fetch(`http://localhost:3000/search/${search_term}`, {
      method: "GET",
      headers: myHeaders,
    })
      .then((response) => response.json())
      .then((json) => {
        var list = JSON.parse(JSON.stringify(json));
        var htmlValue = document.getElementById("files-list");
        htmlValue.innerHTML = getMyStorageContent(list);
      })
      .catch((err) => console.log(err));
  }
}
