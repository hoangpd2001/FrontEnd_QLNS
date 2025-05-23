import React, { useState, useEffect } from "react";
import "./EmployeeGroup.css";
import FilterHeader from "../../../component/FilterHeader/FilterHeader";
import FilterSidebar from "../../../component/FilterSidebar/FilterSidebar";
import { Filter, Pencil, CircleX } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import API from "../../../api/apiConfig";
import Spinner from "../../../component/spinner/spinner";

const API_URL = API.APIALL;
const GROUP_EMPLOYEE_API_URL = API.APIALL;
const NHANVIEN_API_URL = API.APIALL;
const EmployeeGroup = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [insert, setInsert] = useState(false);
  const [insertGE, setInsertGE] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editGE, setEditGE] = useState(false);
  const [editingIdGE, setEditingIdGE] = useState(null);
  const [nhomnhanvienData, setNhomnhanvienData] = useState({ TenNhom: "" });
  const [nhomnhanvien, setNhomnhanvien] = useState([]);
  const [nhanvien, setNhanvien] = useState([]);
  const [group_empData, setGroup_empData] = useState({
    IDNhanVien: "",
    IDNhom: "",
  });
  const [group_emp, setGroup_emp] = useState([]);
  const [loading, setLoading] = useState(false);

  const [loadingSE, setLoadingSE] = useState(false);
  const [loadingS, setLoadingS] = useState(false);
  const [loadingE, setLoadingE] = useState(false);
  const [loadingEE, setLoadingEE] = useState(false);

  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchGroup();
    fetchGroup_Employee();
    fetchGEmployee();
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

  const fetchGEmployee = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${NHANVIEN_API_URL}user/selectAll`, {
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
      setNhanvien(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const fetchGroup_Employee = async () => {
    setLoadingEE(true);
    try {
      const response = await fetch(
        `${GROUP_EMPLOYEE_API_URL}userGrup/select/`,
        {
          method: "GET",
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
      const data = await result.Data;
      setGroup_emp(data);
      setLoadingEE(false);
    } catch (error) {
      setLoadingEE(false);
    }
  };
  const fetchGroup = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}grup/selectAll`, {
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

      setNhomnhanvien(data);
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
  const openInsertGE = () => {
    setInsertGE(true);
  };
  const closeInsert = () => {
    setInsert(false);
    setNhomnhanvienData({ TenNhom: "" });
  };
  const closeInsertGE = () => {
    setInsertGE(false);
    setGroup_empData({ IDNhanVien: "", IDNhom: "" });
  };
  const openEdit = (id) => {
    const itemToEdit = nhomnhanvien.find((item) => item.ID === id);
    setNhomnhanvienData(itemToEdit);
    setEditingId(id);
    setEdit(true);
  };
  const closeEdit = () => {
    setEdit(false);
    setNhomnhanvienData({ TenNhom: "" });
  };
  const openEditGE = (id) => {
    setEditingIdGE(id);
    let  employeesInGroup
    console.log("1111111111111111111111111111112");
    if(group_emp){
       employeesInGroup = group_emp.filter((item) => item.IDNhom == id);
        setGroup_empData({ ...group_empData, employeesInGroup });
        console.log("111111111111111111111111111111");
    }
    setEditGE(true);
  };
  const closeEditGE = () => {
    setEditGE(false);
    setGroup_empData({ IDNhanVien: "", IDNhom: "" });
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
    setNhomnhanvienData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const getEmployeeNameById = (id) => {
    const employee = nhanvien.find((item) => item.ID === id);
    return employee ? `${employee.Ho} ${employee.Dem} ${employee.Ten}` : "";
  };
  const getGrupNameById = (id) => {
    const employee = nhomnhanvien.find((item) => item.ID === id);
    return employee ? employee.TenNhom : "";
  };
  const handleChangeGE = (e) => {
    const { name, value } = e.target;
    setGroup_empData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const isDuplicate =
      nhomnhanvien && nhomnhanvien.length > 0
        ? nhomnhanvien.some(
            (item) =>
              item.TenNhom.toLowerCase() ===
              nhomnhanvienData.TenNhom.toLowerCase(),
          )
        : false;
    if (isDuplicate) {
      toast.error("Nhóm hiểm Nhân Viên đã tồn tại!", {
        position: "top-right",
      });
      return;
    }
    setLoadingS(true);
    try {
      const newNhomnhanvien = { ...nhomnhanvienData };
      const response = await fetch(`${API_URL}grup/creat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNhomnhanvien),
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      toast.success("Nhóm Nhân viên mới đã được tạo thành công!", {
        position: "top-right",
      });
      setLoadingS(false);
      fetchGroup();
      closeInsert();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
      setLoadingS(false);
    }
  };
  const handleSaveGE = async (e) => {
    e.preventDefault();
    group_empData.IDNhom = editingIdGE;
    // const isDuplicate = group_emp.some(
    //   (item) =>
    //     item.IDNhanVien == group_empData.IDNhanVien &&
    //     item.IDNhom == editingIdGE,
    // );
    // if (isDuplicate) {
    //   toast.error(" Nhân Viên đã thuộc nhóm này!", {
    //     position: "top-right",
    //   });
    //   return;
    // }
    setLoadingSE(true);
    try {
      const newNhomnhanvien = { ...group_empData };
      newNhomnhanvien.IDNhanVien = await parseInt(newNhomnhanvien.IDNhanVien);
      newNhomnhanvien.IDNhom = await parseInt(newNhomnhanvien.IDNhom);
      const response = await fetch(`${GROUP_EMPLOYEE_API_URL}userGrup/creat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNhomnhanvien),
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }
      toast.success("Nhân viên đã được thêm thành công!", {
        position: "top-right",
      });
      setLoadingSE(false);
      fetchGroup_Employee();
      closeInsertGE();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
      setLoadingSE(false);
    }
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    const confirmed = await confirm();
    if (!confirmed) return;
    const isDuplicate = nhomnhanvien.some(
      (item) =>
        item.TenNhom.toLowerCase() === nhomnhanvienData.TenNhom.toLowerCase(),
    );
    if (isDuplicate) {
      toast.error("Nhóm Nhân Viên đã tồn tại!", {
        position: "top-right",
      });
      return;
    }

    if (!editingId) return;
    setLoadingE(true);
    try {
      const response = await fetch(`${API_URL}grup/update/?id=${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nhomnhanvienData),
      });

      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }

      toast.success("Thông tin nhóm nhân viên đã cập nhật", {
        position: "top-right",
      });
      setLoadingE(false);
      fetchGroup();
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
      const response = await fetch(`${API_URL}grup/delete/?id=${id}`, {
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
      toast.success("Nhóm Nhân viên đã được xóa thành công!", {
        position: "top-right",
      });
      setLoadingE(false);
      fetchGroup();
      closeEdit();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
      setLoadingE(false);
    }
  };
  const handleRemoveGE = async (id, idn) => {
    if (!id) return;
    const confirmed = await confirm();
    if (!confirmed) return;
    setLoadingEE(true);
    try {
      await fetch(
        `${GROUP_EMPLOYEE_API_URL}userGrup/delete/?id=${id}&ids=${idn}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Nhân viên đã được xóa ra khỏi nhóm thành công!", {
        position: "top-right",
      });
      setLoadingEE(false);
      fetchGroup_Employee();
      //closeEditGE();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
      setLoadingEE(false);
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
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
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
              + Thêm Nhóm{" "}
            </button>
          </div>
          {insert && (
            <div className="overlay">
              <div className="employee-type-insert">
                <div className="employee-type-insert-insert">
                  <div className="employee-type-title-insert">Thêm Nhóm</div>
                  <div className="employee-type-input-insert">
                    <form onSubmit={handleSave}>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="TenNhom"
                        placeholder="Nhập Nhóm nhân viên"
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
            <div className="gropup-table-contain">
              <div className="group-format-title">
                <b>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </b>
                <b>ID</b>
                <b>Nhóm Nhân Viên</b>
              </div>
              {nhomnhanvien && nhomnhanvien.length > 0
                ? nhomnhanvien.map((item, index) => (
                    <div className="group-format" key={item.ID}>
                      <div>
                        <input
                          type="checkbox"
                          checked={selectedItems[index]}
                          onChange={handleItemChange(index)}
                        />
                      </div>
                      <div onClick={() => openEditGE(item.ID)}>{item.ID}</div>
                      <div onClick={() => openEditGE(item.ID)}>
                        {item.TenNhom}
                      </div>
                      <div onClick={() => openEdit(item.ID)}>
                        <Pencil />
                      </div>
                      {edit && editingId === item.ID && (
                        <div className="overlay">
                          <div className="insert">
                            <div className="insert-insert">
                              <div className="title-insert">
                                Cập Nhật Nhóm Nhân Viên
                              </div>
                              <form onSubmit={handleEdit}>
                                <div className="input-insert">
                                  <input
                                    type="text"
                                    onChange={handleChange}
                                    value={nhomnhanvienData.TenNhom}
                                    name="TenNhom"
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
                      {editGE && editingIdGE === item.ID && (
                        <div className="overlay">
                          <div className="insert-group-employee">
                            <div className="insert-insert-group-employee">
                              <div className="title-insert-group-employee">
                                Danh sách nhân viên
                              </div>
                              <table>
                                <thead>
                                  <tr>
                                    <th>STT</th>
                                    <th>Tên Nhân Viên</th>
                                    <th>Xóa</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {group_emp && group_emp.length>0 && group_emp
                                    .filter((emp) => emp.IDNhom == editingIdGE)
                                    .map((item, index) => (
                                      <tr key={item.ID}>
                                        <td>{index + 1}</td>
                                        <td>
                                          {getEmployeeNameById(item.IDNhanVien)}
                                        </td>

                                        <td>
                                          <CircleX
                                            onClick={() =>
                                              handleRemoveGE(
                                                item.IDNhanVien,
                                                item.IDNhom,
                                              )
                                            }
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                              <br />
                              {loadingEE ? <Spinner /> : ""}
                              <button
                                className="branch-insert-button"
                                onClick={openInsertGE}
                              >
                                {" "}
                                + Thêm Nhân Viên{" "}
                              </button>
                              <button
                                style={{ float: "right", marginRight: "70px" }}
                                className="employee-type-save-exit"
                                type="button"
                                onClick={closeEditGE}
                              >
                                X
                              </button>
                              {insertGE && (
                                <div
                                  className="overlay"
                                  style={{ fontSize: "15px" }}
                                >
                                  <div className="employee-type-insert">
                                    <div className="employee-type-insert-insert">
                                      <div className="employee-type-title-insert">
                                        Thêm Nhân Viên
                                      </div>
                                      <div className="employee-type-input-insert">
                                        <form onSubmit={handleSaveGE}>
                                          <div>
                                            Tên Nhóm :
                                            {getGrupNameById(editingIdGE)}
                                          </div>
                                          <br />
                                          <div>Nhân Viên</div>
                                          <select
                                            name="IDNhanVien"
                                            onChange={handleChangeGE}
                                            value={group_empData.IDNhanVien}
                                          >
                                            <option value="">
                                              Chọn Nhân Viên
                                            </option>
                                            {nhanvien.map((item) => (
                                              <option
                                                key={item.ID}
                                                value={item.ID}
                                              >
                                                {item.Ho} {item.Dem} {item.Ten}
                                              </option>
                                            ))}
                                          </select>
                                          {loadingSE ? <Spinner /> : ""}
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
                                              onClick={closeInsertGE}
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

export default EmployeeGroup;
