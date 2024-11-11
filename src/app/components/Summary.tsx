import React, { useState, useEffect, useMemo } from 'react';

import SummaryPie from '../components/SummaryPie';

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
        <th key="select" className="select-column"></th>
        <th
          key="group"
          className="group-column"
          onClick={() => handleSortChange('type')}
        >
          Group
          <span className="sort-arrow"></span>
        </th>
        <th
          key="quantity"
          className="quantity-column"
          onClick={() => handleSortChange('quantity')}
        >
          QTY
          <span className="sort-arrow"></span>
        </th>
        <th
          key="price"
          className="price-column"
          onClick={() => handleSortChange('totalCost')}
        >
          Price
          <span className="sort-arrow"></span>
        </th>
        <th
          key="price-percent"
          className="price-percent-column"
          onClick={() => handleSortChange('pricePercentage')}
        >
          Price %<span className="sort-arrow"></span>
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
        <td className="select-column">
          <input type="checkbox" />
        </td>
        <td className="group-column">{group.type}</td>
        <td className="quantity-column">{group.quantity}</td>
        <td className="price-column">${group.totalCost.toFixed(2)}</td>
        <td className="price-percent-column">{group.pricePercentage}%</td>
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

  // const pieData = tableData.map((group) => ({
  //   name: group.type.toUpperCase(),
  //   value: group.pricePercentage,
  // }));
  const pieData = useMemo(
    () =>
      groups.map((group) => ({
        name: group.type.toUpperCase(),
        value: group.pricePercentage,
      })),
    [groups],
  );

  const sortColumn = (sortField, sortOrder) => {
    if (sortOrder === 'none') {
      setTableData(groups);
      return;
    }

    const sorted = [...groups].sort((a, b) => {
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

  return (
    <div className="summary-container">
      <div className="summary-table-container">
        <h1>Summary</h1>
        <SummaryTable groups={tableData} sortColumn={sortColumn} />
      </div>
      <div className="pie-chart-container">
        <SummaryPie data={pieData} />
      </div>
    </div>
  );
};

export default Summary;
