import React, { useState, useEffect } from 'react';

import SummaryPie from '../components/SummaryPie';

import CheckBoxIcon from '@mui/icons-material/CheckBoxSharp';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlankSharp';

import '../styles/Summary.css';

const SummaryHead = ({ sortColumn }) => {
  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('asc');

  const handleSortChange = (accessor) => {
    let sortOrder = 'asc';
    if (accessor === sortField) {
      sortOrder = order === 'asc' ? 'desc' : 'asc';
    }
    setSortField(accessor);
    setOrder(sortOrder);
    sortColumn(accessor, sortOrder);
  };

  return (
    <thead>
      <tr>
        <th key="check" onClick={() => handleSortChange('check')}></th>
        <th key="group" onClick={() => handleSortChange('type')}>
          Group
        </th>
        <th key="price" onClick={() => handleSortChange('totalCost')}>
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
        <td className="checkbox-column">
          {group.quantity > 0 ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
        </td>
        <td className="summary-group-column">
          {group.type}
          <div className="group-quantity">x{group.quantity}</div>
        </td>
        <td className="total-price-column">${group.totalCost.toFixed(2)}</td>
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
  useEffect(() => {
    setTableData(groups);
  }, [groups]);
  const sortColumn = (sortField, sortOrder) => {
    if (sortOrder === 'none') {
      setTableData(groups);
      return;
    }

    const sorted = [...groups].sort((a, b) => {
      if (sortField == 'check') {
        return sortOrder === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
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
      <SummaryPie data={pieData} />
    </div>
  );
};

export default Summary;
