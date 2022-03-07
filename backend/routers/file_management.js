const express = require("express");
const router = new express.Router();
const AWS = require("aws-sdk");
const file_model = require("../models/file");
const auth = require("../middleware/auth");

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

// Folder Exists check
router.post("/check", auth, async (req, res) => {
  const { link, foldername } = req.body;

  await file_model.findOne(
    { owner: req.user._id, file_name: foldername, link: link },
    (err, file) => {
      if (err) {
        console.error(err);
        return;
      } else {
        if (file) {
          res.send({ msg: 1 });
        } else {
          res.send({ msg: 0 });
        }
      }
    }
  );
});

//Copy files/folder

router.patch("/copy", auth, async (req, res) => {
  let { id, link } = req.body;
  let file_obj;

  await file_model.findOne({ _id: id, owner: req.user._id }, (err, file) => {
    if (err) return res.send(err);

    const {
      key,
      bucket,
      isFav,
      isTrash,
      file_name,
      owner,
      parent,
      createdAt,
      updatedAt,
    } = file;

    file_obj = {
      key,
      bucket,
      isFav,
      isTrash,
      file_name,
      owner,
      parent,
      link: link,
      createdAt,
      updatedAt,
    };
  });

  const model_obj = new file_model(file_obj);

  model_obj.save((err, obj) => {
    if (err) console.log("here", err);
    else res.send("Copied");
  });
});

//Move files/folder

router.patch("/move", auth, async (req, res) => {
  let { id, link } = req.body;

  await file_model.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    { link: link },
    (err, file) => {
      if (err) res.send(err);
      else res.send("Moved");
    }
  );
});

// Get subfiles
router.get("/subfiles/:folderid", auth, async (req, res) => {
  await file_model.find(
    {
      owner: req.user._id,
      isTrash: false,
      link: req.params.folderid,
    },
    (ERR, file_list) => {
      res.send(file_list);
    }
  );
});

// add folder
router.post("/addfolder", auth, (req, res) => {
  const { foldername, link } = req.body;

  const file_obj = {
    key: foldername,
    bucket: process.env.BUCKET_NAME,
    isFav: false,
    isTrash: false,
    file_name: foldername,
    owner: req.user._id,
    parent: true,
    link: link,
  };

  const model_obj = new file_model(file_obj);

  model_obj.save((err, obj) => {
    if (err) res.send(err);
    else res.send(obj._id);
  });
});

// upload files
router.post("/upload/:link", auth, async (req, res, next) => {
  let file = req.files.uploadFile;
  const file_obj = {
    key: file.name,
    bucket: process.env.BUCKET_NAME,
    isFav: false,
    isTrash: false,
    file_name: file.name,
    owner: req.user._id,
    parent: false,
    link: req.params.link,
  };
  const model_obj = new file_model(file_obj);
  model_obj.save(async (err, obj) => {
    if (err) {
      res.send({ msg: "failed" });
    } else {
      const file_content = Buffer.from(file.data, "base64");
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: String(obj._id),
        Body: file_content,
      };
      s3.upload(params, (err, data) => {
        if (err) res.send({ msg: "failed" });
        res.send({ msg: "success" });
      });
    }
  });
});

// Mark a file Favourite
router.patch("/fav/:file_id&:fav", auth, async (req, res) => {
  var id = req.params.file_id;
  var current_status = req.params.fav;
  var status = false;

  if (current_status == "false") {
    status = true;
  }

  file_model.findOne({ _id: id }, (err, doc) => {
    if (err) console.log(err);

    doc.isFav = status;
    doc.save();
  });

  res.status(200).send("updated");
});

//Update Trash Status
router.patch("/trash/:file_id", auth, async (req, res) => {
  var id = req.params.file_id;

  var file = await file_model.findOne({ _id: id }, (err, doc) => {
    if (err) console.log(err);
  });

  var status = true;

  if (file.isTrash) {
    status = false;
  }

  file_model.findOneAndUpdate(
    { _id: id },
    { $set: { isTrash: status } },
    (err, doc) => {
      if (err) console.log(err);

      console.log(doc);
    }
  );

  res.status(200).send("Trash");
});

