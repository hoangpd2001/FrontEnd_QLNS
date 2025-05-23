import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  BrickWall,
  Blocks,
  Atom,
  PackageCheck,
  ShoppingBasket,
  ShoppingBag,
  ShieldCheck,
  Projector,
  Orbit,
  SlidersHorizontal,
  Wrench,
  Plug,
  AppWindow,
  Cylinder,
  Contact,
  Notebook,
  Scroll,
  Scale,
  Package,
  Pyramid,
  PersonStanding,
} from "lucide-react";

const partner = [
  { path: "/", label: "Trang Chủ", icon: <AppWindow />, status:true },
  { path: "/counter", label: "Kế toán", icon: <Notebook />, status:false },
  { path: "/talent", label: "Tài Sản", icon: <Scale />, status:false },
  { path: "/build", label: "Build", icon: <Pyramid />, status:false },
  { path: "/purchase", label: "Mua Hàng", icon: <ShoppingBasket />, status:false },
  { path: "/crm", label: "CRM", icon: <Cylinder />, status:false },
  { path: "/employee", label: "Nhân Sự", icon: <PersonStanding />, status:true },
  { path: "/loan", label: "Khoản vay", icon: <Contact />, status:false },
  { path: "/payroll", label: "Bảng Lương", icon: <Scroll />, status:false },
  { path: "/project", label: "Dự Án", icon: <Projector />, status:false },
  { path: "/quality", label: "Chất Lượng", icon: <ShieldCheck />, status:false },
  { path: "/buy", label: "Bán Hàng", icon: <ShoppingBag />, status:false },
  { path: "/warehouse", label: "Kho", icon: <Package />, status:false },
  { path: "/support", label: "Hỗ Trợ", icon: <Plug />, status:false },
  { path: "/website", label: "Website", icon: <Orbit />, status:false },
  { path: "/setting", label: "Cài Đặt", icon: <Wrench />, status:false },
  { path: "/utilities", label: "Tiện Ích", icon: <SlidersHorizontal />, status:false },
];

const dns = [{ path: "/product", label: "Sản Xuất", icon: <PackageCheck />, status:false }];

const admin = [
  { path: "/customization", label: "Tùy Biến", icon: <Atom />, status:false },
  { path: "/integration", label: "Tích Hợp", icon: <Blocks />, status:false },
  { path: "/labour", label: "Công Cụ", icon: <BrickWall />, status:false },
  { path: "/user", label: "Người Sử Dụng", icon: <User />, status:true },
];

const getLabelByPath = (path) => {
  const allMenus = [...partner, ...dns, ...admin];
  const menu = allMenus.find((item) => item.path === path);
  return menu ? menu.label : "";
};

const Sidebar = ({ menu, setMenu, click, setClick, path, setPath }) => {
  const [activeLink, setActiveLink] = useState("/");
  const location = useLocation();

  useEffect(() => {
    setActiveLink(location.pathname);
    setMenu(getLabelByPath(location.pathname));
  }, [location.pathname, setMenu]);

  const handleLinkClick = (path, label, pathname) => {
    setActiveLink(path);
    setMenu(label);
    setPath(pathname);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-component">
        <div className="sidebar-content">
          <span>BỘ PHẬN</span>
        </div>
        <div className="sidebar-content-item">
          {partner.map((item) => (
            <Link
              onClick={() => handleLinkClick(item.path, item.label, item.path)}
              to={item.path}
              className={`sidebar-item ${activeLink === item.path ? "active" : ""}`}
              key={item.path}
            >
             {!item.status &&
              (<><div className="iconf">{item.icon}</div><div className="textf">{item.label}</div></>
              )}
              {item.status &&
              (<><div className="icon">{item.icon}</div><div className="text">{item.label}</div></>
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className="sidebar-component">
        <div className="sidebar-content">
          <span>TÊN MIỀN</span>
        </div>
        <div className="sidebar-content-item">
          {dns.map((item) => (
            <Link
              onClick={() => handleLinkClick(item.path, item.label)}
              to={item.path}
              className={`sidebar-item ${activeLink === item.path ? "active" : ""}`}
              key={item.path}
            >
              {!item.status &&
              (<><div className="iconf">{item.icon}</div><div className="textf">{item.label}</div></>
              )}
              {item.status &&
              (<><div className="icon">{item.icon}</div><div className="text">{item.label}</div></>
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className="sidebar-component">
        <div className="sidebar-content">
          <span>QUẢN TRỊ</span>
        </div>
        <div className="sidebar-content-item">
          {admin.map((item) => (
            <Link
              onClick={() => handleLinkClick(item.path, item.label)}
              to={item.path}
              className={`sidebar-item ${activeLink === item.path ? "active" : ""}`}
              key={item.path}
            >
              {!item.status &&
              (<><div className="iconf">{item.icon}</div><div className="textf">{item.label}</div></>
              )}
              {item.status &&
              (<><div className="icon">{item.icon}</div><div className="text">{item.label}</div></>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
