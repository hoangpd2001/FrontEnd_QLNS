import React from "react";
import "./FilterHeader.css";
import { AlignJustify, Blinds, Ellipsis, Plus, RotateCw } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
const FilterHeader = ({
  menu,
  setMenu,
  click,
  onClick,
  handleRemoveSelected,
}) => {
  const [dropdown, setDropdown] = useState(false);
   let pageTitle;
  if (location.pathname.includes('/app')) {
    pageTitle = 'Nhân Viên';
  } else if (location.pathname.includes('/user')) {
    pageTitle = 'Người Sử Dụng';
  } else {
    pageTitle = 'Trang Chủ'; 
  }
  const drop = () => {
    setDropdown(!dropdown);
  };

  return (
    <div className="filterheader">
      <div className="filterheader-left">
        <div>
          <AlignJustify onClick={click} className="filterheader-left-icon" />
        </div>
        <span>{menu}{pageTitle}</span>
      </div>
      <div className="filterheader-right">
        <div className="filterheader-right-select">
          <select className="filterheader-right-select-text">
            <option>
              <Blinds />
              Xem Kiểu Danh Sách
            </option>
          </select>
        </div>
        <div className="filterheader-right-refesh">
          <RotateCw className="refesh" />
        </div>
        <div onClick={drop} className="filterheader-right-dot">
          <Ellipsis className="dot" />
        </div>
        <div className={`dropdown-menu ${dropdown ? "show" : ""}`}>
          {dropdown ? (
            <button
              onClick={handleRemoveSelected}
              className="remove-part-header"
            >
              Xóa
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterHeader;
