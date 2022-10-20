const express = require("express");
const app = express();

// read request bodies when they are Content-Type: application/json
app.use(express.json());

const PORT = process.env.PORT || 4000;

const students = [
  { id: 1, name: "Rohan" },
  { id: 2, name: "Alina" },
  { id: 3, name: "Pierre" },
];

app.get("/", (req, res) => {
  res.send("HELLO");
});

app.get("/students", (req, res) => {
  res.json(students);
});

app.post("/students", (req, res) => {
  //   console.log("ARE WE GETTING A POST REQUEST??", req.body);
  const newStudent = { id: students.length + 1, name: req.body.name };
  students.push(newStudent);
  res.status(201).json({ message: "Student created" });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
