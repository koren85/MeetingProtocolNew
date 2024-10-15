import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ExecutorModalProps {
  executors: string[];
  setExecutors: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
}

export const ExecutorModal: React.FC<ExecutorModalProps> = ({
  executors,
  setExecutors,
  onClose,
}) => {
  const [newExecutor, setNewExecutor] = useState('');

  const addExecutor = () => {
    if (newExecutor && !executors.includes(newExecutor)) {
      setExecutors([...executors, newExecutor]);
      setNewExecutor('');
    }
  };

  const removeExecutor = (executor: string) => {
    setExecutors(executors.filter((e) => e !== executor));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Управление исполнителями</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={newExecutor}
            onChange={(e) => setNewExecutor(e.target.value)}
            placeholder="Новый исполнитель"
          />
          <button
            className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full"
            onClick={addExecutor}
          >
            Добавить исполнителя
          </button>
        </div>
        <ul>
          {executors.map((executor) => (
            <li key={executor} className="flex justify-between items-center mb-2">
              {executor}
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => removeExecutor(executor)}
              >
                <X size={20} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};