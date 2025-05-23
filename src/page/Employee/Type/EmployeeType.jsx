import React, { useEffect, useState } from "react";
import FilterHeader from "../../../component/FilterHeader/FilterHeader";
import FilterSidebar from "../../../component/FilterSidebar/FilterSidebar";
import { Filter } from "lucide-react";
import "./EmployeeType.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import API from "../../../api/apiConfig";
import Spinner from "../../../component/spinner/spinner";
const API_URL = API.APIALL;
const EmployeeType = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingS, setLoadingS] = useState(false);
  const [loadingE, setLoadingE] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [insert, setInsert] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [employeeTypeData, setEmployeeTypeData] = useState({
    LoaiNhanVien: "",
  });
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEmployeeTypes();
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

  const fetchEmployeeTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}user/type/selectAll`, {
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
      setEmployeeTypes(data);
      setSelectedItems(data.map(() => false));
      console.log("Rendering EmployeeType component", employeeTypes);
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
    setEmployeeTypeData({ LoaiNhanVien: "" });
  };
  const openEdit = (id) => {
    const itemToEdit = employeeTypes.find((item) => item.ID === id);
    setEmployeeTypeData(itemToEdit);
    setEditingId(id);
    setEdit(true);
  };
  const closeEdit = () => {
    setEdit(false);
    setEmployeeTypeData({ LoaiNhanVien: "" });
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
    setEmployeeTypeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSave = async (e) => {
    setLoadingS(true);
    e.preventDefault();
    const isDuplicate =
      employeeTypes && employeeTypes.length > 0
        ? employeeTypes.some(
            (item) =>
              item.LoaiNhanVien.toLowerCase() ===
              employeeTypeData.LoaiNhanVien.toLowerCase(),
          )
        : false;
    if (isDuplicate) {
      toast.error("Loại Nhân Viên đã tồn tại!", {
        position: "top-right",
      });
      setLoadingS(false);
      return;
    }
    try {
      const newEmployeeType = {
        ...employeeTypeData,
      };
      const response = await fetch(`${API_URL}user/type/creat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployeeType),
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      toast.success("Loại Nhân viên mới đã được tạo thành công!", {
        position: "top-right",
      });

      closeInsert();
      setLoadingS(false);
      fetchEmployeeTypes();
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
    setLoadingE(true);
    const isDuplicate = employeeTypes.some(
      (item) =>
        item.LoaiNhanVien.toLowerCase() ==
        employeeTypeData.LoaiNhanVien.toLowerCase(),
    );
    if (isDuplicate) {
      toast.error("Loại Nhân Viên đã tồn tại!", {
        position: "top-right",
      });
      setLoadingE(false);
      return;
    }

    if (!editingId) return;
    try {
      const response = await fetch(
        `${API_URL}user/type/update/?id=${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(employeeTypeData),
        },
      );
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      toast.success("Thông tin nhóm nhân viên đã cập nhật", {
        position: "top-right",
      });
      setLoadingE(false);
      fetchEmployeeTypes();

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
      const response = await fetch(`${API_URL}user/type/delete/?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.Data == null) {
        toast.error(`${result.Message}`, {
          position: "top-right",
        });
      } else {
        toast.success("Loại Nhân viên đã được xóa thành công!", {
          position: "top-right",
        });
      }
      setLoadingE(false);
      fetchEmployeeTypes();
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
    <div className="employeetype">
      <FilterHeader handleRemoveSelected={handleRemoveSelected} />
      <FilterSidebar />
      <div className="employee-type-table">
        <div className="employee-type-table-header">
          <div className="employee-type-search-filter">
            <input
              className="employee-type-search-filter-input"
              type="text"
              placeholder="Tìm Kiếm"
            />
          </div>
          <div className="branch-insert">
            <button className="branch-insert-button" onClick={openInsert}>
              + Thêm Loại Nhân Viên
            </button>
          </div>
          {insert && (
            <div className="overlay">
              <div className="employee-type-insert">
                <div className="employee-type-insert-insert">
                  <div className="employee-type-title-insert">
                    Thêm Loại Nhân Viên
                  </div>
                  <div className="employee-type-input-insert">
                    <form onSubmit={handleSave}>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="LoaiNhanVien"
                        placeholder="Nhập loại nhân viên"
                        required
                      />
                    </form>
                  </div>
                  <div className="employee-type-save">
                    {loadingS ? <Spinner /> : ""}
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
          <div className="employee-type-filter">
            <button className="employee-type-filter-coponent">
              <Filter className="filter-icon" />
              <span>Bộ Lọc</span>
            </button>
            <button className="employee-type-filter-coponent">
              <div className="filter-icon" />
              <span>Tác Vụ</span>
            </button>
          </div>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="employee-type-table-filter">
            <div className="employee-type-table-contain">
              <div className="employee-type-format-title">
                <b>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </b>
                <b>ID</b>
                <b>Loại Nhân Viên</b>
              </div>
              {employeeTypes && employeeTypes.length > 0
                ? employeeTypes.map((item, index) => (
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
                        {item.LoaiNhanVien}
                      </div>
                      {edit && editingId === item.ID && (
                        <div className="overlay">
                          <div className="insert">
                            <div className="insert-insert">
                              <div className="title-insert">
                                Cập Nhật Loại Nhân Viên
                              </div>
                              <form onSubmit={handleEdit}>
                                <div className="input-insert">
                                  <input
                                    type="text"
                                    onChange={handleChange}
                                    value={employeeTypeData.LoaiNhanVien}
                                    name="LoaiNhanVien"
                                    required
                                  />
                                </div>
                                <div>{loadingE ? <Spinner /> : ""}</div>
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
export default EmployeeType;
