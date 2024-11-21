import { useEffect, useState, useRef } from 'react';

import '../styles/Receipt.css';

import EditIcon from '@mui/icons-material/EditSharp';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

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

  const fields = [
    {
      column: 'quantity',
      className: 'receipt-quantity-column',
      label: 'QTY',
    },
    {
      column: 'itemName',
      className: 'receipt-item-name-column',
      label: 'ITEM',
    },
    {
      column: 'foodGroup',
      className: 'receipt-food-group-column',
      label: 'GROUP',
    },
    {
      column: 'itemPrice',
      className: 'receipt-item-price-column',
      label: 'PRICE',
    },
  ];

  return (
    <thead>
      <tr>
        {fields.map(({ column, className, label }) => (
          <th
            key={column}
            className={className}
            onClick={() => handleSortChange(`${column}`)}
          >
            {label}
            <span
              className="sort-arrow"
              style={getSortArrowStyle(`${column}`)}
            ></span>
          </th>
        ))}
      </tr>
    </thead>
  );
};

const ReceiptRow = ({ item, onUpdate }) => {
  const [editableItem, setEditableItem] = useState(item);
  const [isEditing, setIsEditing] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditableItem(item);
  }, [item]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setEditableItem((prev) => ({
          ...prev,
          [isEditing]: item[isEditing],
        }));
        setIsEditing(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  const handleEdit = (field) => {
    setIsEditing(field);
  };

  const handleInput = (fieldName, value) => {
    let updatedValue = value;

    if (fieldName === 'quantity') {
      updatedValue = Math.min(99, parseInt(value) || 0);
    } else if (fieldName === 'itemPrice') {
      updatedValue = Math.min(999.99, parseFloat(value) || 0).toFixed(2);
    } else if (fieldName === 'itemName') {
      updatedValue = value.slice(0, 50).toUpperCase();
    }

    setEditableItem((prev) => ({
      ...prev,
      [fieldName]: updatedValue,
    }));
  };

  const handleSelect = async (fieldName, value) => {
    if (editableItem[fieldName] !== value) {
      try {
        await onUpdate(item.id, fieldName, value);
        setEditableItem((prev) => ({
          ...prev,
          [fieldName]: value,
        }));
      } catch (error) {
        console.error(`Failed to update ${fieldName}:`, error);
      }
    }
  };

  const handleKeyDown = async (e, fieldName) => {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
    ];

    if (fieldName == 'quantity') {
      if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    }

    if (e.key === 'Enter' && isEditing) {
      if (editableItem[fieldName] !== item[fieldName]) {
        await onUpdate(item.id, fieldName, editableItem[fieldName]);
        handleInput(fieldName, editableItem[fieldName]);
      }
      setIsEditing(null);
    }
  };

  const fields = [
    {
      name: 'quantity',
      className: 'receipt-quantity-column',
      type: 'number',
    },
    {
      name: 'itemName',
      className: 'receipt-item-name-column',
      type: 'type',
    },
    {
      name: 'foodGroup',
      className: 'receipt-food-group-column',
      type: 'select',
    },
    {
      name: 'itemPrice',
      className: 'receipt-item-price-column',
      type: 'number',
    },
  ];

  const foodGroupOptions = [
    'Grains',
    'Vegetables',
    'Fruits',
    'Protein',
    'Dairy',
  ];

  return (
    <tr onMouseLeave={() => setIsHovered(null)}>
      {fields.map(({ name, className, type }) => (
        <td
          key={name}
          className={className}
          title={name === 'itemName' ? editableItem.itemName : undefined}
          onMouseEnter={() => setIsHovered(name)}
        >
          {isEditing === name ? (
            type === 'select' ? (
              <select
                value={editableItem[name]}
                onChange={(e) => handleSelect(name, e.target.value)}
                ref={inputRef}
                className="editable-select"
              >
                {foodGroupOptions.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type === 'number' ? 'number' : 'text'}
                value={editableItem[name]}
                min={name === 'quantity' ? '0' : undefined}
                max={
                  name === 'quantity'
                    ? '99'
                    : name === 'itemPrice'
                      ? '999.99'
                      : undefined
                }
                maxLength={name === 'itemName' ? 50 : undefined}
                step={name === 'itemPrice' ? '0.01' : undefined}
                onChange={(e) => handleInput(name, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, name)}
                ref={inputRef}
                className="editable-input"
              />
            )
          ) : (
            <div className="cell-content">
              <span className="ellipsis">
                {name === 'itemPrice'
                  ? `$${editableItem[name]}`
                  : editableItem[name]}
              </span>
              {isHovered === name && (
                <EditIcon
                  className="edit-icon"
                  onClick={() => handleEdit(name)}
                />
              )}
            </div>
          )}
        </td>
      ))}
    </tr>
  );
};

const ReceiptTable = ({
  groceries,
  onUpdate,
  filterText,
  sortColumn,
  page,
  itemsPerPage,
}) => {
  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroceries = groceries.slice(startIndex, endIndex);

  const rows = [];

  paginatedGroceries.forEach((item) => {
    if (item.itemName.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    rows.push(<ReceiptRow key={item.id} item={item} onUpdate={onUpdate} />);
  });

  return (
    <table className="receipt-component-table">
      <ReceiptHead sortColumn={sortColumn} />
      <tbody className="receipt-component-body">{rows}</tbody>
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

const Receipt = ({ groceries, onUpdate }) => {
  const [tableData, setTableData] = useState(groceries);
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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
    <div>
      <div className="receipt-component-head">
        <h1>Receipt</h1>
        <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      </div>
      <ReceiptTable
        groceries={tableData}
        onUpdate={onUpdate}
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

export default Receipt;
