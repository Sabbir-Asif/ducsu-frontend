import { Menu } from 'antd';
import Link from 'next/link';

const navigationItems = [
  {
    key: 'home',
    label: <Link href="/">Home</Link>,
  },
  {
    key: 'candidateList',
    label: <Link href="/candidates">Candidate List</Link>,
  },
];

export default function Navbar() {
  return <Menu mode="horizontal" items={navigationItems} />;
}