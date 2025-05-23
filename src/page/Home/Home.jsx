import React from "react";
import "./Home.css";
import { File, Dot } from "lucide-react";
import Report from "../../component/Report/Report";
const shortcut = [
  { name: "Sản Phẩm" },
  { name: "Danh Sách Khách Hàng" },
  { name: "Nhà Cung Cấp" },
  { name: "Hóa Đơn Bán Hàng" },
  { name: "Bảng Thành Tích" },
];
const couter = [
  { name: "Biểu Đồ Tài Khoản" },
  { name: "Công Ty" },
  { name: "Danh Sách Khách Hàng" },
  { name: "Nhà Cung Cấp" },
];
const warehouse = [
  { name: "Sản Phẩm" },
  { name: "Kho Hàng" },
  { name: "Nhãn" },
  { name: "Unit of Measure(UOM)" },
  { name: "Kiểm Kê,Chốt Kho" },
];
const core = [
  { name: "Nhân Viên" , path: "/app/employee", status: true},
  { name: "Công Cụ Chấm Công Nhân Viên" },
  { name: "Cơ Cấu Tiền Lương" },
];
const crm = [
  { name: "Khách Hàng Tiềm Năng" },
  { name: "Nhóm Khách Hàng" },
  { name: "Quốc Gia" },
];
const setting = [
  { name: "Nhập Dữ Liệu" },
  { name: "Mở Công Cụ Hóa Đơn" },
  { name: "Biểu Đồ Của Nhà Nhập Tài Khoản" },
  { name: "Tiêu Đề" },
  { name: "Tài Khoản Email" },
];
const Home = () => {
  return (
    <div className="home">
      <div className="home-up">
        <div className="home-up-content">Lối Tắt</div>
        <div className="home-up-component">
          {shortcut.map((item) => (
            <div className="home-up-item">{item.name}</div>
          ))}
        </div>
      </div>
      <div className="home-down">
        <div className="home-up-content">Báo Cáo & Tính Năng Chính</div>
        <div className="home-up-component">
    
          <Report title="Kế Toán" items={couter} />
          <Report title="Kho" items={warehouse} />
          <Report title="Nhân Sự" items={core} />
            <Report title="CRM" items={crm} />
          <Report title="Nhập và cài đặt dữ liệu" items={setting} />
         
        </div>
      </div>
    </div>
  );
};

export default Home;
