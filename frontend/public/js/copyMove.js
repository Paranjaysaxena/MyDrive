let isCopy = undefined;

// Move files/folder
async function move() {
  if (localStorage.getItem("itemid")) {
    const obj = {
      id: localStorage.getItem("itemid"),
      link: localStorage.getItem("folder"),
    };

    const myHeaders = new Headers({
      "Content-type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + localStorage.getItem("authToken"),
    });

    await fetch(`http://localhost:3000/move`, {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify(obj),
    });

    clear();
    alert("Moved");
  }
}

// Copy files/folder
async function copy() {
  if (localStorage.getItem("itemid")) {
    const obj = {
      id: localStorage.getItem("itemid"),
      link: localStorage.getItem("folder"),
    };

    const myHeaders = new Headers({
      "Content-type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + localStorage.getItem("authToken"),
    });

    await fetch(`http://localhost:3000/copy`, {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify(obj),
    });

    clear();
    alert("Copied");
  }
}

function clear() {
  localStorage.removeItem("itemid");
}
