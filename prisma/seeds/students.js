const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const students = require("./students.json");

async function seedStudents() {
  for (student of students) {
    const result = await prisma.student.create({
      data: {
        name: student.name,
        city: student.city,
      },
    });
    console.log("SEEDED:", result);
  }
}

seedStudents();
