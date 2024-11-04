'use client';

// pages/BudgetBytePage.js
import React, { useState } from 'react';
import Head from 'next/head';
import EditIcon from '@mui/icons-material/EditOutlined';
import './landing.css';
import { useRouter } from 'next/navigation';
import GroceryData from './groceries.json';
import Summary from './components/Summary';

export enum FoodTypes {
  Veggies = 'Veggies',
  Fruits = 'Fruits',
  Grain = 'Grain',
  Protein = 'Protein',
  Dairy = 'Dairy',
}

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
      <td className="quantity-column">{item.quantity}</td>
      <td className="item-name-column">
        {item.itemName}
        <EditIcon />
      </td>
      <td className="group-column">{item.group}</td>
      <td className="price-column">${item.price.toFixed(2)}</td>
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
      <colgroup>
        <col style={{ width: '15%' }} />
        <col style={{ width: '40%' }} />
        <col style={{ width: '25%' }} />
        <col style={{ width: '20%' }} />
      </colgroup>

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
        <h1>Receipt</h1>
        <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      </div>
      <ReceiptTable
        groceries={tableData}
        filterText={filterText}
        sortColumn={sortColumn}
      />
    </div>
  );
};

const Receipt = ({ groceries }) => {
  return (
    <div className="receipt">
      <FilterableReceipt groceries={groceries} />
    </div>
  );
};

export default function BudgetBytePage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div>
      <Head>
        <title>Budget Byte</title>
      </Head>
      <div className="topContainer">
        <h1 className="heading">BUDGET BYTE</h1>
        <button onClick={handleLogin} className="loginButton">LOGIN</button>
      </div>
      <div>
        <div>

          <div className="background">
            <h2>Your Website for Health and Wealth</h2>
            <p>
              Scan your receipt from your most recent grocery trip
            </p>
          </div>

          
            {/* <p>
              Scan your receipt from your most recent grocery trip
            </p> */}
            <div className="buttonBackground">
              <button className="scanButton">SCAN RECEIPT</button>
            </div>
            <div className="receiptTrial">
            <div className="section-container">
              <Summary
              groups={[
                  {
                    type: FoodTypes.Veggies,
                    totalCost: 80,
                    quantity: 4,
                    pricePercentage: 18.8,
                  },
                  {
                    type: FoodTypes.Fruits,
                    totalCost: 50,
                    quantity: 3,
                    pricePercentage: 11.1,
                  },
                  {
                    type: FoodTypes.Grain,
                    totalCost: 60,
                    quantity: 5,
                    pricePercentage: 13.3,
                  },
                  {
                    type: FoodTypes.Protein,
                    totalCost: 200,
                    quantity: 3,
                    pricePercentage: 44.4,
                  },
                  {
                    type: FoodTypes.Dairy,
                    totalCost: 60,
                    quantity: 2,
                    pricePercentage: 13.3,
                  },
                ]
              }
              />
                <Receipt groceries={[
    {
      "itemName": "bagels",
      "group": "grains",
      "price": 4.66,
      "quantity": 1,
      "totalPrice": 4.66
    },
    {
      "itemName": "cheese",
      "group": "dairy",
      "price": 3.45,
      "quantity": 2,
      "totalPrice": 6.9
    },
    {
      "itemName": "apples",
      "group": "fruits",
      "price": 1.99,
      "quantity": 3,
      "totalPrice": 5.97
    }
  ]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
