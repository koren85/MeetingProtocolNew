import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Select, { components } from 'react-select';

interface TableRowProps {
  index: number;
  data: any;
  regions: string[];
  executors: string[];
  updateRow: (id: number, data: any) => void;
  isSelected: boolean;
  toggleSelection: () => void;
}

const CustomOption = ({ children, ...props }: any) => {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null}
      />
      <label>{children}</label>
    </components.Option>
  );
};

export const TableRow: React.FC<TableRowProps> = ({
  index,
  data,
  regions,
  executors,
  updateRow,
  isSelected,
  toggleSelection,
}) => {
  const [showExecutorDropdown, setShowExecutorDropdown] = useState<{ [key: number]: boolean }>({});
  const [dropdownPosition, setDropdownPosition] = useState<{ [key: number]: { top: number, left: number } }>({});
  const executorCellRefs = useRef<{ [key: number]: HTMLTableDataCellElement | null }>({});

  const handleChange = (field: string, value: string | string[], rowIndex: number = 0) => {
    const updatedData = { ...data };
    if (data.mergedRows && data.mergedRows > 1) {
      if (field === 'region') {
        updatedData[field] = value;
      } else if (rowIndex === 0) {
        updatedData[field] = value;
      } else {
        updatedData[`row${rowIndex}`] = { ...updatedData[`row${rowIndex}`], [field]: value };
      }
    } else {
      updatedData[field] = value;
    }
    updateRow(data.id, updatedData);
  };

  useEffect(() => {
    Object.entries(showExecutorDropdown).forEach(([rowIndex, isShown]) => {
      if (isShown && executorCellRefs.current[Number(rowIndex)]) {
        const rect = executorCellRefs.current[Number(rowIndex)]!.getBoundingClientRect();
        setDropdownPosition(prev => ({
          ...prev,
          [rowIndex]: {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
          }
        }));
      }
    });
  }, [showExecutorDropdown]);

  const rowSpan = data.mergedRows || 1;

  const renderCommonFields = () => (
    <>
      <td className="p-2 border w-10" rowSpan={rowSpan}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={toggleSelection}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
      </td>
      <td className="p-2 border" rowSpan={rowSpan}>{index + 1}</td>
      <td className="p-2 border" rowSpan={rowSpan}>
        <select
          className="w-full"
          value={data.region || ''}
          onChange={(e) => handleChange('region', e.target.value)}
          style={{ width: 'auto', minWidth: '100%' }}
        >
          <option value="">Выберите регион</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </td>
    </>
  );

  const renderRowFields = (rowData: any, rowIndex: number) => {
    const executorValue = rowIndex === 0 ? (data.executor || []) : (rowData.executor || []);
    return (
      <>
        <td className="p-2 border tasks-column">
          <textarea
            className="w-full"
            value={rowData.tasks || ''}
            onChange={(e) => handleChange('tasks', e.target.value, rowIndex)}
          />
        </td>
        <td 
          className="p-2 border relative" 
          ref={(el) => executorCellRefs.current[rowIndex] = el}
        >
          <div 
            className="cursor-pointer flex items-center justify-between"
            onClick={() => setShowExecutorDropdown(prev => ({ ...prev, [rowIndex]: !prev[rowIndex] }))}
          >
            <div className="whitespace-pre-line">
              {executorValue.join('\n')}
            </div>
            <ChevronDown size={16} className="flex-shrink-0 ml-1" />
          </div>
          {showExecutorDropdown[rowIndex] && (
            <div 
              className="fixed z-50"
              style={{
                top: `${dropdownPosition[rowIndex]?.top || 0}px`,
                left: `${dropdownPosition[rowIndex]?.left || 0}px`,
                minWidth: executorCellRefs.current[rowIndex] ? executorCellRefs.current[rowIndex]!.offsetWidth : 'auto'
              }}
            >
              <Select
                isMulti
                options={executors.map(executor => ({ value: executor, label: executor }))}
                value={executorValue.map((exec: string) => ({ value: exec, label: exec }))}
                onChange={(selectedOptions) => {
                  const selectedExecutors = selectedOptions.map((option: any) => option.value);
                  handleChange('executor', selectedExecutors, rowIndex);
                }}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: '38px',
                  }),
                  menu: (provided) => ({
                    ...provided,
                    position: 'absolute',
                    zIndex: 9999,
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: '200px',
                  }),
                  option: (provided) => ({
                    ...provided,
                    whiteSpace: 'nowrap',
                  }),
                }}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{
                  Option: CustomOption,
                }}
                menuPlacement="auto"
                menuPosition="fixed"
                pageSize={5}
                onBlur={() => setShowExecutorDropdown(prev => ({ ...prev, [rowIndex]: false }))}
              />
            </div>
          )}
        </td>
        <td className="p-2 border">
          <input
            type="date"
            className="w-full"
            value={rowData.dueDate || ''}
            onChange={(e) => handleChange('dueDate', e.target.value, rowIndex)}
          />
        </td>
        <td className="p-2 border">
          <input
            type="text"
            className="w-full"
            value={rowData.completionStatus || ''}
            onChange={(e) => handleChange('completionStatus', e.target.value, rowIndex)}
          />
        </td>
        <td className="p-2 border">
          <input
            type="text"
            className="w-full"
            value={rowData.result || ''}
            onChange={(e) => handleChange('result', e.target.value, rowIndex)}
          />
        </td>
        <td className="p-2 border">
          <input
            type="text"
            className="w-full"
            value={rowData.signature || ''}
            onChange={(e) => handleChange('signature', e.target.value, rowIndex)}
          />
        </td>
        <td className="p-2 border">
          <textarea
            className="w-full"
            value={rowData.comment || ''}
            onChange={(e) => handleChange('comment', e.target.value, rowIndex)}
          />
        </td>
      </>
    );
  };

  if (data.mergedRows && data.mergedRows > 1) {
    const rows = [];
    for (let i = 0; i < data.mergedRows; i++) {
      rows.push(
        <tr key={`${data.id}-${i}`} className={isSelected ? 'bg-blue-100' : ''}>
          {i === 0 && renderCommonFields()}
          {renderRowFields(i === 0 ? data : data[`row${i}`] || {}, i)}
        </tr>
      );
    }
    return <>{rows}</>;
  }

  return (
    <tr className={isSelected ? 'bg-blue-100' : ''}>
      {renderCommonFields()}
      {renderRowFields(data, 0)}
    </tr>
  );
};