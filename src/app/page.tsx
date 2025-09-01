'use client';

import { Select, Form, Button } from 'antd';
import { useState } from 'react';
import Navbar from './_components/Navbar';
import { hallOptions } from '@/lib/constants/hallName';

export default function HomePage() {
  const [selectedElectionType, setSelectedElectionType] = useState('কেন্দ্রীয়');

  return (
    <div>
      <Navbar />
      <Select
        value={selectedElectionType}
        onChange={setSelectedElectionType}
        style={{ width: 200, margin: '16px 0' }}
      >
        <Select.Option value="কেন্দ্রীয়">কেন্দ্রীয়</Select.Option>
        <Select.Option value="হল সংসদ">হল সংসদ</Select.Option>
      </Select>
      {selectedElectionType === 'কেন্দ্রীয়' ? (
        <Form layout="vertical">
          {/* Placeholder fields - replace with actual positions and candidate options fetched from backend */}
          <Form.Item label="Select Candidate for Position 1" rules={[{ required: true, message: 'Please select a candidate' }]}>
            <Select placeholder="Select a candidate">
              {/* Populate options dynamically from backend */}
            </Select>
          </Form.Item>
          <Form.Item label="Select Candidate for Position 2" rules={[{ required: true, message: 'Please select a candidate' }]}>
            <Select placeholder="Select a candidate">
              {/* Populate options dynamically from backend */}
            </Select>
          </Form.Item>
          {/* Add more position fields as needed */}
          <Button type="primary">Submit Vote</Button>
        </Form>
      ) : (
        <Form layout="vertical">
          <Form.Item label="Select Hall" rules={[{ required: true, message: 'Please select a hall' }]}>
            <Select placeholder="Select a hall">
              {hallOptions.map((hall) => (
                <Select.Option key={hall} value={hall}>
                  {hall}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {/* Placeholder fields - replace with actual positions and candidate options fetched from backend */}
          <Form.Item label="Select Candidate for Position 1" rules={[{ required: true, message: 'Please select a candidate' }]}>
            <Select placeholder="Select a candidate">
              {/* Populate options dynamically from backend, filtered by selected hall */}
            </Select>
          </Form.Item>
          <Form.Item label="Select Candidate for Position 2" rules={[{ required: true, message: 'Please select a candidate' }]}>
            <Select placeholder="Select a candidate">
              {/* Populate options dynamically from backend, filtered by selected hall */}
            </Select>
          </Form.Item>
          {/* Add more position fields as needed */}
          <Button type="primary">Submit Vote</Button>
        </Form>
      )}
    </div>
  );
}