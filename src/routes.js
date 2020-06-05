const express = require("express");
const fs = require("fs").promises;

const router = express.Router();

global.file = "grades.json";

async function loadFile() {
  try {
    const gradesBinario = await fs.readFile(`./${global.file}`, "utf-8");
    return JSON.parse(gradesBinario);
  } catch (error) {
    console.log(`Erro ao ler o arquivo: ${error}`);
  }
}

router.get("/grades", async (req, res) => {
  let arrayGrades = await loadFile();
  return res.json(arrayGrades);
});

router.post("/grades", async (req, res) => {
  let arrayGrades = await loadFile();
  const { student, subject, type, value } = req.body;

  const newGrade = {
    id: arrayGrades.nextId,
    student,
    subject,
    type,
    value,
    timestamp: new Date(),
  };

  arrayGrades.nextId++;
  arrayGrades.grades.push(newGrade);

  console.log(newGrade);

  try {
    await fs.writeFile(global.file, JSON.stringify(arrayGrades));
  } catch (err) {
    res.status(400).json({ error: err });
  }

  return res.json(newGrade);
});

module.exports = router;
