import React from 'react';
import { PlusCircle, Merge, Trash2, Split, FileSpreadsheet } from 'lucide-react';

interface SidebarProps {
  onAddRow: () => void;
  onMergeRows: () => void;
  onDeleteRows: () => void;
  onSplitRow: () => void;
  onExportToExcel: () => void;
  canMerge: boolean;
  canDelete: boolean;
  canSplit: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onAddRow,
  onMergeRows,
  onDeleteRows,
  onSplitRow,
  onExportToExcel,
  canMerge,
  canDelete,
  canSplit
}) => {
  return (
    <div className="w-16 flex flex-col items-center space-y-4 sticky top-0 h-screen pt-4">
      <button
        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full"
        onClick={onAddRow}
        title="Добавить строку"
      >
        <PlusCircle size={24} />
      </button>
      <button
        className={`p-2 ${canMerge ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'} text-white rounded-full`}
        onClick={onMergeRows}
        disabled={!canMerge}
        title="Объединить выбранные строки"
      >
        <Merge size={24} />
      </button>
      <button
        className={`p-2 ${canSplit ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-300'} text-white rounded-full`}
        onClick={onSplitRow}
        disabled={!canSplit}
        title="Разделить объединенную строку"
      >
        <Split size={24} />
      </button>
      <button
        className={`p-2 ${canDelete ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300'} text-white rounded-full`}
        onClick={onDeleteRows}
        disabled={!canDelete}
        title="Удалить выбранные строки"
      >
        <Trash2 size={24} />
      </button>
      <button
        className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full"
        onClick={onExportToExcel}
        title="Экспорт в Excel"
      >
        <FileSpreadsheet size={24} />
      </button>
    </div>
  );
};