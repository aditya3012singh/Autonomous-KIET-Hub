import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  title: string;
}

export function Layout({ children, activeSection, onSectionChange, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={onSectionChange} />
      <Header title={title} />
      
      <main className="ml-64 pt-20">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}