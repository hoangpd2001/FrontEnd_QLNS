import React from "react";
import FilterHeader from "../../../component/FilterHeader/FilterHeader";
import FilterSidebar from "../../../component/FilterSidebar/FilterSidebar";
import { useState } from "react";
import { Filter, Pencil } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import API from "../../../api/apiConfig";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../EmployeeRole/EmployeeRole.css";
import Spinner from "../../../component/spinner/spinner";

const EmployeeRole = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [insert, setInsert] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [RoleUserData, setRoleUserData] = useState({
    IDChucDanh: 0,
    IDVaiTro: 0,
    Xem: false,
    Them: false,
    Sua: false,
    Xoa: false,
  });
  const [roles, setRole] = useState([]);
  const [titles, setTitle] = useState([]);
  const [RoleUser, setRoleUser] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchRoleUser();
    fetchRole();
    fetchTitle();
  }, []);
  const confirm = () => {
    return new Promise((resolve) => {
      confirmAlert({
        title: "Xác nhận sửa đổi",
        message: "Bạn có chắc chắn muốn sửa đổi thông tin này không?",
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
  const fetchRole = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API.APIALL}role/selectAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      const data = await result.Data;

      console.log("Fetched roles:", data);
      setRole(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setLoading(false);
    }
  };

  const fetchTitle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API.APIALL}title/selectAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      const data = await result.Data;
      setTitle(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching title:", error);
    }
  };
  const fetchRoleUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API.APIALL}userrole/selectAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      const data = await result.Data;
      setRoleUser(data);
      setSelectedItems(data.map(() => false));
      setLoading(false);
      console.log("Rendering EmployeeType component", RoleUser);
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };

  const openInsert = () => {
    setInsert(true);
  };

  const closeInsert = () => {
    setInsert(false);
    setRoleUserData({
      IDChucDanh: 0,
      IDVaiTro: 0,
      Xem: false,
      Them: false,
      Sua: false,
      Xoa: false,
    });
  };

  const openEdit = (idc, idv) => {
    const itemToEdit = RoleUser.find(
      (item) => item.IDChucDanh == idc && item.IDVaiTro == idv,
    );
    setRoleUserData(itemToEdit);
    setEdit(true);
  };

  const closeEdit = () => {
    setEdit(false);
    setRoleUserData({
      IDChucDanh: 0,
      IDVaiTro: 0,
      Xem: false,
      Them: false,
      Sua: false,
      Xoa: false,
    });
  };

  const handleSelectAllChange = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    setSelectedItems(selectedItems.map(() => checked));
  };

  const handleItemChange = (index) => (event) => {
    const checked = event.target.checked;
    const updatedSelectedItems = [...selectedItems];
    updatedSelectedItems[index] = checked;
    setSelectedItems(updatedSelectedItems);
    setSelectAll(updatedSelectedItems.every((item) => item));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoleUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setRoleUserData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const isDuplicate =
      RoleUser && RoleUser.length > 0
        ? RoleUser.some(
            (item) =>
              item.IDVaiTro == RoleUserData.IDVaiTro &&
              item.IDChucDanh == RoleUserData.IDChucDanh,
          )
        : false;
    if (isDuplicate) {
      toast.error("Quyền đã tồn tại!", {
        position: "top-right",
      });
      return;
    }
    try {
      const newDepartment = {
        ...RoleUserData,
      };
      newDepartment.IDChucDanh = parseInt(newDepartment.IDChucDanh);
      newDepartment.IDVaiTro = parseInt(newDepartment.IDVaiTro);
      const response = await fetch(
        `${API.APIALL}userrole/creat/?idt=${newDepartment.IDChucDanh}&idr=${newDepartment.IDVaiTro}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newDepartment),
        },
      );
      const result = await response.json();
      if (result.StatusCode != 200) {
        throw new Error(result.Message);
      }
      toast.success("Phân Quyền mới đã được tạo thành công!", {
        position: "top-right",
      });
      fetchRoleUser();
      closeInsert();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const confirmed = await confirm();
    if (!confirmed) return;
    setLoading(true);
    RoleUserData.IDChucDanh = parseInt(RoleUserData.IDChucDanh);
    RoleUserData.IDVaiTro = parseInt(RoleUserData.IDVaiTro);

    try {
      const response = await fetch(
        `${API.APIALL}userrole/update/?idt=${RoleUserData.IDChucDanh}&idr=${RoleUserData.IDVaiTro}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(RoleUserData),
        },
      );
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(errorMessage);
      }

      toast.success("Thông tin phân quyền đã cập nhật", {
        position: "top-right",
      });
      fetchRoleUser(); // Đảm bảo fetch lại dữ liệu
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };

  const handleRemove = async (id) => {
    if (!id) return;
    const confirmed = await confirm();
    if (!confirmed) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${API.APIALL}userrole/delete/?idt=${RoleUserData.IDChucDanh}&idr=${RoleUserData.IDVaiTro}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(errorMessage);
      }
      toast.success("Phân Quyền đã được xóa thành công!", {
        position: "top-right",
      });
      fetchRoleUser();
      closeEdit();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };
  const getRoleNameById = (id) => {
    const branch = roles.find((branch) => branch.ID === id);
    return branch ? branch.Ten : "Unknown";
  };
  const getTitleNameById = (id) => {
    const branch = titles.find((branch) => branch.ID === id);
    return branch ? branch.TenChucDanh : "Unknown";
  };

  const handleRemoveSelected = async () => {
    const selectedIds = employeeTypes
      .filter((_, index) => selectedItems[index])
      .map((item) => item.ID);

    if (selectedIds.length === 0) {
      toast.warning("Không có mục nào được chọn để xóa!", {
        position: "top-right",
      });
      return;
    }

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`${API.APIALL}/${id}`, {
            method: "DELETE",
          }),
        ),
      );
      toast.success("Các loại nhân viên đã được xóa thành công!", {
        position: "top-right",
      });
      fetchEmployeeTypes();
    } catch (error) {
      toast.error("Xóa không thành công: " + error.message, {
        position: "top-right",
      });
    }
  };
  return (
    <div className="branch">
      <FilterHeader handleRemoveSelected={handleRemoveSelected} />

      <div className="employeeRole-table">
        <div className="branch-table-header">
          <div className="branch-search-filter">
            <input
              className="branch-search-filter-input"
              type="text"
              placeholder="Tìm Kiếm"
            />
          </div>
          <div className="branch-insert">
            <button className="branch-insert-button" onClick={openInsert}>
              {" "}
              + Thêm Phân Quyền{" "}
            </button>
          </div>

          {insert && (
            <div className="overlay">
              <div className="employee-type-insert">
                <div className="employee-type-insert-insert">
                  <div className="employee-type-title-insert">
                    Thêm Phân Quyền
                  </div>
                  <div className="employee-type-input-insert">
                    <form onSubmit={handleSave}>
                      <div className="input-insert">
                        Chức danh
                        <select
                          name="IDChucDanh"
                          onChange={handleChange}
                          required
                        >
                          <option value="">Chọn chức danh</option>
                          {titles && titles.length > 0 ? (
                            titles.map((title) => (
                              <option key={title.ID} value={title.ID}>
                                {getTitleNameById(title.ID)}
                              </option>
                            ))
                          ) : (
                            <option>Không có chức danh nào</option>
                          )}
                        </select>
                        Vai trò
                        <select
                          name="IDVaiTro"
                          onChange={handleChange}
                          required
                        >
                          <option value="">Chọn vai trò</option>
                          {roles && roles.length > 0 ? (
                            roles.map((role) => (
                              <option key={role.ID} value={role.ID}>
                                {getRoleNameById(role.ID)}
                              </option>
                            ))
                          ) : (
                            <option>Không có vai trò nào</option>
                          )}
                        </select>
                        Xem{" "}
                        <input
                          type="checkbox"
                          name="Xem"
                          onChange={handleCheckboxChange}
                          checked={RoleUserData.Xem}
                        />
                        Thêm{" "}
                        <input
                          type="checkbox"
                          name="Them"
                          onChange={handleCheckboxChange}
                          checked={RoleUserData.Them}
                        />
                        Sửa{" "}
                        <input
                          type="checkbox"
                          onChange={handleCheckboxChange}
                          name="Sua"
                          checked={RoleUserData.Sua}
                        />
                        Xóa{" "}
                        <input
                          type="checkbox"
                          onChange={handleCheckboxChange}
                          name="Xoa"
                          checked={RoleUserData.Xoa}
                        />
                      </div>
                      <div className="employee-type-save">
                        <button
                          className="employee-type-save-save"
                          onClick={handleSave}
                        >
                          Lưu
                        </button>
                        <button
                          className="employee-type-save-exit"
                          onClick={closeInsert}
                        >
                          X
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="branch-filter">
            <button className="branch-filter-coponent">
              <Filter className="filter-icon" />
              <span>Bộ Lọc</span>
            </button>
            <button className="branch-filter-coponent">
              <div className="filter-icon" />
              <span>Tác Vụ</span>
            </button>
          </div>
        </div>
        <div className="branch-table-filter">
          {loading ? (
            <Spinner />
          ) : (
            <div className="branch-table-contain">
              <div className="branch-format-title">
                <b>Loại Tài Liệu</b>
                <b>Chức Danh</b>
                <b>Quyền</b>
                <b></b>
              </div>
              {RoleUser && RoleUser.length > 0
                ? RoleUser.map((item, index) => (
                    <div className="employee-type-format" key={item.ID}>
                      <div
                        onClick={() => openEdit(item.IDChucDanh, item.IDVaiTro)}
                      >
                        {getRoleNameById(item.IDVaiTro)}
                      </div>
                      <div
                        onClick={() => openEdit(item.IDChucDanh, item.IDVaiTro)}
                      >
                        {getTitleNameById(item.IDChucDanh)}
                      </div>
                      <div
                        onClick={() => openEdit(item.IDChucDanh, item.IDVaiTro)}
                      >
                        <div className="checkbox_parent">
                          <div className="checkbox_div">
                            <input
                              type="checkbox"
                              classname="checkbox_role"
                              name="Xem"
                              checked={item.Xem}
                            />{" "}
                            Xem{" "}
                          </div>
                          <div className="checkbox_div">
                            <input
                              type="checkbox"
                              classname="checkbox_role"
                              name="Them"
                              checked={item.Them}
                            />{" "}
                            Thêm
                          </div>
                          <div className="checkbox_div">
                            <input
                              type="checkbox"
                              classname="checkbox_role"
                              name="Sua"
                              checked={item.Sua}
                            />{" "}
                            Sửa
                          </div>
                          <div className="checkbox_div">
                            <input
                              type="checkbox"
                              classname="checkbox_role"
                              name="Xoa"
                              checked={item.Xoa}
                            />{" "}
                            Xóa
                          </div>
                        </div>
                      </div>
                      {edit && (
                        <div className="overlay">
                          <div className="insert">
                            <div className="insert-insert">
                              {loading ? (
                                <Spinner />
                              ) : (
                                <>
                                  <div className="title-insert">
                                    Cập Nhật Quyền
                                  </div>
                                  <form onSubmit={handleEdit}>
                                    <div className="input-insert">
                                      Chức danh
                                      <input
                                        type="text"
                                        value={getTitleNameById(
                                          RoleUserData.IDChucDanh,
                                        )}
                                        required
                                      />
                                      Vai trò
                                      <input
                                        type="text"
                                        value={getRoleNameById(
                                          RoleUserData.IDVaiTro,
                                        )}
                                        required
                                      />
                                      Xem{" "}
                                      <input
                                        type="checkbox"
                                        name="Xem"
                                        onChange={handleCheckboxChange}
                                        checked={RoleUserData.Xem}
                                      />
                                      Thêm{" "}
                                      <input
                                        type="checkbox"
                                        name="Them"
                                        onChange={handleCheckboxChange}
                                        checked={RoleUserData.Them}
                                      />
                                      Sửa
                                      <input
                                        type="checkbox"
                                        onChange={handleCheckboxChange}
                                        name="Sua"
                                        checked={RoleUserData.Sua}
                                      />
                                      Xóa
                                      <input
                                        type="checkbox"
                                        onChange={handleCheckboxChange}
                                        name="Xoa"
                                        checked={RoleUserData.Xoa}
                                      />
                                    </div>
                                    <div className="save">
                                      <button
                                        className="employee-type-save-save"
                                        type="submit"
                                      >
                                        Cập Nhật
                                      </button>
                                      <button
                                        className="employee-type-save-exit"
                                        type="button"
                                        onClick={closeEdit}
                                      >
                                        X
                                      </button>
                                      <button
                                        className="employee-type-save-remove"
                                        type="button"
                                        onClick={handleRemove}
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                  </form>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                : ""}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmployeeRole;
