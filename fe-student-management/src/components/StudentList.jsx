import React, { useState, useMemo } from 'react';
import { Table, Card, Empty, Alert, Button, Popconfirm, message, Input, Space } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { studentAPI } from '../api/api';

const { Search } = Input;
//BAI1
const StudentList = ({ students = [], loading = false, error = null, refetch, onEdit }) => {
  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  // State cho sắp xếp (true = A→Z, false = Z→A)
  const [sortAsc, setSortAsc] = useState(true);

  // Sử dụng refetch từ prop (bắt buộc)
  const handleRefetch = refetch;
  //BAI5: Search students by name
  // Lọc danh sách học sinh dựa trên từ khóa tìm kiếm (không phân biệt hoa thường)
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) {
      return students;
    }
    return students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);
  //BAI6: Sort students by name
  // Sắp xếp danh sách đã lọc theo tên (không phân biệt hoa thường)
  const sortedStudents = useMemo(() => {
    const sorted = [...filteredStudents].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) return sortAsc ? -1 : 1;
      if (nameA > nameB) return sortAsc ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredStudents, sortAsc]);
  //BAI4: Delete a student
  // Hàm xử lý xóa học sinh
  const handleDelete = async (id) => {
    try {
      await studentAPI.deleteStudent(id);
      message.success('Đã xóa học sinh thành công!');
      handleRefetch();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Lỗi khi xóa học sinh';
      message.error(errorMessage);
      console.error('Error deleting student:', err);
    }
  };
  //BAI3: Edit a student
  // Hàm xử lý sửa học sinh - gọi callback từ App
  const handleEdit = (record) => {
    if (onEdit) {
      onEdit(record);
    }
  };

  // Định nghĩa columns cho Table
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      // Tắt sorter mặc định vì dùng nút toggle riêng
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      key: 'age',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class',
      sorter: (a, b) => a.class.localeCompare(b.class),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Sửa
          </Button>
          {/* //BAI4: Delete a student */}
          <Popconfirm
            title="Xóa học sinh"
            description={`Bạn có chắc chắn muốn xóa học sinh "${record.name}"?`}
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Hiển thị error state
  if (error) {
    return (
      <div className="student-list-container">
        <Alert
          type="error"
          showIcon
          closable
        >
          {error}
        </Alert>
      </div>
    );
  }

  // Hiển thị danh sách học sinh với Table của Ant Design
  return (
    <div className="student-list-container">
      <Card
        title="Danh sách học sinh"
        className="student-list-card"
        extra={
          <Space size="middle">
            {/* Nút toggle sắp xếp theo tên */}
            <Button
              type={sortAsc ? 'primary' : 'default'}
              icon={sortAsc ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
              onClick={() => setSortAsc(prev => !prev)}
              size="large"
            >
              Sắp xếp theo tên: {sortAsc ? 'A → Z' : 'Z → A'}
            </Button>
            <Search
              placeholder="Tìm kiếm theo tên..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 300 }}
            />
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={sortedStudents}
          rowKey={(record) => record._id || record.id || Math.random()}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              searchTerm
                ? `Hiển thị ${range[0]}-${range[1]} trong tổng ${total} kết quả tìm kiếm`
                : `Tổng cộng ${total} học sinh`,
            pageSizeOptions: ['5', '10', '20', '50'],
          }}
          locale={{
            emptyText: searchTerm ? (
              <Empty
                description={`Không tìm thấy học sinh nào với từ khóa "${searchTerm}"`}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <Empty
                description="Chưa có học sinh nào trong danh sách"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          bordered
          size="middle"
        />
      </Card>
    </div>
  );
};

export default StudentList;
