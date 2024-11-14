'use client';

// pages/BudgetBytePage.js
import React, { useRef, useEffect, useState, useMemo } from 'react';
import Head from 'next/head';
import EditIcon from '@mui/icons-material/EditOutlined';
import './landing.css';
import { useRouter } from 'next/navigation';
import GroceryData from './groceries.json';
// import Summary from './components/Summary';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { PieChart } from '@mui/x-charts/PieChart';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const SummaryPie = ({ data }) => {
  return (
    <PieChart
      series={[
        {
          data: data,
          arcLabel: (item) => `${item.value}%`,
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      height={350}
      width={350}
    />
  );
};




// import '../styles/Summary.css';

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

const Summary = ({ data, totalAmount }) => {
  const colorMap = {
    Fruits: 'red',
    Vegetables: 'green',
    Protein: 'purple',
    Grains: 'orange',
    Dairy: 'blue',
  };

  const pieData = useMemo(
    () =>
      data
        .map((item) => ({
          label: item.type,
          value: item.pricePercentage,
          color: colorMap[item.type],
        }))
        .sort((a, b) => b.value - a.value),
    [data],
  );

  const chartData = {
    labels: pieData.map((item) => item.label),
    datasets: [
      {
        data: pieData.map((item) => item.value),
        backgroundColor: pieData.map((item) => item.color),
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="summary-card">
      <h2>Summary</h2>
      <div className="chart-legend-container">
        <div className="doughnut-chart">
          <Doughnut
            data={chartData}
            options={{
              cutout: '80%',
              plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
              },
            }}
          />
          <div className="doughnut-center">
            <h2>${totalAmount}</h2>
          </div>
        </div>
        <div className="food-group-legend">
          {pieData.map((item) => (
            <div key={item.label} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="legend-label">{item.label}</span>
              <span className="legend-percentage">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


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

  const getSortArrowStyle = (accessor) => {
    if (sortField !== accessor)
      return { borderTopColor: 'black', transform: 'rotate(0deg)' };

    const color =
      order === 'asc' ? 'green' : order === 'desc' ? 'red' : 'black';
    const rotation = order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)';

    return {
      borderTopColor: color,
      transform: rotation,
    };
  };

  return (
    <thead>
      <tr>
        <th
          key="quantity"
          className="quantity-column"
          onClick={() => handleSortChange('quantity')}
        >
          QTY
          <span
            className="sort-arrow"
            style={getSortArrowStyle('quantity')}
          ></span>
        </th>
        <th
          key="itemName"
          className="item-name-column"
          onClick={() => handleSortChange('itemName')}
        >
          ITEM
          <span
            className="sort-arrow"
            style={getSortArrowStyle('itemName')}
          ></span>
        </th>
        <th
          key="group"
          className="group-column"
          onClick={() => handleSortChange('foodGroup')}
        >
          GROUP
          <span
            className="sort-arrow"
            style={getSortArrowStyle('foodGroup')}
          ></span>
        </th>
        <th
          key="price"
          className="price-column"
          onClick={() => handleSortChange('itemPrice')}
        >
          PRICE
          <span
            className="sort-arrow"
            style={getSortArrowStyle('itemPrice')}
          ></span>
        </th>
      </tr>
    </thead>
  );
};

const ReceiptRow = ({ item, onUpdate }) => {
  const [editableItem, setEditableItem] = useState(item);
  const [isEditing, setIsEditing] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  const [tempEditValue, setTempEditValue] = useState(null);
  const inputRef = useRef(null);

  const handleEdit = (field) => {
    setIsEditing(field);
    setTempEditValue(editableItem[field]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setTempEditValue((prev) => ({
        ...prev,
        [isEditing]: tempEditValue,
      }));
      setIsEditing(null);
    }
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setTempEditValue(null);
      setIsEditing(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (field, value) => {
    setEditableItem((prev) => ({
      ...prev,
      [field]: field === 'itemPrice' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleBlur = async () => {
    // onUpdate(editableItem);
    setTempEditValue(null);
    setIsEditing(null);
  };

  return (
    <tr onMouseLeave={() => setIsHovered(null)}>
      <td
        className="quantity-column"
        onMouseEnter={() => setIsHovered('quantity')}
      >
        {isEditing === 'quantity' ? (
          <input
            type="number"
            value={editableItem.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="editable-input"
          />
        ) : (
          <>
            {editableItem.quantity}
            {isHovered === 'quantity' && (
              <EditIcon
                className="edit-icon"
                onClick={() => handleEdit('quantity')}
              />
            )}
          </>
        )}
      </td>
      <td
        className="item-name-column"
        onMouseEnter={() => setIsHovered('itemName')}
      >
        {isEditing === 'itemName' ? (
          <input
            type="text"
            value={editableItem.itemName}
            onKeyDown={handleKeyDown}
            onChange={(e) => handleChange('itemName', e.target.value)}
            onBlur={handleBlur}
            className="editable-input"
          />
        ) : (
          <>
            {editableItem.itemName}
            {isHovered === 'itemName' && (
              <EditIcon
                className="edit-icon"
                onClick={() => handleEdit('itemName')}
              />
            )}
          </>
        )}
      </td>
      <td className="food-group-column">{editableItem.foodGroup}</td>
      <td
        className="price-column"
        onMouseEnter={() => setIsHovered('itemPrice')}
      >
        {isEditing === 'itemPrice' ? (
          <input
            type="number"
            value={editableItem.itemPrice}
            onChange={(e) => handleChange('itemPrice', e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="editable-input"
          />
        ) : (
          <>
            ${editableItem.itemPrice.toFixed(2)}
            {isHovered === 'itemPrice' && (
              <EditIcon
                className="edit-icon"
                onClick={() => handleEdit('itemPrice')}
              />
            )}
          </>
        )}
      </td>
    </tr>
  );
};

const ReceiptTable = ({
  groceries,
  filterText,
  sortColumn,
  page,
  itemsPerPage,
}) => {
  // const db = getFirestore();
  //
  // const updateItemInFirebase = async (updatedItem) => {
  //   try {
  //     const itemDocRef = doc(db, 'receiptData', 'groceries', updatedItem.id);
  //     await updateDoc(itemDocRef, updatedItem);
  //     console.log('Item updated successfully');
  //   } catch (error) {
  //     console.error('Error updating item in Firebase:', error);
  //   }
  // };

  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroceries = groceries.slice(startIndex, endIndex);

  const rows = [];

  paginatedGroceries.forEach((item) => {
    if (item.itemName.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    rows.push(<ReceiptRow key={item.itemName} item={item} />);
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
    <div className="search-bar-container">
      <input
        className="search-bar"
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
    </div>
  );
};

const Receipt = ({ groceries }) => {
  const [tableData, setTableData] = useState(groceries);
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setTableData(groceries);
  }, [groceries]);

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

  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setPage(0);
  };

  const startItem = page * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, tableData.length);

  return (
    <div className="receipt-card">
      <div className="receipt-head">
        <h1>Receipt</h1>
        <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      </div>
      <ReceiptTable
        groceries={tableData}
        filterText={filterText}
        sortColumn={sortColumn}
        page={page}
        itemsPerPage={itemsPerPage}
      />
      <div className="pagination-controls">
        <div className="rows-per-page">
          <label htmlFor="rowsPerPage">Rows per page:</label>
          <select
            id="rowsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <button onClick={handlePreviousPage} disabled={page === 0}>
          <KeyboardArrowLeftIcon fontSize="large" />
        </button>
        <span>
          {startItem}-{endItem} of {tableData.length} items
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages - 1}>
          <KeyboardArrowRightIcon fontSize="large" />
        </button>
      </div>
    </div>
  );
};





const SummaryData = {
  "foodGroups": [
    {
      "type": "Fruits",
      "quantity": 5,
      "totalCost": 3.06,
      "pricePercentage": 18.3
    },
    {
      "type": "Vegetables",
      "quantity": 0,
      "totalCost": 0.0,
      "pricePercentage": 0
    },
    {
      "type": "Grains",
      "quantity": 1,
      "totalCost": 2.49,
      "pricePercentage": 14.9
    },
    {
      "type": "Protein",
      "quantity": 2,
      "totalCost": 8.58,
      "pricePercentage": 51.5
    },
    {
      "type": "Dairy",
      "quantity": 1,
      "totalCost": 2.5,
      "pricePercentage": 15.0
    }
  ],
  "summary": {
    "totalCount": 6,
    "totalCost": 16.63
  }};

  const groceries = [
    { itemName: 'Apple', quantity: 3, foodGroup: 'Fruit', itemPrice: 0.72 },
    { itemName: 'Banana', quantity: 2, foodGroup: 'Fruit', itemPrice: 0.45 },
    { itemName: 'Bread', quantity: 1, foodGroup: 'Grains', itemPrice: 2.49 },
    { itemName: 'Eggs', quantity: 2, foodGroup: 'Protein', itemPrice: 4.49 },
    { itemName: 'Milk', quantity: 1, foodGroup: 'Dairy', itemPrice: 2.50 } 
  ];
  


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
      <div className="page">
        <div className="titleContainer">
          <h1 className="h1">BUDGET BYTE</h1>
          <button className="loginButton" onClick={handleLogin}>
            LOGIN
          </button>
        </div>
        <div className="container">
          <div className="leftSection">
            <h2 className="slogan">Your Website For Health and Wealth</h2>
            {/* <h2> Track Your Spending, Boost Your Health</h2> */}
            <ul className="featuresList">
              <li><strong>Classify Your Grocieries:</strong> AI automatically sorts items into food foodGroups</li>
              <li><strong>Understand Your Spending:</strong> Get a breakdown of expenses by food category</li>
              <li><strong>Monthly Insights:</strong> Create an account for personalized summaries and spending trends.</li>
            </ul>
            <button className="scanButton" onClick={handleLogin}>UPLOAD RECEIPT</button>
          </div>
          <div className="rightSection">
            <Summary
              data={SummaryData.foodGroups}
              totalAmount={SummaryData.summary.totalCost}
            />
            <div className="receipt-container">
            <Receipt groceries={groceries} />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
