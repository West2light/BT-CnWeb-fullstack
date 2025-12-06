import axios from 'axios';

// Cấu hình axios instance với base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions cho Students
export const studentAPI = {
  // Lấy danh sách tất cả học sinh
  getAllStudents: () => {
    return api.get('/students');
  },
  
  // Lấy thông tin một học sinh theo ID
  getStudentById: (id) => {
    return api.get(`/students/${id}`);
  },
  
  // Tạo học sinh mới
  createStudent: (studentData) => {
    console.log('API.createStudent - Sending data:', studentData);
    console.log('Full URL will be:', 'http://localhost:5000/api/students');
    return api.post('/students', studentData);
  },
  
  // Cập nhật thông tin học sinh
  updateStudent: (id, studentData) => {
    return api.put(`/students/${id}`, studentData);
  },
  
  // Xóa học sinh
  deleteStudent: (id) => {
    return api.delete(`/students/${id}`);
  },
};

export default api;

