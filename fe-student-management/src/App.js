import React, { useState } from 'react';
import { Layout, Typography } from 'antd';
import './App.css';
import StudentList from './components/StudentList';
import AddStudentForm from './components/AddStudentForm';
import { useStudents } from './hooks/useStudents';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const { students, loading, error, refetch } = useStudents();
  const [editingStudent, setEditingStudent] = useState(null);

  // Hàm xử lý khi click nút Sửa
  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  // Hàm xử lý khi hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  return (
    <Layout className="App">
      <Header className="app-header">
        <Title level={2} className="app-title">
          Quản lý học sinh
        </Title>
      </Header>
      <Content className="app-content">
        <AddStudentForm 
          onSuccess={refetch} 
          editingStudent={editingStudent}
          onCancelEdit={handleCancelEdit}
        />
        <StudentList 
          students={students}
          loading={loading}
          error={error}
          refetch={refetch}
          onEdit={handleEdit}
        />
      </Content>
    </Layout>
  );
}

export default App;
