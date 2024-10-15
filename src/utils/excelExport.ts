import * as XLSX from 'xlsx';

export const exportToExcel = (rows: any[]) => {
  // Определение заголовков
  const headers = [
    '№ п/п',
    'Регион',
    'Задачи',
    'Исполнитель',
    'Срок выполнения',
    'Отметка о выполнении',
    'Результат',
    'Подпись',
    'Комментарий'
  ];

  // Преобразование данных в формат для Excel
  const data = rows.flatMap((row, index) => {
    const baseRow = [
      index + 1,
      row.region || '',
      row.tasks || '',
      (row.executor || []).join(', '),
      row.dueDate || '',
      row.completionStatus || '',
      row.result || '',
      row.signature || '',
      row.comment || ''
    ];

    if (row.mergedRows && row.mergedRows > 1) {
      const additionalRows = Array.from({ length: row.mergedRows - 1 }, (_, i) => {
        const subRow = row[`row${i + 1}`] || {};
        return [
          '',
          '',
          subRow.tasks || '',
          (subRow.executor || []).join(', '),
          subRow.dueDate || '',
          subRow.completionStatus || '',
          subRow.result || '',
          subRow.signature || '',
          subRow.comment || ''
        ];
      });
      return [baseRow, ...additionalRows];
    }

    return [baseRow];
  });

  // Создание рабочей книги и листа
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

  // Применение объединения ячеек для merged rows
  const merges: XLSX.Range[] = [];
  let currentRow = 1; // Начинаем с 1, так как 0 - это строка заголовков
  rows.forEach((row) => {
    if (row.mergedRows && row.mergedRows > 1) {
      merges.push(
        { s: { r: currentRow, c: 0 }, e: { r: currentRow + row.mergedRows - 1, c: 0 } },
        { s: { r: currentRow, c: 1 }, e: { r: currentRow + row.mergedRows - 1, c: 1 } }
      );
      currentRow += row.mergedRows;
    } else {
      currentRow += 1;
    }
  });

  ws['!merges'] = merges;

  // Добавление листа в книгу
  XLSX.utils.book_append_sheet(wb, ws, "Протокол планёрки");

  // Сохранение файла
  XLSX.writeFile(wb, "протокол_планёрки.xlsx");
};