import React, { useState, useEffect } from "react";
import "./EmployeeHealthInsurance.css";
import FilterHeader from "../../../component/FilterHeader/FilterHeader";
import FilterSidebar from "../../../component/FilterSidebar/FilterSidebar";
import { Filter } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import API from "../../../api/apiConfig";
import Spinner from "../../../component/spinner/spinner";

import { Fa500Px } from "react-icons/fa";
const API_URL = API.APIALL;

const EmployeeHealthInsurance = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [insert, setInsert] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [baohiemData, setBaoHiemData] = useState({
    TenBaoHiem: "",
    NhaCungCap: "",
    NoiDangKi: "",
    TyLePhi: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingS, setLoadingS] = useState(false);
  const [loadingE, setLoadingE] = useState(false);
  const [baohiem, setBaoHiem] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchHealthInsurance();
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

  const fetchHealthInsurance = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}user/insurance/selectAll`, {
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
      setBaoHiem(data);
      setSelectedItems(data.map(() => false));
      console.log("Fetched health insurances:", data);
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
    setBaoHiemData({
      TenBaoHiem: "",
      NhaCungCap: "",
      NoiDangKy: "",
      TyLePhi: "",
    });
  };
  const openEdit = (id) => {
    const itemToEdit = baohiem.find((item) => item.ID === id);
    setBaoHiemData(itemToEdit);
    setEditingId(id);
    setEdit(true);
  };
  const closeEdit = () => {
    setEdit(false);
    setBaoHiemData({
      TenBaoHiem: "",
      NhaCungCap: "",
      NoiDangKi: "",
      TyLePhi: "",
    });
    setEditingId(null);
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
    setBaoHiemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const isDuplicate =
      baohiem && baohiem.length > 0
        ? baohiem.some((item) => item.TenBaoHiem === baohiemData.TenBaoHiem)
        : false;
    if (isDuplicate) {
      toast.error("Bảo hiểm Nhân Viên đã tồn tại!", {
        position: "top-right",
      });
      return;
    }
    setLoadingS(true);
    try {
      const newHealthInsurance = {
        ...baohiemData,
      };
      newHealthInsurance.TyLePhi = parseInt(newHealthInsurance.TyLePhi);
      const response = await fetch(`${API_URL}user/insurance/creat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newHealthInsurance),
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      toast.success("Bảo Hiểm Nhân viên mới đã được tạo thành công!", {
        position: "top-right",
      });
      setLoadingS(false);
      fetchHealthInsurance();
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
    baohiemData.TyLePhi = parseInt(baohiemData.TyLePhi);
    setLoadingE(true);
    try {
      const response = await fetch(
        `${API_URL}user/insurance/update/?id=${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(baohiemData),
        },
      );

      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      toast.success("Thông tin bảo hiểm  đã cập nhật", {
        position: "top-right",
      });
      setLoadingE(false);
      fetchHealthInsurance();
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
      const response = await fetch(
        `${API_URL}user/insurance/delete/?id=${id}`,
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
        throw new Error(`${errorMessage}`);
      }
      toast.success("Bảo Hiểm Nhân viên đã được xóa thành công!", {
        position: "top-right",
      });
      setLoadingE(false);
      fetchHealthInsurance();
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
              + Thêm Bảo Hiểm
            </button>
          </div>
          {insert && (
            <div className="overlay">
              <div className="employee-type-insert">
                <div className="employee-type-insert-insert">
                  <div className="employee-type-title-insert">
                    Thêm Bảo Hiểm Nhân Viên
                  </div>
                  <div className="employee-type-input-insert">
                    <form onSubmit={handleSave}>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="TenBaoHiem"
                        placeholder="Nhập Bảo Hiểm"
                        required
                      />
                      <input
                        type="text"
                        onChange={handleChange}
                        name="NhaCungCap"
                        placeholder="Nhập Nhà Cung Cấp"
                        required
                      />
                      <input
                        type="text"
                        onChange={handleChange}
                        name="NoiDangKi"
                        placeholder="Nhập Nơi Đăng Kí"
                        required
                      />
                      <input
                        type="text"
                        onChange={handleChange}
                        name="TyLePhi"
                        placeholder="Nhập Tỉ lệ Phí"
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
          <div className="health-insurance-table-filter">
            <div className="health-insurance-table-contain">
              <div className="health-insurance-format-title">
                <b>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </b>
                <b>Bảo Hiểm</b>
                <b>Nhà Cung Cấp</b>
                <b>Nơi Đăng Kí</b>
                <b>Tỉ Lệ Phí</b>
              </div>
              {baohiem && baohiem.length > 0
                ? baohiem.map((item, index) => (
                    <div className="health-insurance-type-format" key={item.ID}>
                      <div>
                        <input
                          type="checkbox"
                          checked={selectedItems[index]}
                          onChange={handleItemChange(index)}
                        />
                      </div>
                      <div onClick={() => openEdit(item.ID)}>
                        {item.TenBaoHiem}
                      </div>
                      <div onClick={() => openEdit(item.ID)}>
                        {item.NhaCungCap}
                      </div>
                      <div onClick={() => openEdit(item.ID)}>
                        {item.NoiDangKi}
                      </div>
                      <div onClick={() => openEdit(item.ID)}>
                        {item.TyLePhi}
                      </div>
                      {edit && editingId === item.ID && (
                        <div className="overlay">
                          <div className="insert">
                            <div className="insert-insert">
                              <div className="title-insert">
                                Cập Nhật Bảo Hiểm Nhân Viên
                              </div>
                              <form onSubmit={handleEdit}>
                                <div className="input-insert">
                                  <div>Tên Bảo Hiểm</div>
                                  <input
                                    type="text"
                                    onChange={handleChange}
                                    value={baohiemData.TenBaoHiem}
                                    name="TenBaoHiem"
                                    required
                                  />
                                  <div>Nhà Cung Cấp</div>
                                  <input
                                    type="text"
                                    onChange={handleChange}
                                    value={baohiemData.NhaCungCap}
                                    name="NhaCungCap"
                                    required
                                  />
                                  <div>Nơi Đăng Ký</div>
                                  <input
                                    type="text"
                                    onChange={handleChange}
                                    value={baohiemData.NoiDangKi}
                                    name="NoiDangKi"
                                    required
                                  />
                                  <div>Tỉ Lệ Phí</div>
                                  <input
                                    type="text"
                                    onChange={handleChange}
                                    value={baohiemData.TyLePhi}
                                    name="TyLePhi"
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

export default EmployeeHealthInsurance;
