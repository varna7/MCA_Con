const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mca_connect",
});

app.get("/fileHome", (req, res) => {
  const q = "SELECT * from files";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.get('/fileHome/:id', function(req, res) {
    const id = req.params.id;
    connection.query('SELECT path FROM files WHERE id = ?', [id], function(error, results, fields) {
      if (error) throw error;
      const file_path = results[0].path;
      res.download(file_path);
    });
  });

const upload = multer({ dest: 'uploads/' });

app.post('/add-file',upload.single('file'), (req, res) => {
    console.log(req.file);

    const { name, type } = req.body;
    const path = req.file.path;
    const size = req.file.size;
    const folder_id = 1;
  
    const query = 'INSERT INTO files (name, path, size, type, folder_id) VALUES (?, ?, ?, ?, ?)';
    const values = [name, path, size, type, folder_id];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
  
      res.status(200).send('File uploaded successfully.');
    });
  });
  

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the MySQL database!");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
