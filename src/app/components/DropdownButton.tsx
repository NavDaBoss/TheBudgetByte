import { useState } from 'react';
import '../styles/DropdownButton.css';

interface DropDownProps {
  selectedValue: string; // Current selected value
  setSelectedValue: (value: string) => void; // Function to update the selected value
  values: string[]; // Array of values to display in the dropdown
  drop_label: string; // Label for the dropdown
}

const DropDown: React.FC<DropDownProps> = ({
  selectedValue,
  setSelectedValue,
  values,
  drop_label,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleValueChange = (val: string) => {
    setSelectedValue(val);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="button-container">
      <label style={{ marginRight: '8px' }}>{drop_label}</label>
      <div className="dropdown-container">
        <div className="dropdown-wrapper" onClick={toggleDropdown}>
          <div className="selected-year">{selectedValue}</div>
          <div className="dropdown-arrow"></div>
        </div>
        {isOpen && (
          <div className="custom-dropdown">
            {values.map((value) => (
              <div
                key={value}
                className="dropdown-option"
                onClick={() => handleValueChange(value)}
              >
                {value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropDown;