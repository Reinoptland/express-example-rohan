const express = require("express");
const app = express();

// read request bodies when they are Content-Type: application/json
app.use(express.json()); // "use"ing a middleware

const PORT = process.env.PORT || 4000;

let students = [
  { id: 1, name: "Rohan", city: "Uithoorn" },
  { id: 2, name: "Alina", city: "Almere" },
  { id: 3, name: "Pierre", city: "Amsterdam" },
];

// GET /
app.get("/", (req, res) => {
  res.send("HELLO");
});

// READ
// GET /students
app.get("/students", (req, res) => {
  res.json(students);
});

// READ
// GET /students/:id
// route parameter -> :id
app.get("/students/:id", (req, res) => {
  const student = findStudentById(Number(req.params.id));

  if (!student) {
    return res.status(404).json({ message: "student not found" });
  }

  res.json(student);
});

// CREATE
// POST /students
app.post("/students", (req, res) => {
  const newStudent = {
    id: students.length + 1,
    name: req.body.name,
    city: req.body.city,
  };
  students.push(newStudent);
  res.status(201).json({ message: "Student created" });
});

// DESTROY
// DELETE /students/:id
app.delete("/students/:id", (req, res) => {
  const student = findStudentById(Number(req.params.id));

  if (!student) {
    return res.status(404).json({ message: "student not found" });
  }

  students = students.filter((student) => student.id !== Number(req.params.id));

  res.json({ message: "student deleted" });
});

app.patch("/students/:id", (req, res) => {
  const student = findStudentById(Number(req.params.id));

  if (!student) {
    return res.status(404).json({ message: "student not found" });
  }

  // console.log("CURRENT STUDENT:", student, "DATA FROM THE REQUEST", req.body);
  // update student -> current student, data from the request
  // combine the 2
  // student.name = req.body.name;
  for (key in req.body) {
    student[key] = req.body[key];
  }

  res.json(student);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

function findStudentById(studentId) {
  return students.find((student) => student.id === studentId);
}
