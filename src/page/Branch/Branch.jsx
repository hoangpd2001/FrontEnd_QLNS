import React, { useEffect, useState } from "react";
import "./Branch.css";
import FilterHeader from "../../component/FilterHeader/FilterHeader";
import FilterSidebar from "../../component/FilterSidebar/FilterSidebar";
import { Filter } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import API from "../../api/apiConfig";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Spinner from "../../component/spinner/spinner";

const Branch = () => {
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [insert, setInsert] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [branchData, setBranchData] = useState({ ChiNhanh: "" });
  const [branch, setBranch] = useState([]);
  const [phongban, setPhongban] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingS, setLoadingS] = useState(false);
  const [loadingE, setLoadingE] = useState(false);

  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchBranch();
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
  const fetchDepartment = async () => {
    try {
      const response = await fetch(API.APIALL);
      const result = await response.json();
      const data = await result.Data;
      setPhongban(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  const fetchBranch = async () => {
    setLoading(true);
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
      setBranch(data);
      setSelectedItems(Array(data.length).fill(false));
      setLoading(false);
      console.log("Rendering Branch component", branch);
    } catch (error) {
      if(error.message == "Failed to fetch"){
        toast.error("Không thể kết nối với server, Vui lòng kiểm tra lại !!", {
        position: "top-right",
      });
      }else{
      toast.error(error.message, {
        position: "top-right",
      });
    }
      setLoading(false);
    }
  };

  const openInsert = () => {
    setInsert(true);
  };

  const closeInsert = () => {
    setInsert(false);
    setBranchData({ ChiNhanh: "" });
  };

  const openEdit = (id) => {
    const itemToEdit = branch.find((item) => item.ID === id);
    setBranchData({ ...itemToEdit });
    setEditingId(id);
    setEdit(true);
  };

  const closeEdit = () => {
    setEdit(false);
    setBranchData({ ChiNhanh: "" });
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
    setBranchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoadingS(true);
    const isDuplicate =
      branch && branch.length > 0
        ? branch.some((item) => item.ChiNhanh === branchData.ChiNhanh)
        : false;
    if (isDuplicate) {
      toast.error("Chi nhánh đã tồn tại!", {
        position: "top-right",
      });
      setLoadingS(false);
      return;
    }

    try {
      const newBranch = {
        ...branchData,
      };
      const response = await fetch(`${API.APIALL}branch/creat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBranch),
      });
      const createdBranch = await response.json();
      if (createdBranch.StatusCode != 200) {
        throw new Error(createdBranch.Message);
      }
      fetchBranch();
      toast.success("Chi Nhánh mới đã được tạo thành công!", {
        position: "top-right",
      });
      fetchBranch();
      setLoadingS(false);
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
      const response = await fetch(
        `${API.APIALL}branch/update/?id=${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(branchData),
        },
      );
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }

      toast.success("Thông tin chi nhánh", {
        position: "top-right",
      });
      fetchBranch();
      setLoadingE(false);
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
      const response = await fetch(`${API.APIALL}branch/delete/?id=${id}`, {
        method: "DELETE",
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

      setBranch((prevBranches) =>
        prevBranches.filter((item) => item.ID !== id),
      );
      toast.success("Chi nhánh đã được xóa thành công!", {
        position: "top-right",
      });
      setLoadingE(false);
      fetchBranch();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
      setLoadingE(false);
    }
  };
  const handleRemoveDepartment = async (id) => {
    if (!id) return;
    const confirmed = await confirm();
    if (!confirmed) return;
    try {
      await fetch(`${API.APIALL}/?ID_ChiNhanh=${id}`, {
        method: "DELETE",
      });
      toast.success("Phòng Ban thuộc chi nhánh này đã được xóa thành công!", {
        position: "top-right",
      });
      fetchDepartment();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
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
              + Thêm Chi Nhánh{" "}
            </button>
          </div>
          {insert && (
            <div className="overlay">
              <div className="employee-type-insert">
                <div className="employee-type-insert-insert">
                  <div className="employee-type-title-insert">
                    Thêm Chi Nhánh
                  </div>
                  <div className="employee-type-input-insert">
                    <form onSubmit={handleSave}>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="ChiNhanh"
                        value={branchData.ChiNhanh}
                        placeholder="Nhập Chi Nhánh"
                        required
                      />
                    </form>
                    {loadingS ? <Spinner /> : ""}
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
                <b>Tên Chi Nhánh</b>
              </div>
              {branch && branch.length > 0
                ? branch.map((item, index) => (
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
                        {item.ChiNhanh}
                      </div>
                      {edit && editingId === item.ID && (
                        <div className="overlay">
                          <div className="insert">
                            <div className="insert-insert">
                              <div className="title-insert">
                                Cập Nhật Chi Nhánh
                              </div>
                              <form onSubmit={handleEdit}>
                                <div className="input-insert">
                                  <input
                                    type="text"
                                    onChange={handleChange}
                                    value={branchData.ChiNhanh}
                                    name="ChiNhanh"
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

export default Branch;
