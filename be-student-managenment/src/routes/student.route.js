const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");

// Log để debug
console.log('Student routes đang được load...');
console.log('Controller:', studentController);
//BAI1
router.get("/", studentController.getAllStudents);
//BAI2
router.post("/", (req, res, next) => {
  console.log('POST /api/students - Request body:', req.body);
  studentController.createStudent(req, res, next);
});
//BAI3
router.put("/:id", (req, res, next) => {
  console.log('PUT /api/students/:id - ID:', req.params.id, 'Body:', req.body);
  studentController.updateStudent(req, res, next);
});
//BAI4
router.delete("/:id", (req, res, next) => {
  console.log('DELETE /api/students/:id - ID:', req.params.id);
  studentController.deleteStudent(req, res, next);
});

module.exports = router;
