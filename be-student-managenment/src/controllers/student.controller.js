const Student = require("../models/Student");
//Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//POST create a new student
exports.createStudent = async (req, res) => {
  try {
    console.log('createStudent - Request body:', req.body);
    console.log('Student model:', Student);
    const student = await Student.create(req.body);
    console.log('Student created:', student);
    res.status(201).json(student);
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(400).json({ error: err.message });
  }
};

//PUT update a student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('updateStudent - ID:', id, 'Body:', req.body);
    const student = await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!student) {
      return res.status(404).json({ error: 'Không tìm thấy học sinh' });
    }
    console.log('Student updated:', student);
    res.json(student);
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(400).json({ error: err.message });
  }
};

//DELETE delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params.id;
    console.log('deleteStudent - ID:', id);
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ error: 'Không tìm thấy học sinh' });
    }
    console.log('Student deleted:', student);
    res.json({ message: 'Đã xóa học sinh thành công', student });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(400).json({ error: err.message });
  }
};