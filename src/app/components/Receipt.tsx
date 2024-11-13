import { useEffect, useState, useRef } from 'react';
// import { getFirestore, doc, updateDoc } from 'firebase/firestore';

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

export default Receipt;
