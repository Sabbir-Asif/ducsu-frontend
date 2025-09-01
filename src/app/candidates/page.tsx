'use client';

import { Card, Button, Form, message, Space, Input, Select } from 'antd';
import { useState, useEffect } from 'react';
import CandidateTable from './_components/CandidateTable';
import CandidateFormModal from './_components/CandidateFormModal';

interface Candidate {
  _id: string;
  ballotNumber: string;
  name: string;
  postalNumber: string | null;
  registrationNumber: string;
  department: string;
  hall: string;
  designation: string;
  photo: string | null;
  createdAt: string;
  updatedAt: string;
  Category: string;
  __v: number;
}

interface CandidateTableItem extends Candidate {
  key: string;
}

export default function CandidateListPage() {
  const [candidates, setCandidates] = useState<CandidateTableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<CandidateTableItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedHall, setSelectedHall] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/users');
      const result = await response.json();
      
      if (result.success) {
        const candidatesWithKeys = result.data.map((candidate: Candidate) => ({
          ...candidate,
          key: candidate._id,
        }));
        setCandidates(candidatesWithKeys);
      } else {
        message.error('Failed to fetch candidates');
      }
    } catch (error) {
      message.error('Error fetching candidates');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleHallFilterChange = (value: string | undefined) => {
    setSelectedHall(value);
  };

  const handleRowSelectionChange = (newSelectedRowKeys: React.Key[], newSelectedRows: CandidateTableItem[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedCandidates(newSelectedRows);
  };

  const handleAddCandidate = () => {
    setFormMode('add');
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleUpdateCandidate = () => {
    if (selectedCandidates.length === 1) {
      setFormMode('edit');
      const candidate = selectedCandidates[0];
      form.setFieldsValue({
        _id: candidate._id,
        ballotNumber: candidate.ballotNumber,
        name: candidate.name,
        registrationNumber: candidate.registrationNumber,
        department: candidate.department,
        hall: candidate.hall,
        designation: candidate.designation,
      });
      setIsModalVisible(true);
    } else {
      message.warning('Please select exactly one candidate to update.');
    }
  };

  const handleDeleteCandidates = async () => {
    if (selectedRowKeys.length > 0) {
      try {
        const deletePromises = selectedRowKeys.map(id =>
          fetch(`http://localhost:4000/api/users/${id}`, { method: 'DELETE' })
        );
        
        await Promise.all(deletePromises);
        message.success('Candidates deleted successfully.');
        fetchCandidates();
        setSelectedRowKeys([]);
        setSelectedCandidates([]);
      } catch (error) {
        message.error('Error deleting candidates');
        console.error(error);
      }
    } else {
      message.warning('Please select candidates to delete.');
    }
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);
      let hasPhoto = Array.isArray(values.photo) && values.photo.length > 0 && values.photo[0].originFileObj;
      console.log('Photo field:', values.photo, 'Has photo:', hasPhoto);
      let body: string | FormData;
      let headers: Record<string, string> = {};
      if (hasPhoto) {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
          if (key === 'photo' && Array.isArray(values.photo) && values.photo.length > 0) {
            const fileObj = values.photo[0].originFileObj;
            formData.append('photo', fileObj);
            console.log('Appending photo to FormData:', fileObj);
          } else if (values[key] !== undefined && values[key] !== null && key !== 'photo') {
            formData.append(key, values[key]);
          }
        });
        body = formData;
        for (let pair of formData.entries()) {
          console.log('FormData entry:', pair[0], pair[1]);
        }
      } else {
        body = JSON.stringify(values);
        headers['Content-Type'] = 'application/json';
      }
      if (formMode === 'add') {
        console.log('Sending request to add candidate:', { method: 'POST', headers, body });
        const response = await fetch('http://localhost:4000/api/users', {
          method: 'POST',
          headers,
          body,
        });
        console.log('Add candidate response status:', response.status);
        const result = await response.json();
        console.log('Add candidate response JSON:', result);
        if (result.success) {
          message.success('Candidate added successfully.');
          setIsModalVisible(false);
          form.resetFields();
          fetchCandidates();
        } else {
          message.error('Failed to add candidate');
        }
      } else {
        console.log('Sending request to update candidate:', { method: 'PUT', headers, body });
        const response = await fetch(`http://localhost:4000/api/users/${values._id}`, {
          method: 'PUT',
          headers,
          body,
        });
        console.log('Update candidate response status:', response.status);
        const result = await response.json();
        console.log('Update candidate response JSON:', result);
        if (result.success) {
          message.success('Candidate updated successfully.');
          setIsModalVisible(false);
          form.resetFields();
          fetchCandidates();
        } else {
          message.error('Failed to update candidate');
        }
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // Filter data on the client side
  const filteredData = candidates.filter((candidate) => {
    const matchesSearchText =
      candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
      candidate.registrationNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      candidate.department.toLowerCase().includes(searchText.toLowerCase()) ||
      candidate.designation.toLowerCase().includes(searchText.toLowerCase());

    const matchesHallFilter = selectedHall ? candidate.hall === selectedHall : true;

    return matchesSearchText && matchesHallFilter;
  });

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="Candidate List"
        extra={
          <Space wrap>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Input
                placeholder="Search by name, reg no, department, or designation"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 300 }}
              />
              <Select
                placeholder="Filter by hall"
                value={selectedHall}
                onChange={handleHallFilterChange}
                style={{ width: 200 }}
                allowClear
              >
                {[...new Set(candidates.map((candidate) => candidate.hall))].map((hall) => (
                  <Select.Option key={hall} value={hall}>
                    {hall}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <Space>
              <Button onClick={handleDeleteCandidates} disabled={selectedRowKeys.length === 0}>
                Delete
              </Button>
              <Button onClick={handleUpdateCandidate} disabled={selectedCandidates.length !== 1}>
                Update
              </Button>
              <Button type="primary" onClick={handleAddCandidate}>
                Add Candidate
              </Button>
            </Space>
          </Space>
        }
      >
        <CandidateTable 
          data={filteredData} 
          loading={loading}
          rowSelection={{ 
            selectedRowKeys, 
            onChange: handleRowSelectionChange 
          }} 
        />
      </Card>

      <CandidateFormModal
        visible={isModalVisible}
        formMode={formMode}
        form={form}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      />
    </div>
  );
}