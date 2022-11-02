const { response } = require("express");
const express = require("express");
const app = express();
const z = require("zod");

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
  // get from db
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

const Student = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  email: z.string().email(),
});

app.post("/students", (req, res) => {
  try {
    const validatedInput = Student.parse(req.body);
    console.log(validatedInput);

    const newStudent = {
      id: students.length + 1,
      name: req.body.name,
      city: req.body.city,
    };
    students.push(newStudent);
    res.status(201).json({ message: "Student created" });
  } catch (error) {
    console.log(error.issues, error.name);
    if (error.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "validation error", errors: error.issues });
    } else {
      return res.status(500).json({ message: "Something went wrong, sorry!" });
    }
  }
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
