import React, { useState, useEffect } from 'react';
import { Table, Image } from 'antd';
import type { TableProps } from 'antd';

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
  key: string;
}

interface CandidateTableProps {
  data: Candidate[];
  loading: boolean;
  rowSelection: TableProps<Candidate>['rowSelection'];
}

const CandidateTable: React.FC<CandidateTableProps> = ({
  data,
  loading,
  rowSelection,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate unique filters for designation, department, and hall
  const makeFilters = (items: string[]) =>
    Array.from(new Set(items)).map((item) => ({
      text: item,
      value: item,
    }));

  const designationFilters = makeFilters(data.map((c) => c.designation));
  const departmentFilters = makeFilters(data.map((c) => c.department));
  const hallFilters = makeFilters(data.map((c) => c.hall));

  const columns: TableProps<Candidate>['columns'] = [
    {
      title: 'Ballot No',
      dataIndex: 'ballotNumber',
      key: 'ballotNumber',
      sorter: (a, b) => parseInt(a.ballotNumber) - parseInt(b.ballotNumber),
    },
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      render: (photo) =>
        photo ? <Image src={photo} width={50} alt="candidate" /> : 'No photo',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Registration No',
      dataIndex: 'registrationNumber',
      key: 'registrationNumber',
      sorter: (a, b) =>
        a.registrationNumber.localeCompare(b.registrationNumber),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filters: isMounted ? departmentFilters : [],
      onFilter: (value, record) => record.department === value,
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      title: 'Hall',
      dataIndex: 'hall',
      key: 'hall',
      filters: isMounted ? hallFilters : [],
      onFilter: (value, record) => record.hall === value,
      sorter: (a, b) => a.hall.localeCompare(b.hall),
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      filters: isMounted ? designationFilters : [],
      onFilter: (value, record) => record.designation === value,
      sorter: (a, b) => a.designation.localeCompare(b.designation),
    },
  ];

  if (!isMounted) {
    return <Table loading={true} />;
  }

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default CandidateTable;