import { useState, useEffect } from 'react';
import { studentAPI } from '../api/api';

/**
 * Custom hook để quản lý danh sách học sinh
 * @returns {Object} { students, loading, error, refetch }
 */
export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm fetch danh sách học sinh
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentAPI.getAllStudents();
      setStudents(response.data);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách học sinh');
      console.error('Lỗi khi fetch danh sách:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Hàm refetch để tải lại dữ liệu
  const refetch = () => {
    fetchStudents();
  };

  return { students, loading, error, refetch };
};

