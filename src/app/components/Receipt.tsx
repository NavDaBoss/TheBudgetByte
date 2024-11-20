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
    { column: 'quantity', className: 'receipt-quantity-column', label: 'QTY' },
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
    { column: 'itemPrice', className: 'receipt-price-column', label: 'PRICE' },
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
  const [tempEditValue, setTempEditValue] = useState(null);

  const handleEdit = (field) => {
    setIsEditing(field);
    setTempEditValue(editableItem[field]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isEditing) {
      setTempEditValue((prev) => ({
        ...prev,
        [isEditing]: tempEditValue,
      }));
      setIsEditing(null);
    }
  };

  const handleChange = (field, value) => {
    setEditableItem((prev) => ({
      ...prev,
      [field]: field === 'itemPrice' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleBlur = async () => {
    setTempEditValue(null);
    setIsEditing(null);
  };

  const fields = [
    { name: 'quantity', type: 'number' },
    { name: 'itemName', type: 'type' },
    { name: 'foodGroup', type: 'select' },
    { name: 'itemPrice', type: 'number', prefix: '$' },
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
      {fields.map(({ name, type, prefix }) => (
        <td
          key={name}
          className={`receipt-${name}-column`}
          onMouseEnter={() => setIsHovered(name)}
        >
          {isEditing === name ? (
            type === 'select' ? (
              <select
                value={editableItem[name]}
                onChange={(e) => handleChange(name, e.target.value)}
                onBlur={() => handleBlur(name)}
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
                type={type}
                value={editableItem[name]}
                onChange={(e) => handleChange(name, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, name)}
                onBlur={() => handleBlur(name)}
                className="editable-input"
              />
            )
          ) : (
            <>
              {prefix && name === 'itemPrice'
                ? `${prefix}${editableItem[name].toFixed(2)}`
                : editableItem[name]}
              {isHovered === name && (
                <EditIcon
                  className="edit-icon"
                  onClick={() => handleEdit(name)}
                />
              )}
            </>
          )}
        </td>
      ))}
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

const Receipt = ({ groceries }) => {
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
