const express = require("express");
const app = express();
const z = require("zod");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// read request bodies when they are Content-Type: application/json
app.use(express.json()); // "use"ing a middleware

const PORT = process.env.PORT || 4000;

// GET /
app.get("/", (req, res) => {
  res.send("HELLO");
});

// READ
// GET /students
app.get("/students", async (req, res) => {
  // get from db
  const students = await prisma.student.findMany();
  res.json(students);
});

// READ
// GET /students/:id
// route parameter -> :id
app.get("/students/:id", async (req, res) => {
  try {
    const student = await prisma.student.findUniqueOrThrow({
      where: { id: Number(req.params.id) },
    });

    res.json(student);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ message: "student not found" });
    } else {
      console.log(error);
      return res.status(500).json({ message: "something went wrong" });
    }
  }
});

// CREATE
// POST /students

const StudentSchema = z
  .object({
    name: z.string().min(2),
    city: z.string().min(2),
  })
  .strict();

app.post("/students", async (req, res) => {
  try {
    const validatedInput = StudentSchema.parse(req.body);

    const newStudent = await prisma.student.create({ data: validatedInput });
    res.status(201).json({ message: "Student created", student: newStudent });
  } catch (error) {
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
app.delete("/students/:id", async (req, res) => {
  try {
    const student = await prisma.student.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "student deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "student not found" });
    } else {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
});

app.patch("/students/:id", async (req, res) => {
  try {
    const validatedInput = StudentSchema.parse(req.body);

    const student = await prisma.student.update({
      where: {
        id: Number(req.params.id),
      },
      data: validatedInput,
    });

    res.json(student);
  } catch (error) {
    if (error.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "validation error", errors: error.issues });
    } else if (error.code === "P2025") {
      return res.status(404).json({ message: "student not found" });
    } else {
      console.log("UNEXPECTED!", error);
      return res.status(500).json({ message: "Something went wrong, sorry!" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
