import React, { useEffect,useRef } from "react";
import "./Employee.css";
import FilterSidebar from "../../component/FilterSidebar/FilterSidebar";
import FilterHeader from "../../component/FilterHeader/FilterHeader";
import { useState } from "react";
import { Filter, Asterisk } from "lucide-react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Spinner from "../../component/spinner/spinner";
import API from "../../api/apiConfig";
const API_URL = API.APIALL;
const Employee = ({
  open,
  setOpen,
  onHeaderClick,
  clickLink,
  toggleDialog,
}) => {
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null);
  const [insert, setInsert] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fillter, setFillter] = useState({
    IDLoaiNhanVien:"",
    IDCapBac:"",
    HoTen:""
  });
   const hoTenRef = useRef(null);
    const idCapBacRef = useRef(null);
     const idLoaiNhanVienRef = useRef(null);
    const [openFillter, setOpenFillter] = useState(false)
  const [employeeData, setEmployeeData] = useState({
    Ten: "",
    Dem: "",
    Ho: "",
    Email: "",
    IDLoaiNhanVien: "",
    Pass: "",
    IDCapBac: "",
    NgayBatDau: "",
    NgayKetThuc: "",
    GioiTinh: "",
    Sdt: "",
    DiaChi: "",
    CCCD: "",
    NgaySinh: "",
  });
  const [loading, setLoading] = useState(false);
  const EMPLOYEETYPE__API_URL = API.APIALL;
  const LEVEL__API_URL = API.APIALL;
  const [employeetype, setEmployeetype] = useState([]);

  const [level, setLevel] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [employeeShow, setEmployeeShow] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    setOpen(true);
    fetchEmployeeType();
    fetchLevel();
    fetchEmployee();
  }, [clickLink]);

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

  const fetchEmployeeType = async () => {
    try {
      const response = await fetch(
        `${EMPLOYEETYPE__API_URL}user/type/selectAll`,
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
      console.log("Fetched branches:", data);
      setEmployeetype(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  const fetchLevel = async () => {
    try {
      const response = await fetch(`${LEVEL__API_URL}level/selectAll`, {
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
      setLevel(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}user/selectAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.StatusCode != 200) {
       const errorMessage = await result.Message;
        console.log(result);
        throw new Error(`${errorMessage}`);
      }
      const data = await result.Data;
      setEmployee(data);
      setEmployeeShow(data);
      setSelectedItems(data.map(() => false));
      console.log("Rendering EmployeeType component", employee);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
  const openInsert = () => {
    setInsert(true);
  };
  const closeInsert = () => {
    setInsert(false);
    setEmployeeData({
      Ten: "",
      Dem: "",
      Ho: "",
      Email: "",
      IDLoaiNhanVien: "",
      IDCapBac: "",
      Pass: "",
      NgayBatDau: "",
      NgayKetThuc: "",
      GioiTinh: "",
      Sdt: "",
      DiaChi: "",
      CCCD: "",
      NgaySinh: "",
    });
  };

  const openEdit = (id) => {
    const itemToEdit = employee.find((item) => item.ID === id);
    setEmployeeData(itemToEdit);
    setEditingId(id);
    setEdit(true);
  };
  const openFill = () => {
    if(openFillter){
      setOpenFillter(false);
    }else{
      setOpenFillter(true);
    }
  };
  const removeFillter = (e) => {
     const { name} = e.target;
    setFillter((prevData) => ({
      ...prevData,
      [name]: "",
    }));
    if (hoTenRef.current) {
      hoTenRef.current.value = "";
    }
        if (idCapBacRef.current) {
      idCapBacRef.current.value = ""; 
    }
      if (idLoaiNhanVienRef.current) {
      idLoaiNhanVienRef.current.value = ""; 
    }

  };
    const closeOpenFillter = (e) => {
      setOpenFillter(false)
  };
      const resetFillter = (e) => {
   setFillter((prevData) =>
       Object.fromEntries(Object.keys(prevData).map((key) => [key, ""]))
    );
      hoTenRef.current.value = "";
      idCapBacRef.current.value = ""; 
      idLoaiNhanVienRef.current.value = ""; 
  
  };
  const handleFilter = async(e) => {
    const { name, value } = e.target;
    setFillter((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
  };
  useEffect(() => {
  fill();
  }, [fillter]);
  
  const fill = () => {
    let filteredEmployees = [...employee];
    if (fillter.HoTen) {
      filteredEmployees = filteredEmployees.filter((item) =>
        (item.Ho + " " + item.Dem + " " + item.Ten).toLowerCase().includes(fillter.HoTen.toLowerCase())
      );
    }   
    if (fillter.IDCapBac) {
      filteredEmployees = filteredEmployees.filter((item) => item.IDCapBac == fillter.IDCapBac);
    }    
    if (fillter.IDLoaiNhanVien) {
      filteredEmployees = filteredEmployees.filter((item) => item.IDLoaiNhanVien == fillter.IDLoaiNhanVien);
    }
   setEmployeeShow(filteredEmployees);
}  
  const closeEdit = () => {
    setEdit(false);
    setEmployeeData({
      Ten: "",
      Dem: "",
      Ho: "",
      Email: "",
      IDLoaiNhanVien: "",
      IDCapBac: "",
      NgayBatDau: "",
      NgayKetThuc: "",
      GioiTinh: "",
      Sdt: "",
      DiaChi: "",
      CCCD: "",
      NgaySinh: "",
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
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const newEmployee = {
        ...employeeData,
        IDLoaiNhanVien: parseInt(employeeData.IDLoaiNhanVien),
        IDCapBac: parseInt(employeeData.IDCapBac),
      };
      const response = await fetch(`${API_URL}user/creatUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });
      const result = await response.json();
      if (result.Data == null) {
        toast.error(`Loi: ${result.StatusCode} ${result.Message}`, {
          position: "top-right",
        });
      } else {
        toast.success("Nhân Viên mới đã được tạo thành công!", {
          position: "top-right",
        });
      }
      fetchEmployee();
      closeInsert();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };
  const handleEdit = async (id) => {
    if (!editingId) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Cập nhật không thành công: ${errorMessage}`);
      }

      toast.success("Thông tin nhân viên đã cập nhật", {
        position: "top-right",
      });
      await fetchEmployee();
      closeEdit();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };
  const handleRemove = async (id) => {
    if (!id) return;
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Nhân viên đã được xóa thành công!", {
        position: "top-right",
      });
      fetchEmployee();
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };
  const getEmployeeTypeNameById = (id) => {
    const emp_type = employeetype.find((emp_type) => emp_type.ID === id);
    return emp_type ? emp_type.LoaiNhanVien : "";
  };
  const getLevelNameById = (id) => {
    const lev = level.find((lev) => lev.ID === id);
    return lev ? lev.TenCapBac : "";
  };
const getMaById = (id) => {
  return `NV_${String(id).padStart(5, "0")}`;
};
  const formatDate = (isoDateString) => {
   
    const data = new Date(isoDateString);
    const date = data.toISOString().split("T")[0];
     if (date == "0001-01-01") return "";
    return date; 
  };
  const deleteSelectedItems = () => {
    const remainingItems = data.filter((_, index) => !selectedItems[index]);
    setData(remainingItems);
    setSelectedItems([]);
    setSelectAll(false);
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
    <div className="employee">
      <FilterHeader
        click={onHeaderClick}
        handleRemoveSelected={handleRemoveSelected}
      />
      <FilterSidebar />
      <div className="table">
        <div className="table-header">
          {/* <div className="search-filter">
            <input
              className="search-filter-input"
              type="text"
              placeholder="Tìm Kiếm"
            />
          </div> */}
          <div className="branch-insert">
            <button className="branch-insert-button" onClick={openInsert}>
              {" "}
              + Thêm Nhân Viên
            </button>
          </div>
          {insert && (
            <div className="overlay">
              <div className="employee-type-insert">
                <div className="employee-type-insert-insert">
                  <div className="employee-type-title-insert">
                    Thêm Nhân Viên
                  </div>
                  <div className="employee-type-input-insert">
                    <form onSubmit={handleSave}>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="Ho"
                        placeholder="Nhập Họ"
                        required
                      />
                      <input
                        type="text"
                        onChange={handleChange}
                        name="Dem"
                        placeholder="Nhập Tên Đệm"
                        required
                      />
                      <input
                        type="text"
                        onChange={handleChange}
                        name="Ten"
                        placeholder="Nhập Tên"
                        required
                      />
                      <input
                        type="text"
                        onChange={handleChange}
                        name="Email"
                        placeholder="Nhập Email"
                        required
                      />
                      <input
                        type="text"
                        onChange={handleChange}
                        name="Pass"
                        placeholder="Nhập Mật Khẩu"
                        required
                      />
                      <select
                        name="IDLoaiNhanVien"
                        value={employeeData.IDLoaiNhanVien}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Chọn Loại Nhân Viên</option>
                        {employeetype && employeetype.length > 0
                          ? employeetype.map((item) => (
                              <option key={item.ID} value={item.ID}>
                                {item.LoaiNhanVien}
                              </option>
                            ))
                          : ""}
                      </select>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="GioiTinh"
                        placeholder="Nhập Giới Tính"
                        required
                      />
                      <div>Nhập Ngày Sinh</div>
                      <input
                        type="date"
                        onChange={handleChange}
                        name="NgaySinh"
                        placeholder="Nhập Ngày Sinh"
                        required
                      />
                      <input
                        type="text"
                        onChange={handleChange}
                        name="Sdt"
                        placeholder="Nhập Số Điện Thoại"
                        required
                      />
                      <select
                        name="IDCapBac"
                        value={employeeData.IDCapBac}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Chọn Cấp Bậc</option>
                        {level && level
                          ? level.map((item) => (
                              <option key={item.ID} value={item.ID}>
                                {item.TenCapBac}
                              </option>
                            ))
                          : ""}
                      </select>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="DiaChi"
                        placeholder="Nhập Địa Chỉ"
                        required
                      />
                      <div>Ngày Nhận Việc</div>
                      <input
                        type="date"
                        onChange={handleChange}
                        name="NgayBatDau"
                        placeholder="Nhập Ngày Nhận Việc"
                        required
                      />
                      <input
                        type="date"
                        onChange={handleChange}
                        name="NgayKetThuc"
                        placeholder="Nhập Ngày Kết Thúc"
                      />
                      <input
                        type="text"
                        onChange={handleChange}
                        name="CCCD"
                        placeholder="Nhập CCCD"
                        required
                      />
                    </form>
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
          <div className="filter">
             {openFillter &&
              ( <div className="div_filter"> 
                <table>
                <tbody>
                <tr>
                  <td className="search-filter-td"><input className="search-filter-name"  placeholder="Họ Tên" readOnly /></td>
                  <td className="search-filter-x"><input className="search-filter-name"  placeholder="=" readOnly /></td>
                  <td> <input
                          className="search-filter-name"
                          type="text"
                          name= "HoTen"
                          onChange={handleFilter}
                           ref={hoTenRef}
                        />
                  </td>
                  <td   className="search-filter-x"><input type="text"   className="search-filter-xInput" name="HoTen"   onClick={removeFillter}  value={"X"} readOnly/></td>
                </tr>
                  <tr>
                  <td className="search-filter-td"><input className="search-filter-name"  placeholder="Loại Nhân Viên" readOnly /></td>
                  <td className="search-filter-x"><input className="search-filter-name"  placeholder="=" readOnly /></td>
                  <td>  <select onChange={handleFilter}  name="IDLoaiNhanVien" className="search-filter-name" ref={idLoaiNhanVienRef} required >
                        <option value="">Chọn Loại Nhân Viên</option>
                        {employeetype && employeetype.length > 0
                          ? employeetype.map((item) => (
                              <option key={item.ID} value={item.ID}>
                                {item.LoaiNhanVien}
                              </option>
                            ))
                          : ""}
                      </select>
                  </td>
                  <td   className="search-filter-x"><input type="text"   className="search-filter-xInput" name="IDLoaiNhanVien"   onClick={removeFillter}  value={"X"} readOnly/></td>
                </tr>
                  <tr>
                  <td className="search-filter-td"><input className="search-filter-name"  placeholder="Cấp Bậc" readOnly /></td>
                  <td className="search-filter-x"><input className="search-filter-name"  placeholder="=" readOnly /></td>
                  <td>  <select onChange={handleFilter}  name="IDCapBac" className="search-filter-name" ref={idCapBacRef} required >
                        <option value="">Chọn Cấp Bậc</option>
                        {level && level.length > 0
                          ? level.map((item) => (
                              <option key={item.ID} value={item.ID}>
                                {item.TenCapBac}
                              </option>
                            ))
                          : ""}
                      </select>
                  </td>
                  <td   className="search-filter-x"><input type="text"   className="search-filter-xInput" name="IDCapBac"   onClick={removeFillter}  value={"X"} readOnly/></td>
                </tr>
                </tbody>
                </table>
                <button className="btn-fillter btn-fillterL" onClick={resetFillter}>Reset</button> <button className="btn-fillter btn-fillterR" onClick={closeOpenFillter}>Đóng</button>
              </div>)
              }
            <button className="filter-coponent"  onClick={openFill}>
              <Filter className="filter-icon" />
              <span >Bộ Lọc</span>
            </button>
           
            <button className="filter-coponent">
              <div className="filter-icon" />
              <span>Tác Vụ</span>
            </button>
          </div>
        </div>
        <div className="table-filter">
          {loading ? (
            <Spinner />
          ) : (
            <div className="table-contain">
              <div className="format-title">
                <b>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </b>
                <b>Mã</b>
                <b>Tên Đầy Đủ</b>
                <b>Giới Tính</b>
                <b>Ngày Sinh</b>
                <b>Cấp Bậc</b>
                <b>Sđt</b>
                <b>Loại Nhân Viên</b>
                <b>Ngày Nhận Việc</b>
                <b>Ngày Kết Thúc</b>
              </div>
              {employeeShow && employeeShow.length > 0
                ? employeeShow.map((item, index) => {
                    return (
                      <div className="format" key={item.ID}>
                        <div>
                          <input
                            type="checkbox"
                            checked={selectedItems[index]}
                            onChange={handleItemChange(index)}
                          />
                        </div>
                        <Link to={`/employee/${item.ID}`}>
                          <div>{getMaById(item.ID)}</div>
                        </Link>
                        <Link to={`/employee/${item.ID}`}>
                          <div>
                            {item.Ho} {item.Dem} {item.Ten}
                          </div>
                        </Link>
                        <Link to={`/employee/${item.ID}`}>
                          <div>{item.GioiTinh}</div>
                        </Link>
                        <Link to={`/employee/${item.ID}`}>
                          <div>{formatDate(item.NgaySinh)}</div>
                        </Link>
                        <Link to={`/employee/${item.ID}`}>
                          <div>{getLevelNameById(item.IDCapBac)}</div>
                        </Link>
                        <Link to={`/employee/${item.ID}`}>
                          <div>{item.SDT}</div>
                        </Link>
                        <Link to={`/employee/${item.ID}`}>
                          <div>
                            {getEmployeeTypeNameById(item.IDLoaiNhanVien)}
                          </div>
                        </Link>
                        <Link to={`/employee/${item.ID}`}>
                          <div>{formatDate(item.NgayBatDau)}</div>
                        </Link>
                        <Link to={`/employee/${item.ID}`}>
                          <div>{formatDate(item.NgayKetThuc)}</div>
                        </Link>
                      </div>
                    );
                  })
                : ""}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Employee;
