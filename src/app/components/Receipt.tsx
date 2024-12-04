import { useEffect, useState, useRef, FC } from 'react';

import OcrUploadButton from '../components/OcrUploadButton';
import '../styles/Receipt.css';

import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/EditSharp';
import {
  updateOverviewWhenFoodGroupChanged,
  updateOverviewWhenPriceChanged,
  updateOverviewWhenQuantityChanged,
} from '../backend/yearlyOverview/updateYearlyData';
import { FoodTypes } from '../backend/yearlyOverview/yearlyOverviewInterface';

interface GroceryItem {
  id: string;
  itemName: string;
  itemPrice: number;
  foodGroup: FoodTypes;
  quantity: number;
}

interface ReceiptProps {
  groceries: GroceryItem[];
  onUpload: () => void;
  onUpdate: (
    id: string,
    fieldName: keyof GroceryItem,
    value: string | number,
  ) => Promise<void>;
  onAdd: (item: Omit<GroceryItem, 'id'>) => void;
  onDelete: (id: string) => void;
  receiptDate: string;
}

interface ReceiptHeadProps {
  sortColumn: (field: string, order: 'asc' | 'desc' | 'none') => void;
  toggleAddForm: () => void;
}

interface ReceiptRowProps {
  item: GroceryItem;
  onUpdate: (
    id: string,
    fieldName: keyof GroceryItem,
    value: string | number,
  ) => Promise<void>;
  onDelete: (id: string) => void;
  receiptDate: string;
}

interface AddItemFormProps {
  onClose: () => void;
  onAdd: (item: Omit<GroceryItem, 'id'>) => void;
  receiptDate: string;
}

interface SearchBarProps {
  filterText: string;
  onFilterTextChange: (text: string) => void;
}

const foodGroupOptions: FoodTypes[] = [
  'Grains',
  'Vegetables',
  'Fruits',
  'Protein',
  'Dairy',
];

