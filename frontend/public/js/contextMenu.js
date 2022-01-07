document.onclick = hideMenu;

document.oncontextmenu = () => {
  if (
    document.getElementById("contextMenu").style.display !== "block" &&
    isCopy !== undefined
  ) {
    getContextMenuCopyMove();
  }
  return false;
};

function hideMenu() {
  if (document.getElementById("contextMenu")) {
    document.getElementById("contextMenu").style.display = "none";
  }
  if (document.getElementById("contextMenuCopyMove")) {
    document.getElementById("contextMenuCopyMove").style.display = "none";
  }
  document.getElementById("c").style.display = "block";
  document.getElementById("m").style.display = "block";
}

function getContextMenu(createTime, updateTime, filename, id, parent, link) {
  var e = window.event;

  if (document.getElementById("contextMenu").style.display == "block") {
    hideMenu();
  } else {
    var menu = document.getElementById("contextMenu");
    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";
    menu.style.display = "block";

    if (parent === "false") {
      var downFile = document.getElementById("a1");
      downFile.onclick = () => {
        download(filename, id);
      };
      var shaFile = document.getElementById("a6");
      shaFile.onclick = () => {
        shareFile(id);
      };
      document.getElementById("down").style.display = "block";
      document.getElementById("shar").style.display = "block";
    } else {
      document.getElementById("down").style.display = "none";
      document.getElementById("shar").style.display = "none";
    }

    var rename = document.getElementById("a2");
    rename.onclick = () => {
      renameFile(id, link);
    };
    var details = document.getElementById("a3");
    details.onclick = () => {
      detailPopup(createTime, updateTime, filename);
    };
    var moveToTrash = document.getElementById("a4");
    moveToTrash.onclick = () => {
      mark_unmark_trash(id);
    };
    var delFile = document.getElementById("a5");
    delFile.onclick = () => {
      deleteFile(id);
    };
    var moveFile = document.getElementById("a7");
    moveFile.onclick = () => {
      localStorage.setItem("itemid", id);
      isCopy = false;
    };
    var copyFile = document.getElementById("a8");
    copyFile.onclick = () => {
      localStorage.setItem("itemid", id);
      isCopy = true;
    };
  }
}

function getContextMenuCopyMove() {
  var e = window.event;

  if (document.getElementById("contextMenuCopyMove")) {
    var m = document.getElementById("contextMenuCopyMove");
    m.style.left = e.pageX + "px";
    m.style.top = e.pageY + "px";
    m.style.display = "block";

    if (isCopy) {
      document.getElementById("m").style.display = "none";
      var co = document.getElementById("c");
      co.onclick = () => {
        copy();
      };
    } else {
      document.getElementById("c").style.display = "none";
      var mo = document.getElementById("m");
      mo.onclick = () => {
        move();
      };
    }
  }
}
