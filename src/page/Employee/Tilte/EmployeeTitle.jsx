import React, { useState, useEffect } from "react";
import "./EmployeeTitle.css";
import FilterHeader from "../../../component/FilterHeader/FilterHeader";
import FilterSidebar from "../../../component/FilterSidebar/FilterSidebar";
import { Filter } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import API from "../../../api/apiConfig";
import Spinner from "../../../component/spinner/spinner";

const API_URL = API.APIALL;

const EmployeeTitle = () => {
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [insert, setInsert] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [chucdanhData, setChucdanhData] = useState({ TenChucDanh: "" });
  const [chucdanh, setChucDanh] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingS, setLoadingS] = useState(false);
  const [loadingE, setLoadingE] = useState(false);

  const token = localStorage.getItem("token");
  useEffect(() => {
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

  const fetchTitle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}title/selectAll`, {
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
      setChucDanh(data);
      setLoading(false);
      setSelectedItems(data.map(() => false));
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
    setChucdanhData({ TenChucDanh: "" });
  };

  const openEdit = (id) => {
    const itemToEdit = chucdanh.find((item) => item.ID === id);
    setChucdanhData(itemToEdit);
    setEditingId(id);
    setEdit(true);
  };

  const closeEdit = () => {
    setEdit(false);
    setChucdanhData({ TenChucDanh: "" });
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
    setChucdanhData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isDuplicate =
      chucdanh && chucdanh.length > 0
        ? chucdanh.some(
            (item) =>
              item.TenChucDanh.toLowerCase() ===
              chucdanhData.TenChucDanh.toLowerCase(),
          )
        : false;
    if (isDuplicate) {
      toast.error("Chức Danh Nhân Viên đã tồn tại!", {
        position: "top-right",
      });
      return;
    }
    setLoadingS(true);
    try {
      const newChucDanh = { ...chucdanhData };
      const response = await fetch(`${API_URL}title/creat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newChucDanh),
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      toast.success("Chức Danh mới đã được tạo thành công!", {
        position: "top-right",
      });
      setLoadingS(false);
      fetchTitle();
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
    try {
      const response = await fetch(`${API_URL}title/update/?id=${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(chucdanhData),
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }

      toast.success("Thông tin chức danh đã được cập nhật", {
        position: "top-right",
      });
      setLoadingE(false);
      fetchTitle();
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
      const response = await fetch(`${API_URL}title/delete/?id=${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      toast.success("Chức Danh đã được xóa thành công!", {
        position: "top-right",
      });
      setLoadingE(false);
      fetchTitle();
      closeEdit();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
      setLoadingE(false);
    }
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
          fetch(`${API_URL}/${id}`, {
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
              + Thêm Chức Danh
            </button>
          </div>
          {insert && (
            <div className="overlay">
              <div className="employee-type-insert">
                <div className="employee-type-insert-insert">
                  <div className="employee-type-title-insert">
                    Thêm Chức Danh
                  </div>
                  <div className="employee-type-input-insert">
                    <form onSubmit={handleSave}>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="TenChucDanh"
                        value={chucdanhData.TenChucDanh}
                        placeholder="Nhập chức danh"
                        required
                      />
                      {loadingS ? <Spinner /> : ""}
                      <div className="employee-type-save">
                        <button
                          className="employee-type-save-save"
                          type="submit"
                        >
                          Lưu
                        </button>
                        <button
                          className="employee-type-save-exit"
                          type="button"
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
                <b>ID</b>
                <b>Chức Danh</b>
              </div>
              {chucdanh && chucdanh.length > 0
                ? chucdanh.map((item, index) => (
                    <div className="employee-type-format" key={item.ID}>
                      <div>
                        <input
                          type="checkbox"
                          checked={selectedItems[index]}
                          onChange={handleItemChange(index)}
                        />
                      </div>
                      <div onClick={() => openEdit(item.ID)}>{item.ID}</div>
                      <div onClick={() => openEdit(item.ID)}>
                        {item.TenChucDanh}
                      </div>
                      {edit && editingId === item.ID && (
                        <div className="overlay">
                          <div className="insert">
                            <div className="insert-insert">
                              <div className="title-insert">
                                Cập Nhật Chức Danh
                              </div>
                              <form onSubmit={handleEdit}>
                                <div className="input-insert">
                                  <input
                                    type="text"
                                    onChange={handleChange}
                                    value={chucdanhData.TenChucDanh}
                                    name="TenChucDanh"
                                    required
                                  />
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

export default EmployeeTitle;