const ReceiptHead: FC<ReceiptHeadProps> = ({ sortColumn, toggleAddForm }) => {
  const [sortField, setSortField] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc' | 'none'>('asc');

  const handleSortChange = (accessor: string) => {
    let sortOrder: 'asc' | 'desc' | 'none' = 'asc';
    if (accessor === sortField) {
      sortOrder = order === 'asc' ? 'desc' : order === 'desc' ? 'none' : 'asc';
    }
    setSortField(accessor);
    setOrder(sortOrder);
    sortColumn(accessor, sortOrder);
  };

  const getSortArrowStyle = (accessor: string) => {
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
      label: 'ITEM PRICE',
    },
    {
      column: 'deleteItem',
      className: 'receipt-item-delete-column',
      label: '',
    },
  ];

  return (
    <thead>
      <tr>
        {fields.map(({ column, className, label }) => (
          <th
            key={column}
            className={className}
            onClick={
              column !== 'deleteItem'
                ? () => handleSortChange(`${column}`)
                : undefined
            }
          >
            <div className="table-header-content">
              {column !== 'deleteItem' ? (
                <>
                  {label}
                  {column == 'itemName' && (
                    <AddBoxIcon
                      className="add-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAddForm();
                      }}
                    />
                  )}
                  <span
                    className="sort-arrow"
                    style={getSortArrowStyle(`${column}`)}
                  ></span>
                </>
              ) : null}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

const ReceiptRow: FC<ReceiptRowProps> = ({
  item,
  onUpdate,
  onDelete,
  receiptDate,
}) => {
  const [editableItem, setEditableItem] = useState<GroceryItem>(item);
  const [isEditing, setIsEditing] = useState<keyof GroceryItem | null>(null);
  const [isHovered, setIsHovered] = useState<keyof GroceryItem | null>(null);
  const [activeField, setActiveField] = useState(null);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    setEditableItem(item);
  }, [item]);

  const handleDelete = () => {
    updateOverviewWhenFoodGroupChanged(
      receiptDate,
      /* old food group */ item.foodGroup,
      /* new food group */ 'Uncategorized' as FoodTypes,
      item.itemPrice * item.quantity,
      item.quantity,
    );
    onDelete(item.id);
  };

  const handleSelect = async (
    fieldName: keyof GroceryItem,
    value: string | number,
  ) => {
    if (editableItem[fieldName] !== value) {
      try {
        await onUpdate(item.id, fieldName, value);
        updateOverviewWhenFoodGroupChanged(
          receiptDate,
          item.foodGroup,
          value,
          item.itemPrice * item.quantity,
          item.quantity,
        );
        setEditableItem((prev) => ({
          ...prev,
          [fieldName]: value,
        }));
      } catch (error) {
        console.error(`Failed to update ${fieldName}:`, error);
      }
    }
  };

  const handleInput = (
    fieldName: keyof GroceryItem,
    value: string | number,
  ) => {
    let updatedValue: string | number = value;
    if (fieldName === 'quantity') {
      if (value === '') {
        updatedValue = '';
      } else {
        updatedValue = Math.min(99, parseInt(value) || 0);
      }
    } else if (fieldName === 'itemPrice') {
      if (value == '') {
        updatedValue = '';
      } else if (/^\d*\.?\d{0,2}$/.test(value)) {
        const floatValue = parseFloat(value);
        updatedValue = floatValue > 999.99 ? 999.99 : floatValue;
      }
    } else if (fieldName === 'itemName') {
      updatedValue = value.slice(0, 50).toUpperCase();
    }

    setEditableItem((prev) => ({
      ...prev,
      [fieldName]: updatedValue,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        document.activeElement !== inputRef.current
      ) {
        setActiveField(null);
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
  }, [isEditing, item]);

  const handleBlur = (fieldName, value) => {
    setIsEditing(null);
    if (editableItem[fieldName] !== value) {
      handleSelect(fieldName, value);
    }
  };

  const handleFieldClick = (field) => {
    setActiveField((prev) => (prev === field ? null : field));
  };

  const handleEdit = (field) => {
    setIsEditing(field);
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
    } else if (fieldName === 'itemPrice') {
      if (!allowedKeys.includes(e.key, '.') && !/^\d*\.?\d{0,2}$/.test(e.key)) {
        e.preventDefault();
      }
    }

    if (e.key === 'Enter' && isEditing) {
      let value = editableItem[fieldName];
      if (fieldName === 'quantity' && value === '') {
        value = 0;
      } else if (fieldName === 'itemPrice' && value === '') {
        value = 0.0;
      } else if (fieldName === 'itemPrice') {
        value = parseFloat(value).toFixed(2);
      }
      if (value !== item[fieldName]) {
        await onUpdate(item.id, fieldName, value);
      }
      handleInput(fieldName, value);
      if (fieldName === 'itemPrice') {
        updateOverviewWhenPriceChanged(
          receiptDate,
          item.foodGroup,
          /* new item price = */ value,
          /* old item price = */ item.itemPrice,
          item.quantity,
        );
      } else if (fieldName === 'quantity') {
        updateOverviewWhenQuantityChanged(
          receiptDate,
          item.foodGroup,
          /* new quantity price = */ value,
          /* old quantity price = */ item.quantity,
          item.itemPrice,
        );
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
      type: 'text',
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

  return (
    <tr onMouseLeave={() => setIsHovered(null)}>
      {fields.map(({ name, className, type }) => (
        <td
          key={name}
          className={className}
          title={name === 'itemName' ? editableItem.itemName : undefined}
          onMouseEnter={() => setIsHovered(name)}
          onClick={() => handleFieldClick(name)}
        >
          {isEditing === name ? (
            type === 'select' ? (
              <select
                value={editableItem[name]}
                onChange={(e) => handleSelect(name, e.target.value)}
                onBlur={(e) => handleBlur(name, e.target.value)}
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
                min={
                  name === 'quantity' && editableItem[name] !== ''
                    ? '0'
                    : undefined
                }
                max={
                  name === 'quantity'
                    ? 99
                    : name === 'itemPrice'
                      ? 999.99
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
            <div className="cell-item-content">
              <span className="cell-item-name">
                {name === 'itemPrice'
                  ? `$${Number(editableItem[name]).toFixed(2)}`
                  : editableItem[name]}
                {(isHovered === name || activeField == name) && (
                  <>
                    <EditIcon
                      className="edit-icon"
                      onClick={() => handleEdit(name)}
                    />
                  </>
                )}
              </span>
            </div>
          )}
        </td>
      ))}
      <td className="receipt-item-delete-column">
        <DeleteIcon className="delete-icon" onClick={() => handleDelete()} />
      </td>
    </tr>
  );
};

const SearchBar: FC<SearchBarProps> = ({ filterText, onFilterTextChange }) => {
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

const AddItemForm: FC<AddItemFormProps> = ({ onClose, onAdd, receiptDate }) => {
  const [newItem, setNewItem] = useState({
    itemName: '',
    quantity: 1,
    itemPrice: 0.0,
    foodGroup: 'Uncategorized',
  });

  const handleInputChange = (field, value) => {
    let updatedValue = value;

    if (field === 'quantity') {
      if (value === '') {
        updatedValue = '';
      } else {
        updatedValue = Math.min(99, parseInt(value) || 0);
      }
    } else if (field === 'itemPrice') {
      if (value == '') {
        updatedValue = '';
      } else if (/^\d*\.?\d{0,2}$/.test(value)) {
        const floatValue = parseFloat(value);
        updatedValue = floatValue > 999.99 ? 999.99 : floatValue;
      }
    } else if (field === 'itemName') {
      updatedValue = value.slice(0, 50).toUpperCase();
    }

    setNewItem((prev) => ({ ...prev, [field]: updatedValue }));
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
    } else if (fieldName === 'itemPrice') {
      if (!allowedKeys.includes(e.key, '.') && !/^\d*\.?\d{0,2}$/.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  const handleSubmit = () => {
    if (newItem.itemName && newItem.itemPrice > 0) {
      onAdd(newItem);
      updateOverviewWhenFoodGroupChanged(
        receiptDate,
        /* old food group */ 'Uncategorized' as FoodTypes,
        /* new food group */ newItem.foodGroup as FoodTypes,
        newItem.itemPrice * newItem.quantity,
        newItem.quantity,
      );
      onClose();
    } else {
      alert('Please fill in all fields with valid values.');
    }
  };

  const fields = [
    {
      label: 'Item Name',
      field: 'itemName',
      type: 'text',
      placeholder: 'Apples',
    },
    {
      label: 'Quantity',
      field: 'quantity',
      type: 'number',
      placeholder: '1',
    },
    {
      label: 'Item Price',
      field: 'itemPrice',
      type: 'number',
      placeholder: '0.00',
    },
    {
      label: 'Food Group',
      field: 'foodGroup',
      type: 'select',
      options: foodGroupOptions,
    },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Item</h2>
        {fields.map(({ label, field, type, placeholder, options }) => (
          <div key={field} className="add-item-form-row">
            <label htmlFor={field}>{label}</label>
            {type === 'select' ? (
              <select
                value={newItem[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                placeholder={placeholder}
                value={newItem[field]}
                min={field === 'quantity' ? '1' : undefined}
                max={
                  field === 'quantity'
                    ? 99
                    : field === 'itemPrice'
                      ? 999.99
                      : undefined
                }
                maxLength={field === 'itemName' ? 50 : undefined}
                step={field === 'itemPrice' ? '0.01' : undefined}
                onChange={(e) => handleInputChange(field, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, field)}
              />
            )}
          </div>
        ))}
        <div className="modal-actions">
          <button onClick={handleSubmit}>Add Item</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const Receipt: FC<ReceiptProps> = ({
  groceries,
  onUpload,
  onUpdate,
  onAdd,
  onDelete,
  receiptDate,
}) => {
  const [tableData, setTableData] = useState<GroceryItem[]>(groceries);
  const [filterText, setFilterText] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const toggleAddForm = () => {
    setShowAddForm((prev) => !prev);
  };

  useEffect(() => {
    setTableData(groceries);
  }, [groceries]);

  const sortColumn = (
    sortField: keyof GroceryItem,
    sortOrder: 'asc' | 'desc' | 'none',
  ) => {
    if (sortOrder === 'none') {
      setTableData(groceries);
      return;
    }

    if (sortField) {
      const sorted = [...groceries].sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return (
            valA.localeCompare(valB, 'en', { numeric: true }) *
            (sortOrder === 'asc' ? 1 : -1)
          );
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * (sortOrder === 'asc' ? 1 : -1);
        }
        return 0;
      });
      setTableData(sorted);
    }
  };

  return (
    <div>
      <div className="receipt-component-head">
        <h1>Receipt</h1>
        <div className="receipt-options">
          <OcrUploadButton onUploadComplete={onUpload} />
          <SearchBar
            filterText={filterText}
            onFilterTextChange={setFilterText}
          />
        </div>
      </div>
      {showAddForm && (
        <AddItemForm
          onClose={() => setShowAddForm(false)}
          onAdd={onAdd}
          receiptDate={receiptDate}
        />
      )}
      <div className="receipt-table-wrapper">
        <table className="receipt-component-table">
          <ReceiptHead sortColumn={sortColumn} toggleAddForm={toggleAddForm} />
          <tbody className="receipt-component-body">
            {tableData
              .filter((item) =>
                item.itemName.toLowerCase().includes(filterText.toLowerCase()),
              )
              .map((item) => (
                <ReceiptRow
                  key={item.id}
                  item={item}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  receiptDate={receiptDate}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Receipt;
