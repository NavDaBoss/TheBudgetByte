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
        <th
          key="group"
          className="group-column"
          onClick={() => handleSortChange('foodGroup')}
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

const SummaryTable = ({ foodGroups, sortColumn }) => {
  const rows = [];

  foodGroups.map((foodGroup) => {
    rows.push(
      <tr key={foodGroups.foodGroup}>
        <td className="group-column">{foodGroup.foodGroup}</td>
        <td className="quantity-column">{foodGroup.quantity}</td>
        <td className="price-column">${foodGroup.totalCost.toFixed(2)}</td>
        <td className="price-percent-column">{foodGroup.pricePercentage}%</td>
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

const Summary = ({ foodGroups }) => {
  const [tableData, setTableData] = useState(foodGroups);

  useEffect(() => {
    setTableData(foodGroups);
  }, [foodGroups]);

  const pieData = useMemo(
    () =>
      foodGroups
        .map((foodGroup) => ({
          label: foodGroup.quantity != 0 ? foodGroup.foodGroup : '',
          value: foodGroup.pricePercentage,
        }))
        .filter((item) => item.label !== ''),
    [foodGroups],
  );

  const sortColumn = (sortField, sortOrder) => {
    if (sortOrder === 'none') {
      setTableData(foodGroups);
      return;
    }

    const sorted = [...foodGroups].sort((a, b) => {
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
        <SummaryTable foodGroups={tableData} sortColumn={sortColumn} />
      </div>
      <div className="pie-chart-container">
        <SummaryPie data={pieData} />
      </div>
    </div>
  );
};

export default Summary;
