function getSubFile(parent, id, folder_name) {
  if (parent === "true" && id !== "none") {
    getSubFileList(id);
    localStorage.setItem("folder", id);
    stack.push({ id, folder_name });
    breadcrumb();
  }
}

function getMyStorageContent(file_list) {
  filter = document.getElementById("search");
  var trashLabel = document.getElementById("a4");
  trashLabel.innerHTML = "Move to Trash";

  let len = file_list.length;
  let content = ``;

  for (let i = 0; i < len; i++) {
    let file_details = file_list[i];
    let fav_status = "mark-as-favourite";
    let fav_class = "far";

    if (file_details.isFav === true) {
      fav_status = "unmark-as-favourite";
      fav_class = "fas";
    }

    filter = document.getElementById("search").value;

    if (
      file_details.file_name.toUpperCase().indexOf(filter.toUpperCase()) > -1
    ) {
      const pdficon =
        '<img src="https://img.icons8.com/ios-filled/40/000000/pdf--v1.png"/>';
      const pngicon =
        '<img src="https://img.icons8.com/ios-filled/40/000000/png.png"/>';
      const jpgicon =
        '<img src="https://img.icons8.com/ios-filled/40/000000/jpg.png"/>';
      const txticon =
        '<img src="https://img.icons8.com/ios-glyphs/40/000000/txt.png"/>';
      const docxicon =
        '<img src="https://img.icons8.com/fluency/40/000000/microsoft-word-2019.png"/>';
      const pptxicon =
        '<img src="https://img.icons8.com/color/40/000000/microsoft-powerpoint-2019--v1.png"/>';
      const xlsxicon =
        '<img src="https://img.icons8.com/color/40/000000/microsoft-excel-2019--v1.png"/>';

      function fileIcon() {
        if (file_details.file_name.search(".pdf") > 0) {
          return pdficon;
        }
        if (file_details.file_name.search(".png") > 0) {
          return pngicon;
        }
        if (file_details.file_name.search(".jpg") > 0) {
          return jpgicon;
        }
        if (file_details.file_name.search(".txt") > 0) {
          return txticon;
        }
        if (file_details.file_name.search(".docx") > 0) {
          return docxicon;
        }
        if (file_details.file_name.search(".pptx") > 0) {
          return pptxicon;
        }
        if (file_details.file_name.search(".xlsx") > 0) {
          return xlsxicon;
        }

        return '<img src="https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/40/000000/external-file-multimedia-kiranshastry-lineal-kiranshastry-2.png" />';
      }

      const icon = file_details.parent
        ? '<img src="https://img.icons8.com/color/40/000000/folder-invoices--v1.png"/>'
        : fileIcon();

      content +=
        `<tr 
        style="cursor:pointer"

        oncontextmenu="getContextMenu(` +
        "'" +
        file_details.createdAt +
        "'" +
        "," +
        "'" +
        file_details.updatedAt +
        "'" +
        "," +
        "'" +
        file_details.file_name +
        "'" +
        "," +
        "'" +
        file_details._id +
        "'" +
        "," +
        "'" +
        file_details.parent +
        "'" +
        "," +
        "'" +
        file_details.link +
        "'" +
        `)">


        <td  
        ondblclick="getSubFile(` +
        "'" +
        file_details.parent +
        "'" +
        "," +
        "'" +
        file_details._id +
        "'" +
        "," +
        "'" +
        file_details.file_name +
        "'" +
        `)" >
        
        ${icon} ${file_details.file_name}</td>
            <td><i title = ${fav_status} id = ${file_details._id} class="${fav_class} fa-heart" onclick = "mark_unmark_fav(` +
        "'" +
        file_details._id +
        "'" +
        `)"></i></td>
          </tr>`;
    }
  }

  return content;
}
