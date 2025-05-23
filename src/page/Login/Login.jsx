import React, { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaPhoneAlt } from "react-icons/fa";
import "./Login.css";
import API from "../../api/apiConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imgLogo from "../../assets/logo.png";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Spinner from "../../component/spinner/spinner";
const Login = ({ isLoginOpen, setIsLoginOpen }) => {
  // useEffect(() => {

  //   // if (localStorage.getItem('token')) {
  //   //   setIsLoginOpen(false);
  //   // }
  // }, [setIsLoginOpen]);
  const [userLogin, setUserLogin] = useState({ Email: "", Pass: "" });
  const [userPass, setUserPass] = useState({ Email: "", SDT: "" });
  const [editPass, setEditPass] = useState(false);
  const [editLogin, setEditLogin] = useState(true);
    const [loading, setLoading] = useState(false);
  const [loadingS, setLoadingS] = useState(false);
  const [loadingE, setLoadingE] = useState(false);
  const confirm = () => {
    return new Promise((resolve) => {
      confirmAlert({
        title: "Xác nhận lấy lại mật khẩu",
        message:
          "Mật khẩu mới sẽ được gửi vào gmail của bạn. Bạn có chắc chắn muốn lấy lại mật khẩu không?",
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API.APIALL}user/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userLogin),
      });
      console.log(userLogin);
      const result = await response.json();
      const data = await result.Data;
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      localStorage.setItem("token", data.Token);
      toast.success("đăng nhập thành công", {
        position: "top-right",
      });
      window.location.reload();
      setIsLoginOpen(false);
    } catch (error) {
      setLoading(false)
      if(error.message == "Failed to fetch"){
        toast.error("Không thể kết nối với server, Vui lòng kiểm tra lại !!", {
        position: "top-right",
      });
      }else
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };
  const EditPass = async (event) => {
    event.preventDefault();
    const confirmed = await confirm();
    if (!confirmed) return;
    try {
      const response = await fetch(`${API.APIALL}user/editPass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPass),
      });
      const result = await response.json();
      const data = await result.Data;
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      toast.success("Yêu cầu thành công, vui lòng kiểm tra gmail của bạn", {
        position: "top-right",
      });
      closeEditPass();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserLogin((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangeP = (e) => {
    const { name, value } = e.target;
    setUserPass((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const closeLogin = (e) => {
    setIsLoginOpen(false);
    setUserLogin("");
  };
  const openEditPass = (id) => {
    setEditPass(true);
    setEditLogin(false);
  };

  const closeEditPass = () => {
    setEditPass(false);
    setEditLogin(true);
    setUserPass("");
  };
  return (
    <div className="login-container">
      {editPass && (
        <div className="login-box">
          <div className="button-login" onClick={closeEditPass}>
            <button>X</button>
          </div>
          <div className="login-icon">
            <img src={imgLogo} alt="logo" className="logo" />
          </div>
          <div className="login-text">
            <span>Lấy Lại Mật Khẩu</span>
          </div>
          <div className="login-form">
            <form onSubmit={EditPass}>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  onChange={handleChangeP}
                  name="Email"
                  type="email"
                  placeholder="Nhập Gmail của bạn"
                />
              </div>
              <div className="input-wrapper">
                <FaPhoneAlt className="input-icon" />
                <input
                  onChange={handleChangeP}
                  name="SDT"
                  type="text"
                  placeholder="Nhập SDT của bạn"
                />
              </div>
              <div className="login-pass-miss">
                <div className="login-button">
                  <button type="submit">Xác Nhận</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {editLogin && (
        <div className="login-box">
          <div className="button-login" onClick={closeLogin}>
            <button>X</button>
          </div>
          <div className="login-icon">
            <img src={imgLogo} alt="logo" className="logo" />
          </div>
          <div className="login-text">
            <span>Đăng Nhập</span>
          </div>
          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  onChange={handleChange}
                  name="Email"
                  type="email"
                  placeholder="abc@gmail.com"
                />
              </div>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  onChange={handleChange}
                  name="Pass"
                  placeholder="Password"
                />
              </div>
              {loading ? (<Spinner />) : ""}
              <div className="login-pass-miss">
                <span onClick={openEditPass}>Quên Mật Khẩu?</span>

                <div className="login-button">
                  <button type="submit">Đăng Nhập</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
