const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
//BAI1
// Khởi tạo ứng dụng Express
const app = express();

// Sử dụng middleware CORS để cho phép frontend truy cập API
app.use(cors());

// Sử dụng express.json() để parse JSON request body
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/student_db')
  .then(() => console.log("Đã kết nối MongoDB thành công"))
  .catch(err => console.error("Lỗi kết nối MongoDB:", err));


// Routes
const studentRoutes = require('./src/routes/student.route');
app.use('/api/students', studentRoutes);

// Log để debug routes
console.log('Routes đã được đăng ký: /api/students');


// Route cơ bản để kiểm tra server
app.get('/', (req, res) => {
  res.json({ message: 'Server đang chạy thành công!' });
});

// Khởi động server trên cổng 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});

