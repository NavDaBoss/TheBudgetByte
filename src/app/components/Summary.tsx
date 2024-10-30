import React, { useState } from 'react';

import { PieChart } from '@mui/x-charts/PieChart';
import CheckBoxIcon from '@mui/icons-material/CheckBoxSharp';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlankSharp';

import '../styles/Summary.css';

const SummaryHead = ({ sortColumn }) => {
  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('asc');

  const handleSortChange = (accessor) => {
    let sortOrder = 'asc';
    if (accessor === sortField) {
      if (order === 'asc') {
        sortOrder = 'desc';
      } else if (order === 'desc') {
        sortOrder = 'asc';
      }
    }
    setSortField(accessor);
    setOrder(sortOrder);
    sortColumn(accessor, sortOrder);
  };

  return (
    <thead>
      <tr>
        <th key="check" onClick={() => handleSortChange('check')}>
          Complete
        </th>
        <th key="group" onClick={() => handleSortChange('type')}>
          Group
        </th>
        <th key="count" onClick={() => handleSortChange('count')}>
          Count
        </th>
        <th key="price" onClick={() => handleSortChange('totalPrice')}>
          Price
        </th>
      </tr>
    </thead>
  );
};

const SummaryTable = ({ groups, sortColumn }) => {
  const rows = [];

  groups.map((group) => {
    rows.push(
      <tr key={group.type}>
        <td>
          {group.count > 0 ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
        </td>
        <td>{group.type}</td>
        <td>{group.count}</td>
        <td>${group.totalPrice.toFixed(2)}</td>
      </tr>,
    );
  });

  return (
    <table className="summary-table">
      <SummaryHead sortColumn={sortColumn} />
      <tbody>{rows}</tbody>
    </table>
  );
};

const Summary = ({ groups }) => {
  const [tableData, setTableData] = useState(groups);

  const sortColumn = (sortField, sortOrder) => {
    if (sortOrder === 'none') {
      setTableData(groups);
      return;
    }

    const sorted = [...groups].sort((a, b) => {
      if (sortField == 'check') {
        const checkA = a.count > 0 ? 1 : 0;
        const checkB = b.count > 0 ? 1 : 0;
        return sortOrder === 'asc' ? checkA - checkB : checkB - checkA;
      }
      if (typeof a[sortField] === 'number') {
        return (a[sortField] - b[sortField]) * (sortOrder === 'asc' ? 1 : -1);
      }
      a = a[sortField].toLowerCase();
      b = b[sortField].toLowerCase();

      return (
        a.localeCompare(b, 'en', {
          numeric: true,
        }) * (sortOrder === 'asc' ? 1 : -1)
      );
    });
    setTableData(sorted);
  };

  const pieData = tableData.map((group) => ({
    name: group.type,
    value: group.pricePercentage,
  }));

  return (
    <div className="summary-container">
      <div className="summary-table-container">
        <h1>Summary</h1>
        <SummaryTable groups={tableData} sortColumn={sortColumn} />
      </div>
      <div className="pie-chart-container">
        <PieChart
          series={[
            {
              data: pieData,
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          height={300}
          width={300}
        />
      </div>
    </div>
  );
};

export default Summary;
