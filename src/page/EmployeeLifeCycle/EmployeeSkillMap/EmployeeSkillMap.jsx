import React from "react";
import "./EmployeeSkillMap.css";
import FilterHeader from "../../../component/FilterHeader/FilterHeader";
import FilterSidebar from "../../../component/FilterSidebar/FilterSidebar";
import { useState, useEffect } from "react";
import { Filter, Pencil, CircleX } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import API from "../../../api/apiConfig";
import Spinner from "../../../component/spinner/spinner";

const SKILL_API_URL = API.APIALL;
const SKILL_EMPLOYEE_API_URL = API.APIALL;
const NHANVIEN_API_URL = API.APIALL;
const EmployeeSkillMap = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [insertS, setInsertS] = useState(false);
  const [insertSE, setInsertSE] = useState(false);
  const [editS, setEditS] = useState(false);
  const [editingIdS, setEditingIdS] = useState(null);
  const [editSE, setEditSE] = useState(false);
  const [editingIdSE, setEditingIdSE] = useState(null);
  const [nhanvien, setNhanvien] = useState([]);
  const [skill, setSkill] = useState([]);
  const [skillData, setSkillData] = useState({ TenKyNang: "", MoTa: "" });
  const [skillemployee, setSkillemployee] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingS, setLoadingS] = useState(false);
  const [loadingE, setLoadingE] = useState(false);

  const [skillemployeeData, setSkillemployeeData] = useState({
    IDNhanVien: "",
    IDKyNang: "",
    MucDo: "",
    NgayDanhGia: "",
  });
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchSkill();
    fetchSkill_Employee();
    fetchSEmployee();
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

  const fetchSEmployee = async () => {
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
    } catch (error) {}
  };
  const fetchSkill_Employee = async () => {
    try {
      const response = await fetch(
        `${SKILL_EMPLOYEE_API_URL}user/skilluser/select/`,
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

      setSkillemployee(data);
    } catch (error) {
      console.error("Error fetching employee types:", error);
    }
  };
  const fetchSkill = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SKILL_API_URL}user/skill/selectAll`, {
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
      setSkill(data);
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
    const allChecked = updatedSelectedItems.every((item) => item);
    setSelectAll(allChecked);
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
  const openInsertS = () => {
    setInsertS(true);
  };
  const openInsertSE = () => {
    setInsertSE(true);
  };
  const closeInsertS = () => {
    setInsertS(false);
    setSkillData({ TenKyNang: "", MoTa: "" });
  };
  const closeInsertSE = () => {
    setInsertSE(false);
    setSkillemployeeData({
      IDNhanVien: "",
      IDKyNang: "",
      MucDo: "",
      NgayDanhGia: "",
    });
  };
  const openEditS = (id) => {
    const itemToEdit = skill.find((item) => item.ID === id);
    setSkillData(itemToEdit);
    setEditingIdS(id);
    setEditS(true);
  };
  const closeEditS = () => {
    setEditS(false);
    setSkillData({ TenKyNang: "", MoTa: "" });
  };
  const openEditSE = (id) => {
    setEditingIdSE(id);
    const employeesInGroup = skillemployee.filter(
      (item) => item.IDKyNang === id,
    );
    setSkillemployeeData({ ...skillemployeeData, employeesInGroup });
    setEditSE(true);
  };
  const closeEditSE = () => {
    setEditSE(false);
    setSkillemployeeData({
      IDNhanVien: "",
      IDKyNang: "",
      MucDo: "",
      NgayDanhGia: "",
    });
  };
  const handleChangeS = (e) => {
    const { name, value } = e.target;
    setSkillData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const getEmployeeNameById = (id) => {
    const employee = nhanvien.find((item) => item.ID === id);
    return employee ? `${employee.Ho} ${employee.Dem} ${employee.Ten}` : "";
  };
  const handleChangeSE = (e) => {
    const { name, value } = e.target;
    setSkillemployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSaveS = async (e) => {
    e.preventDefault();
    const isDuplicate =
      skill && skill.length > 0
        ? skill.some((item) => item.TenKyNang === skillData.TenKyNang)
        : false;
    if (isDuplicate) {
      toast.error("Kỹ Năng đã tồn tại!", {
        position: "top-right",
      });
      return;
    }
    setLoadingS(true);
    try {
      const newNhomnhanvien = { ...skillData };
      await fetch(`${SKILL_API_URL}user/skill/creat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNhomnhanvien),
      });
      toast.success("Kỹ Năng mới đã được tạo thành công!", {
        position: "top-right",
      });
      setLoadingS(false);
      fetchSkill();
      closeInsertS();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
      setLoadingS(false);
    }
  };
  const handleSaveSE = async (e) => {
    e.preventDefault();
    const isDuplicate = skillemployee.some(
      (item) =>
        item.IDNhanVien === skillemployeeData.IDNhanVien &&
        item.IDKyNang === skillemployeeData.IDKyNang,
    );
    if (isDuplicate) {
      toast.error(" Nhân Viên đã có kĩ năng này!", {
        position: "top-right",
      });
      return;
    }
    try {
      const newNhomnhanvien = { ...skillemployeeData };
      const response = await fetch(SKILL_EMPLOYEE_API_URL, {
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
      toast.success("Kỹ Năng Nhân viên mới đã được tạo thành công!", {
        position: "top-right",
      });
      fetchSkill_Employee();
      closeInsertSE();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };
  const handleEditS = async (e) => {
    e.preventDefault();
    const confirmed = await confirm();
    if (!confirmed) return;
    if (!editingIdS) return;
    setLoadingE(true);
    try {
      const response = await fetch(
        `${SKILL_API_URL}user/skill/update/?id=${editingIdS}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(skillData),
        },
      );

      const result = await response.json();
      if (result.StatusCode != 200) {
        const errorMessage = await result.Message;
        throw new Error(`${errorMessage}`);
      }

      toast.success("Thông tin kỹ năng đã cập nhật", {
        position: "top-right",
      });
      setLoadingE(false);
      fetchSkill();
      closeEditS();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
      setLoadingE(false);
    }
  };
  const handleRemoveS = async (id) => {
    if (!id) return;
    const confirmed = await confirm();
    if (!confirmed) return;
    setLoadingE(true);
    try {
      const response = await fetch(
        `${SKILL_API_URL}user/skill/delete/?id=${id}`,
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
      toast.success("Kỹ Năng đã được xóa thành công!", {
        position: "top-right",
      });
      fetchSkill();
      setLoadingE(false);
      closeEditS();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
      setLoadingE(false);
    }
  };
  const handleRemoveSE = async (id) => {
    if (!id) return;
    const confirmed = await confirm();
    if (!confirmed) return;
    try {
      await fetch(`${SKILL_EMPLOYEE_API_URL}/${id}`, {
        method: "DELETE",
      });
      toast.success("Nhân viên đã được xóa kỹ năng thành công!", {
        position: "top-right",
      });
      fetchSkill_Employee();
      closeEditSE();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const d = date.toISOString().split("T")[0];
    if (d == "0001-01-01") return "";
    return d;
  };
  return (
    <div className="employee-skill-map">
      <FilterHeader handleRemoveSelected={handleRemoveSelected} />
      <FilterSidebar />
      <div className="employee-skill-map-table">
        <div className="employee-skill-map-table-header">
          <div className="employee-skill-map-search-filter">
            <input
              className="employee-skill-map-search-filter-input"
              type="text"
              placeholder="Tìm Kiếm"
            />
          </div>
          <div className="employee-skill-map-insert">
            <button
              className="employee-skill-map-insert-button"
              onClick={openInsertS}
            >
              {" "}
              + Thêm Kỹ Năng{" "}
            </button>
            {/* <button className='employee-skill-map-insert-button' onClick={openInsertSE}> + Thêm Kỹ Năng Nhân Viên </button> */}
          </div>
          {insertS && (
            <div className="overlay">
              <div className="employee-type-insert">
                <div className="employee-type-insert-insert">
                  <div className="employee-type-title-insert">Thêm Kỹ Năng</div>
                  <div className="employee-type-input-insert">
                    <form onSubmit={handleSaveS}>
                      <input
                        type="text"
                        onChange={handleChangeS}
                        name="TenKyNang"
                        placeholder="Nhập Tên Kỹ Năng"
                        required
                      />
                      <input
                        type="text"
                        onChange={handleChangeS}
                        name="MoTa"
                        placeholder="Nhập Mô Tả"
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
                          onClick={closeInsertS}
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
          {insertSE && (
            <div className="overlay">
              <div className="employee-type-insert">
                <div className="employee-type-insert-insert">
                  <div className="employee-type-title-insert">
                    Thêm Kỹ Năng Nhân Viên
                  </div>
                  <div className="employee-type-input-insert">
                    <form onSubmit={handleSaveSE}>
                      <div>Tên Kỹ Năng</div>
                      <select
                        name="IDKyNang"
                        onChange={handleChangeSE}
                        value={skillemployeeData.IDKyNang}
                      >
                        <option>Chọn Kỹ Năng</option>
                        {skill.map((item) => (
                          <option key={item.ID} value={item.ID}>
                            {item.TenKyNang}
                          </option>
                        ))}
                      </select>
                      <div>Nhân Viên</div>
                      <select
                        name="IDNhanVien"
                        onChange={handleChangeSE}
                        value={skillemployeeData.IDNhanVien}
                      >
                        <option>Chọn Nhân Viên</option>
                        {nhanvien.map((item) => (
                          <option key={item.ID} value={item.ID}>
                            {item.Ho} {item.Dem} {item.Ten}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        name="MucDo"
                        onChange={handleChangeSE}
                        value={skillemployeeData.MucDo}
                        placeholder="mức độ"
                      />
                      <div>Ngày Đánh Giá</div>
                      <input
                        type="date"
                        name="NgayDanhGia"
                        onChange={handleChangeSE}
                        value={skillemployeeData.NgayDanhGia}
                      />
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
                          onClick={closeInsertSE}
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
          <div className="employee-skill-map-filter">
            <button className="employee-skill-map-filter-coponent">
              <Filter className="filter-icon" />
              <span>Bộ Lọc</span>
            </button>
            <button className="employee-skill-map-filter-coponent">
              <div className="filter-icon" />
              <span>Tác Vụ</span>
            </button>
          </div>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="employee-skill-map-table-filter">
            <div className="employee-skill-map-table-contain">
              <div className="employee-skill-map-format-title">
                <td>
                  {" "}
                  <b>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                  </b>
                </td>
                <td>
                  <b>ID</b>
                </td>
                <td>
                  <b>Tên Kỹ Năng</b>
                </td>
                <td>
                  <b>Mô Tả</b>
                </td>
                <td>
                  <b></b>
                </td>
              </div>
              {skill && skill.length > 0
                ? skill.map((item, index) => {
                    return (
                      <div className="employee-skill-map-format" key={item.ID}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedItems[index]}
                            onChange={handleItemChange(index)}
                          />
                        </td>
                        <td onClick={() => openEditSE(item.ID)}>{item.ID}</td>
                        <td onClick={() => openEditSE(item.ID)}>
                          {item.TenKyNang}
                        </td>
                        <td onClick={() => openEditSE(item.ID)}>{item.MoTa}</td>
                        <td onClick={() => openEditS(item.ID)}>
                          <Pencil />
                        </td>
                        {editS && editingIdS === item.ID && (
                          <div className="overlay">
                            <div className="insert">
                              <div className="insert-insert">
                                <div className="title-insert">
                                  Cập Nhật Kỹ Năng
                                </div>
                                <form onSubmit={handleEditS}>
                                  <div className="input-insert">
                                    <div>Tên Kỹ Năng</div>
                                    <input
                                      type="text"
                                      onChange={handleChangeS}
                                      value={skillData.TenKyNang}
                                      name="TenKyNang"
                                      required
                                    />
                                    <div>Mô Tả</div>
                                    <input
                                      type="text"
                                      onChange={handleChangeS}
                                      value={skillData.MoTa}
                                      name="MoTa"
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
                                      onClick={closeEditS}
                                    >
                                      X
                                    </button>
                                    <button
                                      className="employee-type-save-remove"
                                      type="button"
                                      onClick={() => handleRemoveS(item.ID)}
                                    >
                                      Xóa
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        )}
                        {editSE && editingIdSE === item.ID && (
                          <div className="overlay">
                            <div className="insert-group-employee">
                              <div className="insert-insert-group-employee">
                                <div className="title-insert-group-employee">
                                  Danh sách nhân viên Có Kỹ Năng
                                </div>
                                <table>
                                  <thead>
                                    <tr>
                                      <th>STT</th>
                                      <th>Tên Nhân Viên</th>
                                      <th>Mức Độ</th>
                                      <th>Ngày Đánh Giá</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {skillemployee && skillemployee.length > 0
                                      ? skillemployee
                                          .filter(
                                            (emp) =>
                                              emp.IDKyNang === editingIdSE,
                                          )
                                          .map((item, index) => (
                                            <tr key={item.ID}>
                                              <td>{index + 1}</td>
                                              <td>
                                                {getEmployeeNameById(
                                                  item.IDNhanVien,
                                                )}
                                              </td>
                                              <td>
                                                {" "}
                                                <div className="star-rating">
                                                  {[1, 2, 3, 4, 5].map(
                                                    (star) => (
                                                      <label key={star}>
                                                        <input
                                                          type="radio"
                                                          name="MucDo"
                                                          value={star}
                                                          onChange={
                                                            handleChangeSE
                                                          }
                                                          checked={
                                                            item.MucDo == star
                                                          }
                                                          required
                                                        />
                                                        <span
                                                          className={`star ${item.MucDo >= star ? "filled" : ""}`}
                                                        >
                                                          &#9733;
                                                        </span>
                                                      </label>
                                                    ),
                                                  )}
                                                </div>
                                              </td>

                                              <td>
                                                {formatDate(item.NgayDanhGia)}
                                              </td>
                                            </tr>
                                          ))
                                      : ""}
                                  </tbody>
                                </table>
                                <button type="button" onClick={closeEditSE}>
                                  X
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmployeeSkillMap;
