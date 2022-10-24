const express = require("express");
const app = express();

// read request bodies when they are Content-Type: application/json
app.use(express.json()); // "use"ing a middleware

const PORT = process.env.PORT || 4000;

let students = [
  { id: 1, name: "Rohan" },
  { id: 2, name: "Alina" },
  { id: 3, name: "Pierre" },
];

// GET /
app.get("/", (req, res) => {
  res.send("HELLO");
});

// GET /students
app.get("/students", (req, res) => {
  res.json(students);
});

// GET /students/:id
// route parameter -> :id
app.get("/students/:id", (req, res) => {
  const student = findStudentById(Number(req.params.id));

  if (!student) {
    return res.status(404).json({ message: "student not found" });
  }

  res.json(student);
});

// POST /students
app.post("/students", (req, res) => {
  const newStudent = { id: students.length + 1, name: req.body.name };
  students.push(newStudent);
  res.status(201).json({ message: "Student created" });
});

// DELETE /students/:id
app.delete("/students/:id", (req, res) => {
  const student = findStudentById(Number(req.params.id));

  if (!student) {
    return res.status(404).json({ message: "student not found" });
  }

  students = students.filter((student) => student.id !== Number(req.params.id));

  res.json({ message: "student deleted" });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

function findStudentById(studentId) {
  return students.find((student) => student.id === studentId);
}
