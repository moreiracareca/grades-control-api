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

router.put("/grades/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { student, subject, type, value } = req.body;

    let arrayGrades = await loadFile();

    let indexGrade = arrayGrades.grades.findIndex((grade) => grade.id == id);

    if (indexGrade === -1) {
      return res.status(400).json({ error: "ID não encontrado" });
    } else {
      arrayGrades.grades[indexGrade] = { id, student, subject, type, value };

      await fs.writeFile(global.file, JSON.stringify(arrayGrades));
    }

    return res.json(arrayGrades.grades[indexGrade]);

    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.Error(`PUT /account - ${err.message}`);
  }
});

router.delete("/grades/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let arrayGrades = await loadFile();

    let indexGrade = arrayGrades.grades.findIndex((grade) => grade.id == id);

    if (indexGrade === -1) {
      return res.status(400).json({ error: "ID não encontrado" });
    } else {
      arrayGrades.grades.splice(indexGrade, 1);

      await fs.writeFile(global.file, JSON.stringify(arrayGrades));
    }

    return res.json({ msg: "Removido com sucesso!" });

    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.Error(`PUT /account - ${err.message}`);
  }
});

router.get("/grades/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let arrayGrades = await loadFile();

    let indexGrade = arrayGrades.grades.findIndex((grade) => grade.id == id);

    if (indexGrade === -1) {
      return res.status(400).json({ error: "ID não encontrado" });
    }

    return res.json(arrayGrades.grades[indexGrade]);

    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.Error(`PUT /account - ${err.message}`);
  }
});

router.get("/grades/total/:student/:subject", async (req, res) => {
  try {
    const { student, subject } = req.params;

    let arrayGrades = await loadFile();

    const filterGrade = arrayGrades.grades.filter((grade) => {
      return grade.student == student && grade.subject == subject;
    });

    const totalGrade = filterGrade.reduce((accumulator, grade) => {
      return accumulator + parseInt(grade.value, 10);
    }, 0);

    return res.json({ msg: "Nota total: " + totalGrade });

    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.Error(`PUT /account - ${err.message}`);
  }
});

router.get("/grades/media/:subject/:type", async (req, res) => {
  try {
    const { subject, type } = req.params;

    let arrayGrades = await loadFile();

    const filterGrade = arrayGrades.grades.filter((grade) => {
      return grade.subject == subject && grade.type == type;
    });

    const totalGrade = filterGrade.reduce((accumulator, grade) => {
      return accumulator + parseInt(grade.value, 10);
    }, 0);

    const media = totalGrade / filterGrade.length;

    return res.json({ msg: "Média das notas é: " + media });

    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.Error(`PUT /account - ${err.message}`);
  }
});

router.get("/grades/top/:subject/:type", async (req, res) => {
  try {
    const { subject, type } = req.params;

    let arrayGrades = await loadFile();

    const filterGrade = arrayGrades.grades.filter((grade) => {
      return grade.subject == subject && grade.type == type;
    });

    const topGrades = filterGrade.sort((a, b) => b.value - a.value);

    return res.json(topGrades.splice(0, 3));

    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.Error(`PUT /account - ${err.message}`);
  }
});

module.exports = router;
