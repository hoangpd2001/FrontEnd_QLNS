import React from "react";
//import './styles.css'; // Đảm bảo đã nhập file CSS nếu cần
import ReactDOM from "react-dom";
const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return ReactDOM.createPortal(
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p>{message}</p>
        <button onClick={onConfirm}>Đồng ý</button>
        <button onClick={onCancel}>Hủy</button>
      </div>
    </div>,
    document.body, // Render vào body để đảm bảo luôn ở trên cùng
  );
};

export default ConfirmDialog;
