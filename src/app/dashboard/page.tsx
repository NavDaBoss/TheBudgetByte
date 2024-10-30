'use client';

import React, { useState } from 'react';

import './dashboard.css';

import EditIcon from '@mui/icons-material/EditOutlined';

import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import GroceryData from './groceries.json';
import SummaryData from './food_summary.json';

const ReceiptHead = ({ sortColumn }) => {
  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('asc');

  const handleSortChange = (accessor) => {
    let sortOrder = 'asc';
    if (accessor === sortField) {
      sortOrder = order === 'asc' ? 'desc' : order === 'desc' ? 'none' : 'asc';
    }
    setSortField(accessor);
    setOrder(sortOrder);
    sortColumn(accessor, sortOrder);
  };

  return (
    <thead className="receipt-table-head">
      <tr>
        <th key="quantity" onClick={() => handleSortChange('quantity')}>
          QTY
        </th>
        <th key="itemName" onClick={() => handleSortChange('itemName')}>
          ITEM
        </th>
        <th key="group" onClick={() => handleSortChange('group')}>
          GROUP
        </th>
        <th key="price" onClick={() => handleSortChange('price')}>
          PRICE
        </th>
      </tr>
    </thead>
  );
};

const ReceiptRow = ({ item }) => {
  return (
    <tr>
      <td className="quantityColumn">{item.quantity}</td>
      <td className="itemNameColumn">{item.itemName}</td>
      <td className="groupColumn">
        {item.group}
        <EditIcon />
      </td>
      <td className="priceColumn">${item.price.toFixed(2)}</td>
    </tr>
  );
};

const ReceiptTable = ({ groceries, filterText, sortColumn }) => {
  const rows = [];

  groceries.map((item) => {
    if (item.itemName.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    rows.push(<ReceiptRow item={item} key={item.itemName} />);
  });

  return (
    <table className="receipt-table">
      <ReceiptHead sortColumn={sortColumn} />
      <tbody className="receipt-body">{rows}</tbody>
    </table>
  );
};

const SearchBar = ({ filterText, onFilterTextChange }) => {
  return (
    <input
      className="search-bar"
      type="text"
      value={filterText}
      placeholder="Search..."
      onChange={(e) => onFilterTextChange(e.target.value)}
    />
  );
};

const FilterableReceipt = ({ groceries }) => {
  const [tableData, setTableData] = useState(groceries);
  const [filterText, setFilterText] = useState('');

  const sortColumn = (sortField, sortOrder) => {
    if (sortOrder === 'none') {
      setTableData(groceries);
      return;
    }

    if (sortField) {
      const sorted = [...groceries].sort((a, b) => {
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
    }
  };

  return (
    <div>
      <div className="receipt-head">
        <p>Grocery Trip #0001 for Eric</p>
        <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      </div>
      <ReceiptTable
        groceries={tableData}
        filterText={filterText}
        sortColumn={sortColumn}
      />
      <Summary groups={SummaryData.foodGroups} />
    </div>
  );
};

const CurrentDate = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="receipt-date">
      <h2>{formattedDate}</h2>
    </div>
  );
};

const Receipt = ({ groceries }) => {
  return (
    <div className="receipt">
      <div className="receipt-title">
        <CurrentDate />
      </div>
      <FilterableReceipt groceries={groceries} />
    </div>
  );
};

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="section-container">
        <Receipt groceries={GroceryData.groceries} />
      </div>
    </div>
  );
};

export default Dashboard;
