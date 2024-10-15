import React from 'react';
import { TableRow } from './TableRow';

interface TableProps {
  regions: string[];
  executors: string[];
  rows: any[];
  selectedRows: number[];
  onAddRow: () => void;
  onUpdateRow: (id: number, data: any) => void;
  onToggleRowSelection: (index: number) => void;
}

export const Table: React.FC<TableProps> = ({
  regions,
  executors,
  rows,
  selectedRows,
  onAddRow,
  onUpdateRow,
  onToggleRowSelection,
}) => {
  return (
    <div className="table-container flex-grow overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border w-10"></th>
            <th className="p-2 border">№ п\п</th>
            <th className="p-2 border">Регион</th>
            <th className="p-2 border tasks-column">Задачи</th>
            <th className="p-2 border">Исполнитель</th>
            <th className="p-2 border">Срок выполнения</th>
            <th className="p-2 border">Отметка о выполнении</th>
            <th className="p-2 border">Результат</th>
            <th className="p-2 border">Подпись</th>
            <th className="p-2 border">Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <TableRow
              key={row.id}
              index={index}
              data={row}
              regions={regions}
              executors={executors}
              updateRow={onUpdateRow}
              isSelected={selectedRows.includes(index)}
              toggleSelection={() => onToggleRowSelection(index)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};