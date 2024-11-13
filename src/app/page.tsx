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

// types.ts
export interface GroceryItem {
  itemName: string;
  group: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface SortColumnProps {
  sortField: string;
  sortOrder: 'asc' | 'desc' | 'none';
}

export interface SummaryGroup {
  type: FoodTypes;
  totalCost: number;
  quantity: number;
  pricePercentage: number;
}

interface RecieptHeadProps {
  sortColumn: (accessor: string, sortOrder: 'asc' | 'desc' | 'none') => void;
}

const ReceiptHead: React.FC<RecieptHeadProps> = ({ sortColumn }) => {
  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('asc');

  const handleSortChange = (accessor: string) => {
    let sortOrder: 'asc' | 'desc' | 'none' = 'asc';
    if (accessor === sortField) {
      sortOrder = order === 'asc' ? 'desc' : order === 'desc' ? 'none' : 'asc';
    }
    setSortField(accessor);
    setOrder(sortOrder);
    sortColumn(accessor, sortOrder);
  };

  return (
    <thead className="landing-receipt-table-head">
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

interface ReceiptRowProps {
  item: GroceryItem;
}

const ReceiptRow: React.FC<ReceiptRowProps> = ({ item }) => {
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

interface ReceiptTableProps {
  groceries: GroceryItem[];
  filterText: string;
  sortColumn: (accessor: string, sortOrder: 'asc' | 'desc' | 'none') => void;
}

const ReceiptTable: React.FC<ReceiptTableProps> = ({
  groceries,
  filterText,
  sortColumn,
}) => {
  const rows = groceries
    .filter((item) =>
      item.itemName.toLowerCase().includes(filterText.toLowerCase()),
    )
    .map((item) => <ReceiptRow item={item} key={item.itemName} />);

  return (
    <table className="landing-receipt-table">
      <colgroup>
        <col style={{ width: '15%' }} />
        <col style={{ width: '40%' }} />
        <col style={{ width: '25%' }} />
        <col style={{ width: '20%' }} />
      </colgroup>

      <ReceiptHead sortColumn={sortColumn} />
      <tbody className="landing-receipt-body">{rows}</tbody>
    </table>
  );
};

interface SearchBarProps {
  filterText: string;
  onFilterTextChange: (text: string) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({
  filterText,
  onFilterTextChange,
}) => {
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

interface FilterableRecieptProps {
  groceries: GroceryItem[];
}

const FilterableReceipt: React.FC<FilterableRecieptProps> = ({ groceries }) => {
  const [tableData, setTableData] = useState(groceries);
  const [filterText, setFilterText] = useState('');

  const sortColumn = (
    sortField: string,
    sortOrder: 'asc' | 'desc' | 'none',
  ) => {
    if (sortOrder === 'none') {
      setTableData(groceries);
      return;
    }

    if (sortField) {
      const sorted = [...groceries].sort((a, b) => {
        if (typeof a[sortField as keyof GroceryItem] === 'number') {
          return (
            ((a[sortField as keyof GroceryItem] as number) -
              (b[sortField as keyof GroceryItem] as number)) *
            (sortOrder === 'asc' ? 1 : -1)
          );
        }
        return (
          a[sortField as keyof GroceryItem]
            .toString()
            .localeCompare(b[sortField as keyof GroceryItem].toString(), 'en', {
              numeric: true,
            }) * (sortOrder === 'asc' ? 1 : -1)
        );
      });
      setTableData(sorted);
    }
  };

  return (
    <div>
      <div className="landing-receipt-head">
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

interface ReceiptProps {
  groceries: GroceryItem[];
}

const Receipt: React.FC<ReceiptProps> = ({ groceries }) => {
  return (
    <div className="landing-receipt">
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
      <div className="titleContainer">
        <h1 className="h1">BUDGET BYTE</h1>
        <button className="loginButton" onClick={handleLogin}>
          LOGIN
        </button>
      </div>
      <div className="container">
        <div className="leftSection">
          <h2 className="slogan">Your Website For Health and Wealth</h2>
          <ul className="featuresList">
            <li>
              Scan your grocery receipt to classify purchased foods into food
              groups
            </li>

            <li>See how much you spend in each food group</li>
            <li>
              Create an account to get a monthly summary of your grocery
              expenses
            </li>
          </ul>

          <div className="buttonGroup">
            <button className="scanButton">SCAN RECEIPT</button>
          </div>
        </div>
        <div className="rightSection">
          <Summary
            data={[
              {
                type: 'Vegetables',
                totalCost: 80,
                quantity: 4,
                pricePercentage: 18.8,
              },
              {
                type: 'Fruits',
                totalCost: 50,
                quantity: 3,
                pricePercentage: 11.1,
              },
              {
                type: 'Grains',
                totalCost: 60,
                quantity: 5,
                pricePercentage: 13.3,
              },
              {
                type: 'Protein',
                totalCost: 200,
                quantity: 3,
                pricePercentage: 44.4,
              },
              {
                type: 'Dairy',
                totalCost: 60,
                quantity: 2,
                pricePercentage: 13.3,
              },
            ]}
          />
          <Receipt
            groceries={[
              {
                itemName: 'bagels',
                group: 'grains',
                price: 4.66,
                quantity: 1,
                totalPrice: 4.66,
              },
              {
                itemName: 'cheese',
                group: 'dairy',
                price: 3.45,
                quantity: 2,
                totalPrice: 6.9,
              },
              {
                itemName: 'apples',
                group: 'fruits',
                price: 1.99,
                quantity: 3,
                totalPrice: 5.97,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
