import React from "react";
import "./Department.css";
import FilterHeader from "../../component/FilterHeader/FilterHeader";
import FilterSidebar from "../../component/FilterSidebar/FilterSidebar";
import { useState } from "react";
import { Filter } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import API from "../../api/apiConfig";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Spinner from "../../component/spinner/spinner";

const Department = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [insert, setInsert] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [phongbanData, setPhongBanData] = useState({
    TenPhongBan: "",
    IDChiNhanh: 0,
  });
  const [branches, setBranches] = useState([]);
  const [phongban, setPhongban] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingS, setLoadingS] = useState(false);
  const [loadingE, setLoadingE] = useState(false);

  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchDepartment();
    fetchBranches();
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
  const fetchBranches = async () => {
    try {
      const response = await fetch(`${API.APIALL}branch/selectAll`, {
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

      console.log("Fetched branches:", data);
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  const fetchDepartment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API.APIALL}department/selectAll`, {
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
      setPhongban(data);
      setLoading(false);
      setSelectedItems(data.map(() => false));
      console.log("Rendering EmployeeType component", phongban);
    } catch (error) {
      if(error.message == "Failed to fetch"){
        toast.error("Không thể kết nối với server, Vui lòng kiểm tra lại !!", {
        position: "top-right",
      });
      }else
      toast.error(error.message, {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const openInsert = () => {
    setInsert(true);
  };

  const closeInsert = () => {
    setInsert(false);
    setPhongBanData({ TenPhongBan: "", IDChiNhanh: 0 });
  };

  const openEdit = (id) => {
    const itemToEdit = phongban.find((item) => item.ID == id);
    setPhongBanData(itemToEdit);
    setEditingId(id);
    setEdit(true);
  };

  const closeEdit = () => {
    setEdit(false);
    setPhongBanData({ TenPhongBan: "", IDChiNhanh: 0 });
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
    setPhongBanData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const isDuplicate =
      phongban && phongban.length > 0
        ? phongban.some(
            (item) =>
              item.TenPhongBan.toLowerCase() ==
                phongbanData.TenPhongBan.toLowerCase() &&
              item.IDChiNhanh == phongbanData.IDChiNhanh,
          )
        : false;
    if (isDuplicate) {
      toast.error("Phòng Bạn đã tồn tại!", {
        position: "top-right",
      });
      return;
    }
    setLoadingS(true);
    try {
      const newDepartment = {
        ...phongbanData,
      };
      newDepartment.IDChiNhanh = parseInt(newDepartment.IDChiNhanh);
      const response = await fetch(`${API.APIALL}department/creat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDepartment),
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
        throw new Error(result.Message);
      }
      toast.success("Phòng ban mới đã được tạo thành công!", {
        position: "top-right",
      });
      setLoadingS(false);
      fetchDepartment();
      closeInsert();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
      setLoadingS(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const confirmed = await confirm();
    if (!confirmed) return;
    if (!editingId) return;
    setLoadingE(true);
    phongbanData.IDChiNhanh = parseInt(phongbanData.IDChiNhanh);
    try {
      const response = await fetch(
        `${API.APIALL}department/update/?id=${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(phongbanData),
        },
      );
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(errorMessage);
      }

      toast.success("Thông tin phòng ban đã cập nhật", {
        position: "top-right",
      });
      setLoadingE(false);
      fetchDepartment(); // Đảm bảo fetch lại dữ liệu
      closeEdit();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
      setLoadingE(false);
    }
  };

  const handleRemove = async (id) => {
    if (!id) return;
    const confirmed = await confirm();
    if (!confirmed) return;
    setLoadingE(true);
    try {
      const response = await fetch(`${API.APIALL}department/delete/?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(errorMessage);
      }
      toast.success("Phòng Ban đã được xóa thành công!", {
        position: "top-right",
      });
      setLoadingE(false);
      fetchDepartment();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
      setLoadingE(false);
    }
  };
  const getBranchNameById = (id) => {
    const branch = branches.find((branch) => branch.ID === id);
    return branch ? branch.ChiNhanh : "Unknown";
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
      <FilterSidebar />
      <div className="branch-table">
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
              + Thêm Phòng Ban{" "}
            </button>
          </div>
          {insert && (
            <div className="overlay">
              <div className="employee-type-insert">
                <div className="employee-type-insert-insert">
                  <div className="employee-type-title-insert">
                    Thêm Phòng Ban
                  </div>
                  <div className="employee-type-input-insert">
                    <form onSubmit={handleSave}>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="TenPhongBan"
                        placeholder="Nhập Phòng Ban"
                        required
                      />
                      <select
                        name="IDChiNhanh"
                        value={phongbanData.IDChiNhanh}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Chọn Chi Nhánh</option>
                        {branches && branches.length > 0 ? (
                          branches.map((branch) => (
                            <option key={branch.ID} value={branch.ID}>
                              {branch.ChiNhanh}
                            </option>
                          ))
                        ) : (
                          <option>Không có chi nhánh nào</option>
                        )}
                      </select>
                    </form>
                  </div>
                  {loadingS ? <Spinner /> : ""}
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
        {loading ? (
          <Spinner />
        ) : (
          <div className="branch-table-filter">
            <div className="branch-table-contain">
              <div className="branch-format-title">
                <b>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </b>
                <b>Phòng Ban</b>
                <b>Chi Nhánh</b>
              </div>
              {phongban && phongban.length > 0
                ? phongban.map((item, index) => (
                    <div className="employee-type-format" key={item.ID}>
                      <div>
                        <input
                          type="checkbox"
                          checked={selectedItems[index]}
                          onChange={handleItemChange(index)}
                        />
                      </div>
                      <div onClick={() => openEdit(item.ID)}>
                        {item.TenPhongBan}
                      </div>
                      <div onClick={() => openEdit(item.ID)}>
                        {getBranchNameById(item.IDChiNhanh)}
                      </div>
                      {edit && editingId === item.ID && (
                        <div className="overlay">
                          <div className="insert">
                            <div className="insert-insert">
                              <div className="title-insert">
                                Cập Nhật Phòng Ban
                              </div>
                              <form onSubmit={handleEdit}>
                                <div className="input-insert">
                                  <input
                                    type="text"
                                    onChange={handleChange}
                                    value={phongbanData.TenPhongBan}
                                    name="TenPhongBan"
                                    required
                                  />
                                  <select
                                    name="IDChiNhanh"
                                    value={phongbanData.IDChiNhanh}
                                    onChange={handleChange}
                                  >
                                    <option value="">Chọn Chi Nhánh</option>
                                    {branches.map((branch) => (
                                      <option key={branch.ID} value={branch.ID}>
                                        {branch.ChiNhanh}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                {loadingE ? <Spinner /> : ""}
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
                                    onClick={() => handleRemove(item.ID)}
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                : ""}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Department;
