import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import AdminBooks from '@/pages/admin/AdminBooks';

// This page wraps the existing AdminBooks but with navigation back to the hub
export default function AdminClubeAcervo() {
  return <AdminBooks />;
}
