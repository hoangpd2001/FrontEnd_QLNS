import React, { useState, useEffect } from "react";
import "./EmployeeLevel.css";
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

const EmployeeLevel = () => {
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [insert, setInsert] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [capbacData, setCapBacData] = useState({
    TenCapBac: "",
    CauTrucLuong: "",
  });
  const [capbac, setCapbac] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingS, setLoadingS] = useState(false);
  const [loadingE, setLoadingE] = useState(false);

  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchLevel();
  }, []);

  const fetchLevel = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}level/selectAll`, {
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

      setCapbac(data);
      setSelectedItems(data.map(() => false));
      setLoading(false);
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
    setCapBacData({ TenCapBac: "", CauTrucLuong: "" });
  };

  const openEdit = (id) => {
    const itemToEdit = capbac.find((item) => item.ID === id);
    setCapBacData(itemToEdit);
    setEditingId(id);
    setEdit(true);
  };

  const closeEdit = () => {
    setEdit(false);
    setCapBacData({ TenCapBac: "", CauTrucLuong: "" });
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
    setCapBacData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isDuplicate =
      capbac && capbac.length > 0
        ? capbac.some((item) => item.TenCapBac === capbacData.TenCapBac)
        : false;
    if (isDuplicate) {
      toast.error("Cấp Bậc Nhân Viên đã tồn tại!", {
        position: "top-right",
      });
      return;
    }
    setLoadingS(true);
    try {
      const newCapbac = { ...capbacData };
      newCapbac.CauTrucLuong = parseInt(newCapbac.CauTrucLuong);
      const response = await fetch(`${API_URL}level/creat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCapbac),
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      toast.success("Cấp Bậc mới đã được tạo thành công!", {
        position: "top-right",
      });
      setLoadingS(false);
      fetchLevel();
      closeInsert();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
      setLoadingS(false);
    }
  };
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

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    const confirmed = await confirm();
    if (!confirmed) return;
    setLoadingE(true);
    try {
      capbacData.CauTrucLuong = parseInt(capbacData.CauTrucLuong);
      const response = await fetch(`${API_URL}level/update/?id=${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(capbacData),
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }

      toast.success("Thông tin cấp bậc nhân viên đã được cập nhật", {
        position: "top-right",
      });
      setLoadingE(false);
      fetchLevel();
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
      const response = await fetch(`${API_URL}level/delete/?id=${id}`, {
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
      toast.success("Cấp Bậc Nhân viên đã được xóa thành công!", {
        position: "top-right",
      });
      setLoadingE(false);
      fetchLevel();
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
              + Thêm Cấp Bậc
            </button>
          </div>
          {insert && (
            <div className="overlay">
              <div className="employee-type-insert">
                <div className="employee-type-insert-insert">
                  <div className="employee-type-title-insert">
                    Thêm Cấp Bậc Nhân Viên
                  </div>
                  <div className="employee-type-input-insert">
                    <form onSubmit={handleSave}>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="TenCapBac"
                        value={capbacData.TenCapBac}
                        placeholder="Nhập cấp bậc nhân viên"
                        required
                      />
                      <input
                        type="text"
                        onChange={handleChange}
                        name="CauTrucLuong"
                        value={capbacData.CauTrucLuong}
                        placeholder="Nhập cấu trúc lương"
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
                <b>Cấp Bậc</b>
                <b>Cấu Trúc Lương</b>
              </div>
              {capbac && capbac.length > 0
                ? capbac.map((item, index) => (
                    <div className="employee-type-format" key={item.ID}>
                      <div>
                        <input
                          type="checkbox"
                          checked={selectedItems[index]}
                          onChange={handleItemChange(index)}
                        />
                      </div>
                      <div onClick={() => openEdit(item.ID)}>
                        {item.TenCapBac}
                      </div>
                      <div onClick={() => openEdit(item.ID)}>
                        {item.CauTrucLuong}
                      </div>
                      {edit && editingId === item.ID && (
                        <div className="overlay">
                          <div className="insert">
                            <div className="insert-insert">
                              <div className="title-insert">
                                Cập Nhật Cấp Bậc Nhân Viên
                              </div>
                              <form onSubmit={handleEdit}>
                                <div className="input-insert">
                                  <input
                                    type="text"
                                    onChange={handleChange}
                                    value={capbacData.TenCapBac}
                                    name="TenCapBac"
                                    required
                                  />
                                  <input
                                    type="text"
                                    onChange={handleChange}
                                    value={capbacData.CauTrucLuong}
                                    name="CauTrucLuong"
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
        <ToastContainer />
      </div>
    </div>
  );
};

export default EmployeeLevel;
