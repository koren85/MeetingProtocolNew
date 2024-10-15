import React, { useState, useEffect } from 'react';
import { Table } from './components/Table';
import { Header } from './components/Header';
import { RegionModal } from './components/RegionModal';
import { ExecutorModal } from './components/ExecutorModal';
import { Sidebar } from './components/Sidebar';
import { exportToExcel } from './utils/excelExport';

function App() {
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showExecutorModal, setShowExecutorModal] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [executors, setExecutors] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    // TODO: Fetch regions and executors from the database
    setRegions(['Воронеж', 'Владимир']);
    setExecutors(['Черняев', 'Булычева']);
  }, []);

  const addRow = () => {
    setRows([...rows, { id: nextId }]);
    setNextId(nextId + 1);
  };

  const updateRow = (id: number, data: any) => {
    setRows(rows.map(row => row.id === id ? { ...row, ...data } : row));
  };

  const toggleRowSelection = (index: number) => {
    setSelectedRows(prevSelected =>
      prevSelected.includes(index)
        ? prevSelected.filter(i => i !== index)
        : [...prevSelected, index]
    );
  };

  const deleteSelectedRows = () => {
    setRows(rows.filter((_, index) => !selectedRows.includes(index)));
    setSelectedRows([]);
  };

  const mergeRows = () => {
    if (selectedRows.length < 2) return;

    const sortedSelectedRows = [...selectedRows].sort((a, b) => a - b);
    const firstRowIndex = sortedSelectedRows[0];
    const mergedRow = {
      ...rows[firstRowIndex],
      mergedRows: sortedSelectedRows.length,
    };

    for (let i = 1; i < sortedSelectedRows.length; i++) {
      const rowIndex = sortedSelectedRows[i];
      mergedRow[`row${i}`] = rows[rowIndex];
    }

    const newRows = rows.filter((_, index) => !selectedRows.includes(index));
    newRows.splice(firstRowIndex, 0, mergedRow);

    setRows(newRows);
    setSelectedRows([]);
  };

  const splitRow = () => {
    if (selectedRows.length !== 1) return;
    
    const rowIndex = selectedRows[0];
    const row = rows[rowIndex];
    if (!row.mergedRows || row.mergedRows <= 1) return;

    const newRows = [
      { ...row, mergedRows: undefined },
      ...Array.from({ length: row.mergedRows - 1 }, (_, i) => ({
        ...row[`row${i + 1}`],
        id: nextId + i,
      })),
    ];

    setRows([
      ...rows.slice(0, rowIndex),
      ...newRows,
      ...rows.slice(rowIndex + 1),
    ]);
    setNextId(nextId + row.mergedRows - 1);
    setSelectedRows([]);
  };

  const canMerge = selectedRows.length >= 2;
  const canDelete = selectedRows.length > 0;
  const canSplit = selectedRows.length === 1 && rows[selectedRows[0]]?.mergedRows > 1;

  const handleExportToExcel = () => {
    exportToExcel(rows);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex">
        <Sidebar
          onAddRow={addRow}
          onMergeRows={mergeRows}
          onDeleteRows={deleteSelectedRows}
          onSplitRow={splitRow}
          onExportToExcel={handleExportToExcel}
          canMerge={canMerge}
          canDelete={canDelete}
          canSplit={canSplit}
        />
        <div className="flex-grow bg-white shadow-md rounded-lg overflow-hidden ml-4">
          <Table
            regions={regions}
            executors={executors}
            rows={rows}
            selectedRows={selectedRows}
            onAddRow={addRow}
            onUpdateRow={updateRow}
            onToggleRowSelection={toggleRowSelection}
          />
        </div>
      </main>
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowRegionModal(true)}
        >
          Управление регионами
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowExecutorModal(true)}
        >
          Управление исполнителями
        </button>
      </div>
      {showRegionModal && (
        <RegionModal
          regions={regions}
          setRegions={setRegions}
          onClose={() => setShowRegionModal(false)}
        />
      )}
      {showExecutorModal && (
        <ExecutorModal
          executors={executors}
          setExecutors={setExecutors}
          onClose={() => setShowExecutorModal(false)}
        />
      )}
    </div>
  );
}

export default App;