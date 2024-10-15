import React from 'react';
import { ClipboardList } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex items-center">
        <ClipboardList className="w-8 h-8 mr-2" />
        <h1 className="text-2xl font-bold">Протокол планёрки</h1>
      </div>
    </header>
  );
};