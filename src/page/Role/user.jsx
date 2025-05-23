import React from "react";
import Shortcut from "../../component/Shortcut/Shortcut";
import Report from "../../component/Report/Report";
import SalaryChart from "../../component/SalaryChart/SalaryChart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
const User = ({
  click,
  setClick,
  clickLink,
  setClickLink,
  pathshortcut,
  setPathshortcut,
}) => {
  const data = [
    { path: "/app/employee", status:false, name: "Quản lí vai trò" },
    { status:false, name: "Quyền Hạn Người dùng" },
    { status:false, name: "Nhật Kí Hoạt Động" },
  ];
  const employee = [{ id: 1, status:false, name: "Quản Lí Vai Trò", path: "/user/role" }
    
  ];
  const employee_life_cycle = [
    { id: 1, status:true, name: "Quyền Hạn Người Dùng", path: "/user/employee_role" },
    { id: 2, status:false, name: "Nhật Kí Hoạt Động", path: "/user/diary" }
  ];

  useEffect(() => {}, [clickLink]);
  return (
    <div className="personal">
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
        <Report title="Vai Trò" items={employee} />
        <Report title="Quyền Hạn" items={employee_life_cycle} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default User;
