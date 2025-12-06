//BAI2
import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, message, Card, Collapse } from 'antd';
import { PlusOutlined, MinusOutlined, EditOutlined } from '@ant-design/icons';
import { studentAPI } from '../api/api';
import './AddStudentForm.css';

const { Panel } = Collapse;

const AddStudentForm = ({ onSuccess, editingStudent, onCancelEdit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Khi có editingStudent, mở form ở chế độ edit và điền dữ liệu
  useEffect(() => {
    if (editingStudent) {
      setIsEditMode(true);
      setIsOpen(true);
      form.setFieldsValue({
        name: editingStudent.name,
        age: editingStudent.age,
        class: editingStudent.class,
      });
    } else {
      setIsEditMode(false);
    }
  }, [editingStudent, form]);

  // Hàm xử lý submit form (cả thêm mới và chỉnh sửa)
  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const studentData = {
        name: values.name.trim(),
        age: Number(values.age),
        class: values.class.trim(),
      };

      if (isEditMode && editingStudent) {
        // Chế độ chỉnh sửa - gọi API update
        console.log('Cập nhật học sinh:', editingStudent._id, studentData);
        const response = await studentAPI.updateStudent(editingStudent._id, studentData);
        console.log("Đã cập nhật:", response.data);
        message.success('Cập nhật học sinh thành công!');
      } else {
        // Chế độ thêm mới - gọi API create
        console.log('Thêm học sinh mới:', studentData);
        const response = await studentAPI.createStudent(studentData);
        console.log("Đã thêm:", response.data);
        message.success('Thêm học sinh thành công!');
      }

      // Reset form và đóng form
      form.resetFields();
      setIsOpen(false);
      setIsEditMode(false);

      // Gọi callback để reset editingStudent trong App
      if (onCancelEdit) {
        onCancelEdit();
      }

      // Gọi callback onSuccess để refetch danh sách
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message ||
        (isEditMode ? 'Lỗi khi cập nhật học sinh' : 'Lỗi khi thêm học sinh');
      console.error("Lỗi:", err);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi collapse thay đổi
  const handleCollapseChange = (key) => {
    const willOpen = key.includes('1');
    setIsOpen(willOpen);

    if (!willOpen) {
      // Khi đóng form, reset về chế độ thêm mới
      form.resetFields();
      setIsEditMode(false);
      if (onCancelEdit) {
        onCancelEdit();
      }
    }
  };

  // Hàm xử lý hủy chỉnh sửa
  const handleCancel = () => {
    form.resetFields();
    setIsOpen(false);
    setIsEditMode(false);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  // Xác định header và button text dựa trên chế độ
  const headerText = isEditMode ? 'Chỉnh sửa học sinh' : 'Thêm học sinh mới';
  const buttonText = isEditMode ? 'Cập nhật học sinh' : 'Thêm học sinh';
  const loadingText = isEditMode ? 'Đang cập nhật...' : 'Đang thêm...';

  return (
    <div className="add-student-form-container">
      <Collapse
        activeKey={isOpen ? ['1'] : []}
        onChange={handleCollapseChange}
        className="add-student-collapse"
        expandIcon={() => <PlusOutlined style={{ color: '#fff' }} />}
      >
        <Panel
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isOpen ? <MinusOutlined /> : <PlusOutlined />}
              <span>{headerText}</span>
              {isEditMode && <EditOutlined style={{ color: '#1890ff' }} />}
            </div>
          }
          key="1"
          className="add-student-panel"
        >
          <Card className="student-form-card" bordered={false}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              {/* Trường Họ tên */}
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ tên!' },
                  { whitespace: true, message: 'Họ tên không được để trống!' },
                ]}
              >
                <Input
                  placeholder="Nhập họ tên học sinh"
                  size="large"
                />
              </Form.Item>

              {/* Trường Tuổi */}
              <Form.Item
                label="Tuổi"
                name="age"
                rules={[
                  { required: true, message: 'Vui lòng nhập tuổi!' },
                  { type: 'number', min: 1, max: 100, message: 'Tuổi phải từ 1 đến 100!' },
                ]}
              >
                <InputNumber
                  placeholder="Nhập tuổi"
                  min={1}
                  max={100}
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>

              {/* Trường Lớp */}
              <Form.Item
                label="Lớp"
                name="class"
                rules={[
                  { required: true, message: 'Vui lòng nhập lớp!' },
                  { whitespace: true, message: 'Lớp không được để trống!' },
                ]}
              >
                <Input
                  placeholder="Nhập lớp học"
                  size="large"
                />
              </Form.Item>

              {/* Nút submit và hủy */}
              <Form.Item>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    block
                    icon={isEditMode ? <EditOutlined /> : <PlusOutlined />}
                  >
                    {loading ? loadingText : buttonText}
                  </Button>
                  {isEditMode && (
                    <Button
                      size="large"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                  )}
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Panel>
      </Collapse>
    </div>
  );
};

export default AddStudentForm;
