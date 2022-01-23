let stack = [{ id: "none", folder_name: "Home" }];

function refresh() {
  getSubFileList(localStorage.getItem("folder"));
}

function back() {
  if (stack.length > 1) {
    stack.pop();
    getSubFileList(stack[stack.length - 1].id);
  }
  localStorage.setItem("folder", stack[stack.length - 1].id);
  breadcrumb();
}

function updateBreadCrumb(id) {
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i].id !== id) {
      stack.pop();
    } else {
      localStorage.setItem("folder", stack[stack.length - 1].id);
      breadcrumb();
      break;
    }
  }
}

function breadcrumb() {
  let res = "";

  for (let { folder_name, id } of stack) {
    if (id === "none") {
      folder_name = "Home";
    }
    res +=
      `<li onclick="getSubFileList(` +
      "'" +
      id +
      "'" +
      `);
      updateBreadCrumb(` +
      "'" +
      id +
      "'" +
      `)" 
      class="breadcrumb-item"><a href="#">${folder_name}</a></li>`;
  }

  let crumb = document.getElementById("crumbs");
  crumb.innerHTML = res;
}
