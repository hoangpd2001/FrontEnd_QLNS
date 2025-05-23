import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { Bell, ChevronDown, SearchIcon, LogIn, LogOut } from "lucide-react";
import Navigation from "../Navigation/Navigation";
import imgLogo from "../../assets/logo.png";
import Login from "../../page/Login/Login";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
const Navbar = ({
  menu,
  setMenu,
  path,
  setPath,
  clickLink,
  setClickLink,
  pathshortcut,
  setPathshortcut,
}) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const confirm = () => {
    return new Promise((resolve) => {
      confirmAlert({
        title: "Xác nhận đăng xuất",
        message: "Bạn có chắc chắn muốn đăng xuất không?",
        buttons: [
          {
            label: "Đồng ý",
            onClick: () => resolve(true),
          },
          {
            label: "Hủy",
            onClick: () => resolve(false),
          },
        ],
      });
    });
  };

  useEffect(() => {
    localStorage.getItem("token") ? setIsLogin(true) : setIsLogin(false);
  }, [clickLink, isLoginOpen]);
  const openLogin = async () => {
    if (isLogin) {
      const confirmed = await confirm();
      if (!confirmed) return;
      localStorage.removeItem("token");
      window.location.reload();
      localStorage.getItem("token") ? setIsLogin(true) : setIsLogin(false);
    } else {
      setIsLoginOpen(true);

      localStorage.getItem("token") ? setIsLogin(true) : setIsLogin(false);
    }
  };
  return (
    <div id="mainnav">
      {isLoginOpen && (
        <Login
          isLoginOpen={isLoginOpen}
          setIsLoginOpen={setIsLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      )}
      {/* {isLoginOpen ? <Login/>:""} */}
      <div className="navbar">
        <div className="navbar-left">
          <div className="navbar-left-logo">
            <Link to="/">
              <img src={imgLogo} alt="logo" className="logo" />
            </Link>
          </div>
          <div className="navbar-left-navigation">
            <Navigation
              pathshortcut={pathshortcut}
              setPathshortcut={setPathshortcut}
              clickLink={clickLink}
              setClickLink={setClickLink}
              menu={menu}
              setMenu={setMenu}
              path={path}
              setPath={setPath}
            />
          </div>
        </div>
        <div className="navbar-right">
          <div className="navbar-right-search">
            <div>
              <SearchIcon className="search-icon"></SearchIcon>
            </div>
            <div>
              <span>Tìm Kiếm Hoặc Gõ Lệnh (Ctrl + G)</span>
            </div>
          </div>
          <div className="navbar-right-bell">
            <Bell className="bell-icon"></Bell>
          </div>
          <div>
            <hr />
          </div>
          <div className="navbar-right-dropdown">
            <span>Trợ giúp </span>
            <div>
              <ChevronDown className="search-icon"></ChevronDown>
            </div>
          </div>
          <div onClick={openLogin} className="navbar-right-dropdown">
            <span>{isLogin ? "Đăng Xuất" : "Đăng Nhập"}</span>
            <div>
              <LogIn
                display={isLogin ? "none" : "block"}
                className="log-in"
              ></LogIn>
            </div>
            <div>
              <LogOut
                display={isLogin ? "block" : "none"}
                className="log-in"
              ></LogOut>
            </div>
          </div>
          <div className="navbar-right-dot">1</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
