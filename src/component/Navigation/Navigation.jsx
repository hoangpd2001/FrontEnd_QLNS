import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";
import { ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

const partner = [
  { path: "/", label: "Trang Chủ" },
  { path: "/counter", label: "Kế toán" },
  { path: "/talent", label: "Tài Sản" },
  { path: "/build", label: "Build" },
  { path: "/purchase", label: "Mua Hàng" },
  { path: "/crm", label: "CRM" },
  { path: "/employee", label: "Nhân Sự" },
  { path: "/app", label: "Nhân Sự" },
  { path: "/loan", label: "Khoản vay" },
  { path: "/payroll", label: "Bảng Lương" },
  { path: "/project", label: "Dự Án" },
  { path: "/quality", label: "Chất Lượng" },
  { path: "/buy", label: "Bán Hàng" },
  { path: "/warehouse", label: "Kho" },
  { path: "/support", label: "Hỗ Trợ" },
  { path: "/website", label: "Website" },
  { path: "/setting", label: "Cài Đặt" },
  { path: "/utilities", label: "Tiện Ích" },
  { path: "/product", label: "Sản Xuất" },
  { path: "/customization", label: "Tùy Biến" },
  { path: "/integration", label: "Tích Hợp" },
  { path: "/labour", label: "Công Cụ" },
  { path: "/user", label: "Người Sử Dụng" },
  { label: "Nhân Viên", path: "/employee" },
  { label: "Loại Nhân Viên", path: "/app/employee_type" },
  { label: "Chi Nhánh", path: "/app/branch" },
  { label: "Phòng Ban", path: "/app/departments" },
  { label: "Chức Danh", path: "/app/employee_title" },
  { label: "Cấp Bậc Nhân Viên", path: "/app/employee_level" },
  { label: "Nhóm Nhân Viên", path: "/app/employee_group" },
  {
    label: "Bảo Hiểm Sức Khỏe Nhân Viên",
    path: "/app/employee_HealthInsurance",
  },
  { label: "Đào Tạo Nhân Viên Mới", path: "/app/trainning_new_employee" },
  { label: "Bản Đồ Kĩ Năng Nhân Viên", path: "/app/employee_skill_map" },
  { label: "Đề Bạt Nhân Viên", path: "/app/employee_promotion" },
  { label: "Điều Chuyển Nhân Viên", path: "/app/employee_transfer" },
  { label: "Loại Khiếu Nại", path: "/app/type_of_talent" },
  { label: "Khiếu Nại", path: "/app/talents" },
  { label: "Tách Nhân Viên", path: "/app/employee_separation" },
  {
    label: "Mẫu Đào Tạo Nhân Viên Mới",
    path: "/app/trainning_new_employee_prototype",
  },
  { label: "Mẫu Tách Nhân Viên", path: "/app/employee_separation_prototype" },
  { label: "Bản Đồ Kĩ Năng Nhân Viên", path: "/app/employee_skill" },
  { label: "Quyền Hạn Người Dùng", path: "/user/employee_role" },
];

function Navigation({
  menu,
  path,
  setPath,
  clickLink,
  setClickLink,
  pathshortcut,
  setPathshortcut,
}) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav>
      <div className="breadcrumb">
        <div className="chevron">
          <ChevronRight />
        </div>
        <div>
          <Link to="/">Trang Chủ</Link>
        </div>

        {location.pathname.includes("employee/") ? (
          <>
            <div className="chevron">
              <ChevronRight />
            </div>
            <div>
              <Link to="/employee">Nhân Sự</Link>
            </div>
            <div className="chevron">
              <ChevronRight />
            </div>
            <div>
              <Link to="/app/employee">Nhân Viên</Link>
            </div>
            <div className="chevron">
              <ChevronRight />
            </div>
            <div>
              NV_
              {location.pathname
                .split("employee/")[1]
                .slice(0, 5)
                .padStart(5, "0")}
            </div>
          </>
        ) : location.pathname.endsWith("/app/employee") ? (
          <>
            <div className="chevron">
              <ChevronRight />
            </div>
            <div>
              <Link to="/employee">Nhân Sự</Link>
            </div>
            <div className="chevron">
              <ChevronRight />
            </div>
            <div>
              <Link to="/app/employee">Nhân Viên</Link>
            </div>
          </>
        ) : (
          pathnames.map((name, index) => {
            const routeTo =
              `/${pathnames.slice(0, index + 1).join("/")}` == "/app"
                ? "/employee"
                : `/${pathnames.slice(0, index + 1).join("/")}`;
            const partnerItem = partner.find((p) => p.path === routeTo);
            return (
              <React.Fragment key={index}>
                <div className="chevron">
                  <ChevronRight />
                </div>
                <div>
                  <Link to={routeTo}>
                    {partnerItem ? partnerItem.label : name}
                  </Link>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
    </nav>
  );
}

export default Navigation;
