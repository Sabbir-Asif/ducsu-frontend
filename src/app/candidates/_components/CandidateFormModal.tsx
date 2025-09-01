import React from 'react';
import { Modal, Form, Input, Upload, Button, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { GetProp, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface CandidateFormModalProps {
  visible: boolean;
  formMode: 'add' | 'edit';
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onSubmit: () => void;
  onCancel: () => void;
}

const hallOptions = [
  'ফজলুল হক মুসলিম হল',
  'কবি সুফিয়া কামাল হল',
  'সূর্যসেন হল',
  'হাজী মুহম্মদ মুহসীন হল',
  'বিজয় একাত্তর হল',
  'শহীদ স্যার্জেন্ট জহুরুল হক হল',
  'জাতির জনক বঙ্গবন্ধু শেখ মুজিবুর রহমান হল',
  'সলিমুল্লাহ মুসলিম হল',
  'শেখ মুজিবুর রহমান হল',
  'ড. মুহম्मদ শহীদুল্লাহ হল',
  'অমর একুशে হল',
  'শামসুন নাহার হল',
  'বাংলাদেশ-কুয়েত মৈত্রী হল',
  'কবি জসীম উদদীন হল',
  'জগন্নাথ হল',
  'স্যার এ এফ রহমান হল'
];

const CandidateFormModal: React.FC<CandidateFormModalProps> = ({
  visible,
  formMode,
  form,
  onSubmit,
  onCancel,
}) => {
//eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizeFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const uploadConfig = {
    beforeUpload: (file: FileType) => {
      return false;
    },
    maxCount: 1,
  };

  return (
    <Modal
      title={formMode === 'add' ? 'Add Candidate' : 'Update Candidate'}
      open={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      okText={formMode === 'add' ? 'Add' : 'Update'}
    >
      <Form form={form} layout="vertical">
        {formMode === 'edit' && (
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item 
          name="ballotNumber" 
          label="Ballot Number" 
          rules={[{ required: true, message: 'Please enter ballot number' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
          name="name" 
          label="Name" 
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
          name="registrationNumber" 
          label="Registration Number" 
          rules={[{ required: true, message: 'Please enter registration number' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
          name="department" 
          label="Department" 
          rules={[{ required: true, message: 'Please enter department' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
          name="hall" 
          label="Hall" 
          rules={[{ required: true, message: 'Please select a hall' }]}
        >
          <Select>
            {hallOptions.map((hall) => (
              <Select.Option key={hall} value={hall}>
                {hall}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item 
          name="designation" 
          label="Designation" 
          rules={[{ required: true, message: 'Please enter designation' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="photo"
          label="Photo"
          valuePropName="fileList"
          getValueFromEvent={normalizeFile}
        >
          <Upload {...uploadConfig} listType="picture">
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CandidateFormModal;