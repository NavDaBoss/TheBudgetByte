"use client";

import React, { useEffect } from "react";
import { useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import GroceryData from "./groceries.json";
import SummaryData from "./food_summary.json";

import "./dashboard.css";

const ReceiptHead = ({ sortColumn }) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSortChange = (accessor) => {
    let sortOrder = "asc";
    if (accessor === sortField) {
      if (order === "asc") {
        sortOrder = "desc";
      } else if (order === "desc") {
        sortOrder = "none";
      } else if (order === "none") {
        sortOrder = "asc";
      }
    }
    setSortField(accessor);
    setOrder(sortOrder);
    sortColumn(accessor, sortOrder);
  };

  return (
    <thead className="receipt-table-head">
      <tr>
        <th key="quantity" onClick={() => handleSortChange("quantity")}>
          QTY
        </th>
        <th key="itemName" onClick={() => handleSortChange("itemName")}>
          ITEM
        </th>
        <th key="group" onClick={() => handleSortChange("group")}>
          GROUP
        </th>
        <th key="price" onClick={() => handleSortChange("price")}>
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
      <td className="groupColumn">{item.group}</td>
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

const FilterableReceipt= ({ groceries }) => {
  const [tableData, setTableData] = useState(groceries);
  const [filterText, setFilterText] = useState("");

  const sortColumn = (sortField, sortOrder) => {
    if (sortOrder === "none") {
      setTableData(groceries);
      return;
    }

    if (sortField) {
      const sorted = [...groceries].sort((a, b) => {
        if (typeof a[sortField] === "number") {
          return (a[sortField] - b[sortField]) * (sortOrder === "asc" ? 1 : -1);
        }
        a = a[sortField].toLowerCase();
        b = b[sortField].toLowerCase();

        return (
          a.localeCompare(b, "en", {
            numeric: true,
          }) * (sortOrder === "asc" ? 1 : -1)
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
    </div>
  );
};

const Receipt = ({ groceries }) => {
  return (
    <div className="receipt">
      <div className="receipt-title">
        <div className="receipt-date">
          <h3>Thursday, October 10, 2024</h3>
        </div>
      </div>
      <FilterableReceipt groceries={groceries} />
      <div className="dashed-line"></div>
    </div>
  );
};

const SummaryHead = ({ sortColumn }) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSortChange = (accessor) => {
    let sortOrder = "asc";
    if (accessor === sortField) {
      if (order === "asc") {
        sortOrder = "desc";
      } else if (order === "desc") {
        sortOrder = "asc";
      }
    }
    setSortField(accessor);
    setOrder(sortOrder);
    sortColumn(accessor, sortOrder);
  };

  return (
    <thead>
      <tr>
        <th key="check" onClick={() => handleSortChange("check")}>
          X
        </th>
        <th key="group" onClick={() => handleSortChange("type")}>
          GROUP
        </th>
        <th key="count" onClick={() => handleSortChange("count")}>
          COUNT
        </th>
        <th key="price" onClick={() => handleSortChange("totalPrice")}>
          PRICE
        </th>
      </tr>
    </thead>
  );
};

const SummaryTable = ({ groups, sortColumn }) => {
  const rows = [];

  groups.map((group) => {
    rows.push(
      <tr key={group.type}>
        <td>{group.count > 0 ? 1 : 0}</td>
        <td>{group.type}</td>
        <td>{group.count}</td>
        <td>${group.totalPrice.toFixed(2)}</td>
      </tr>
    );
  });

  return (
    <table className="summary-table">
      <SummaryHead sortColumn={sortColumn} />
      <tbody>{rows}</tbody>
    </table>
  );
};

const Summary = ({ groups }) => {
  const [tableData, setTableData] = useState(groups);

  const sortColumn = (sortField, sortOrder) => {
    if (sortOrder === "none") {
      setTableData(groups);
      return;
    }

    const sorted = [...groups].sort((a, b) => {
      if (sortField == "check") {
        const checkA = a.count > 0 ? 1 : 0;
        const checkB = b.count > 0 ? 1 : 0;
        return sortOrder === "asc" ? checkA - checkB : checkB - checkA;
      }
      if (typeof a[sortField] === "number") {
          return (a[sortField] - b[sortField]) * (sortOrder === "asc" ? 1 : -1);
      }
      a = a[sortField].toLowerCase();
      b = b[sortField].toLowerCase();

      return (
        a.localeCompare(b, "en", {
          numeric: true,
        }) * (sortOrder === "asc" ? 1 : -1)
      );
    });
    setTableData(sorted);
  };

  return (
    <div className="food-checklist">
      <h1>Summary</h1>
      <SummaryTable groups={tableData} sortColumn={sortColumn} />
    </div>
  );
};

// <NavigationBar />
const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div class="section-container">
        <Receipt groceries={GroceryData.groceries} />
        <Summary groups={SummaryData.foodGroups} />
      </div>
    </div>
  );
};

export default Dashboard;