// download a file
router.get("/download/:file_id", auth, async (req, res) => {
  await file_model.find(
    { _id: req.params.file_id, owner: req.user._id },
    (err, file_detail) => {
      if (err) console.log(err);

      const params = {
        Bucket: file_detail[0].bucket,
        Key: String(file_detail[0]._id),
      };

      s3.getObject(params, function (err, data) {
        if (err) {
          throw err;
        }
        // console.log(data.Body);
        res.send(data.Body);
        // fs.writeFileSync(params.Key, data.Body)
        console.log("file downloaded successfully");
      });
    }
  );
});

// share a file
router.post("/share", auth, async (req, res) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: req.body.file_id,
  };

  var expire = parseFloat(req.body.expire_in);

  const signedUrlExpireSeconds = expire * 3600; // your expiry time in seconds.

  const url = s3.getSignedUrl("getObject", {
    Bucket: params.Bucket,
    Key: params.Key,
    Expires: signedUrlExpireSeconds,
  });

  res.send(url);
});

// Delete files/folder
router.delete("/files/:file_id", auth, async (req, res) => {
  let rootid;

  // const file_detail = await file_model.findOne({
  //   _id: req.params.file_id,
  //   owner: req.user._id,
  // });

  const file_detail = await file_model.findOneAndDelete({
    _id: req.params.file_id,
    owner: req.user._id,
  });

  if (file_detail.parent) {
    rootid = file_detail._id;
    deleteSubFiles(rootid);
    deleteSubFolders(rootid);
  } else {
    deleteFile(file_detail._id);
  }

  async function deleteFile(key) {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: String(key),
    };

    s3.deleteObject(params, function (err, data) {
      if (err) console.log(err);
    });
  }

  async function deleteSubFiles(rootid) {
    await file_model
      .find({ owner: req.user._id, parent: false, link: rootid }, { _id: 1 })
      .then((res) => {
        for (let o of res) {
          deleteFile(o._id);
        }
        //   let objects = [];
        //   for (let o of res) {
        //     objects.push({ Key: String(o._id) });
        //   }
        //   const params = {
        //     Bucket: process.env.BUCKET,
        //     Delete: {
        //       Objects: objects,
        //       Quiet: false,
        //     },
        //   };
        //   s3.deleteObjects(params, function (err, data) {
        //     if (err) console.log(err);
        //     else console.log(data);
        //   });
      });

    await file_model.deleteMany({
      owner: req.user._id,
      link: rootid,
      parent: false,
    });
  }

  let folderarr = [];

  async function deleteSubFolders(rootid) {
    await file_model
      .find({ owner: req.user._id, parent: true, link: rootid })
      .then((doc) => {
        folderarr = folderarr.concat(doc);
      });

    await file_model.deleteMany({
      owner: req.user._id,
      parent: true,
      link: rootid,
    });

    while (folderarr.length !== 0) {
      let subfol = folderarr.shift();
      let rid = subfol._id;
      deleteSubFiles(rid);
      deleteSubFolders(rid);
    }
  }

  res.send({ sucess: "Deleted" });
});

// view files
router.get("/files", auth, async (req, res) => {
  await file_model.find(
    { owner: req.user._id, isTrash: false, link: "none" },
    (ERR, file_list) => {
      res.send(file_list);
    }
  );
});

// view files
router.get("/trash", auth, async (req, res) => {
  await file_model.find(
    { owner: req.user._id, isTrash: true },
    (ERR, file_list) => {
      res.send(file_list);
    }
  );
});

// view favourite filesList
router.get("/files/fav", auth, async (req, res) => {
  await file_model.find(
    { owner: req.user._id, isFav: true, isTrash: false },
    (ERR, file_list) => {
      res.send(file_list);
    }
  );
});

// rename file
router.patch("/rename/:file_id", auth, async (req, res) => {
  const newName = req.body.newName;
  await file_model.findOneAndUpdate(
    { _id: req.params.file_id, owner: req.user._id },
    { file_name: newName, updatedAt: Date.now },
    (ERR, file) => {
      res.send(file);
    }
  );
});

router.get("/search/:searchterm", auth, async (req, res) => {
  let s = req.params.searchterm;
  await file_model.find(
    { $text: { $search: s }, owner: req.user._id, isTrash: false },
    (ERR, file_list) => {
      res.send(file_list);
    }
  );
});

module.exports = router;
