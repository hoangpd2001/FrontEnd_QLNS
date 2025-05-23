import React from "react";
import "./Personal.css";
import Shortcut from "../../component/Shortcut/Shortcut";
import Report from "../../component/Report/Report";
import SalaryChart from "../../component/SalaryChart/SalaryChart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
const Personal = ({
  click,
  setClick,
  clickLink,
  setClickLink,
  pathshortcut,
  setPathshortcut,
}) => {
  const data = [
    { path: "/app/employee", status:false, name: "Nhân Viên" },
    { status:false, name: "Xin Nghỉ Phép" },
    { status:false, name: "Chấm Công" },
    { status:false, name: "Ứng Viên Xin Việc" },
    { status:false, name: "Bảng Chấm Công Hàng Tháng" },
    { status:false, name: "Bảng Thông Tin Tổng Hợp" },
  ];
  const employee = [
    { id: 1, status:true, name: "Nhân Viên", path: "/app/employee" },
    { id: 2, status:true, name: "Loại Nhân Viên", path: "/app/employee_type" },
    { id: 3, status:true, name: "Chi Nhánh", path: "/app/branch" },
    { id: 4, status:true, name: "Phòng Ban", path: "/app/departments" },
    { id: 5, status:true, name: "Chức Danh", path: "/app/employee_title" },
    { id: 6, status:true, name: "Cấp Bậc Nhân Viên", path: "/app/employee_level" },
    { id: 7, status:true, name: "Nhóm Nhân Viên", path: "/app/employee_group" },
    {
      id: 8,
      status:true, name: "Bảo Hiểm Sức Khỏe Nhân Viên",
      path: "/app/employee_HealthInsurance",
    },
  ];
  const employee_life_cycle = [
    {
      id: 1,
      status:false, name: "Đào Tạo Nhân Viên Mới",
      path: "/app/trainning_new_employee",
    },
    {
      id: 2,
      status:true, name: " Kĩ Năng Nhân Viên",
      path: "/app/employee_skill_map",
    },
    { id: 10, status:true, name: "Bản Đồ Kĩ Năng Nhân Viên", path: "/app/employee_skill" },
    { id: 3, status:false, name: "Đề Bạt Nhân Viên", path: "/app/employee_promotion" },
    { id: 4, status:false, name: "Điều Chuyển Nhân Viên", path: "/app/employee_transfer" },
    { id: 5, status:false, name: "Loại Khiếu Nại", path: "/app/type_of_talent" },
    { id: 6, status:false, name: "Khiếu Nại", path: "/app/talents" },
    { id: 7, status:false, name: "Tách Nhân Viên", path: "/app/employee_separation" },
    {
      id: 8,
      status:false, name: "Mẫu Đào Tạo Nhân Viên Mới",
      path: "/app/trainning_new_employee_prototype",
    },
    {
      id: 9,
      status:false, name: "Mẫu Tách Nhân Viên",
      path: "/app/employee_separation_prototype",
    },
    
  ];
  const shift_management = [
    { status:false, name: "Loại Ca Làm" },
    { status:false, name: "Đăng Ký Ca Làm" },
    { status:false, name: "Sắp Xếp Ca Làm" },
  ];
  const on_leave = [
    { status:false, name: "Danh Sách Ngày Lễ" },
    { status:false, name: "Loại Nghỉ Phép" },
    { status:false, name: "Thời Gian Nghỉ Phép" },
    { status:false, name: "Chính Sách Nghỉ Phép" },
    { status:false, name: "Thiết Lập Chính Sách Nghỉ Phép" },
    { status:false, name: "Xin Nghỉ Phép" },
    { status:false, name: "Phân Bố Số Ngày Nghỉ Phép" },
    { status:false, name: "Nghỉ Phép Hưởng Lương" },
    { status:false, name: "Danh Sách Hạn Chế Nghỉ Phép" },
    { status:false, name: "Yêu Cầu Nghỉ Bù" },
  ];
  const timekeeping = [
    { status:false, name: "Công Cụ Chấm Công Nhân Viên" },
    { status:false, name: "Chấm Công" },
    { status:false, name: "Yêu Cầu Chấm Công" },
    { status:false, name: "Tải Lên Chấm Công" },
    { status:false, name: "Check in Nhân Viên" },
  ];
  const Payment_Request = [
    { status:false, name: "Yêu Cầu Thanh Toán" },
    { status:false, name: "Tạm Ứng Nhân Viên" },
    { status:false, name: "Yêu Cầu Đi Công Tác" },
  ];
  const setting = [
    { status:false, name: "Cài Đặt Nhân Sự" },
    { status:false, name: "Tổng Hợp Công Việc Hằng Ngày" },
    { status:false, name: "Cập Nhật Nhóm" },
  ];
  const Driver_Managemt = [
    { status:false, name: "Tài Xế" },
    { status:false, name: "Phương Tiện" },
    { status:false, name: "Nhật Ký Phương Tiện" },
    { status:false, name: "Chi Phí Phương Tiện" },
  ];
  const hr = [
    { status:false, name: "Cơ Hội Việc Làm" },
    { status:false, name: "Nhân Viên Giới Thiệu" },
    { status:false, name: "Ứng Viên Xin Việc" },
    { status:false, name: "Lời Mời Làm Việc" },
    { status:false, name: "Kế Hoạch Tuyển Dụng" },
    { status:false, name: "Giấy Bổ Nhiệm" },
    { status:false, name: "Mẫu Giấy Bôe Nhiệm" },
    { status:false, name: "Interview Type" },
    { status:false, name: "Vòng Phỏng Vấn" },
    { status:false, name: "Phỏng Vấn" },
    { status:false, name: "Đánh Giá Phỏng Vấn" },
  ];
  const loan = [
    { status:false, name: "Đơn Xin Vay" },
    { status:false, name: "Khoản Vay" },
    { status:false, name: "Loại Khoản Vay" },
  ];
  const trainning = [
    { status:false, name: "Chương Trình Đào Tạo" },
    { status:false, name: "Sự Kiện Đào Tạo" },
    { status:false, name: "Kết Quả Đào Tạo" },
    { status:false, name: "Nhận Xét Sau Đào Tạo" },
  ];
  const Work_Results = [
    { status:false, name: "Đánh Giá Nhân Viên" },
    { status:false, name: "Mẫu Đánh Giá Nhân Viên" },
    { status:false, name: "Quy Tắc Điểm Năng Lượng" },
    { status:false, name: "Nhật Ký Năng Lượng" },
  ];
  const report = [
    { status:false, name: "Bảng Chấm Công Hàng Tháng" },
    { status:false, name: "Phân Tích Tuyển Dụng" },
    { status:false, name: "Thông Số Nhân Viên" },
    { status:false, name: "Ngày Nghỉ Còn Lại" },
    { status:false, name: "Tóm Tắt Ngày Nghỉ Còn Lại" },
    { status:false, name: "Tóm Tắt Tạm Ứng Nhân Viên" },
  ];
  const another_report = [
    { status:false, name: "Thông Tin Nhân Viên" },
    { status:false, name: "Sinh Nhật Nhân Viên" },
    { status:false, name: "Nhân Viên Làm Việc Vào Ngày Lễ" },
    { status:false, name: "Phản Hồi Tóm Tắt Công Việc" },
  ];
  const document = [
    { status:false, name: "Public Administration City Province" },
    { status:false, name: "Public Administration District" },
    { status:false, name: "Public Administration Ward" },
  ];
  useEffect(() => {}, [clickLink]);
  return (
    <div className="personal">
      <div className="chart">
        <SalaryChart />
      </div>
      <Shortcut
        pathshortcut={pathshortcut}
        setPathshortcut={setPathshortcut}
        clickLink={clickLink}
        setClickLink={setClickLink}
        data={data}
        click={click}
        setClick={setClick}
      />
      <div className="personal-title">Báo Cáo & Tính Năng Chính</div>
      <div className="home-up-component">
        <Report title="Nhân Viên" items={employee} />
        <Report title="Vòng Đời Nhân Viên" items={employee_life_cycle} />
        <Report title="Quản Lý Ca Làm" items={shift_management} />
        <Report title="Nghỉ Phép" items={on_leave} />
        <Report title="Chấm Công" items={timekeeping} />
        <Report title="Yêu Cầu Thanh Toán" items={Payment_Request} />
        <Report title="Cài Đặt" items={setting} />
        <Report title="Quản Lý Đọi Xe" items={Driver_Managemt} />
        <Report title="Tuyển Dụng" items={hr} />
        <Report title="Khoản Vay" items={loan} />
        <Report title="Đào Tạo" items={trainning} />
        <Report title="Hiệu Quả Công Việc" items={Work_Results} />
        <Report title="Báo Cáo Chính" items={report} />
        <Report title="Báo Cáo Khác" items={another_report} />
        <Report title="Tài Liệu Tùy Chỉnh" items={document} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Personal;
