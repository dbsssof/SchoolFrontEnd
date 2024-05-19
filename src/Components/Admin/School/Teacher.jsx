import React, { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { getAllTeacherBySchool } from "../../../Redux/Slice/TeacherSlice";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import TeacherFrom from "./TeacherForm";
import TeacherLoginUpdate from "./TeacherLoginUpdate";
import { AllClassBySchoolStatus } from "../../../Redux/Slice/ClassSlice";
import { AllSectionBySchoolStatus } from "../../../Redux/Slice/SectionSlice";
import { useNavigate } from "react-router-dom";
export default function Teacher({ school }) {
  const dispatch = useDispatch();

  const [selectTeacher, setSelectTeacher] = useState();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [label, setLable] = useState();
  const { Teacher, loading } = useSelector((state) => state.Teacher);

  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("Admintoken")) {
      return navigate("/adminlogin");
    }
    dispatch(getAllTeacherBySchool(localStorage.getItem("schoolid")));
    dispatch(AllClassBySchoolStatus(localStorage.getItem("schoolid")));
    dispatch(AllSectionBySchoolStatus(localStorage.getItem("schoolid")));
  }, [dispatch, navigate]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    classs: { value: null, matchMode: FilterMatchMode.EQUALS },
    section: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [statuses] = useState([true, false]);

  const getSeverity = (status) => {
    switch (status) {
      case false:
        return "danger";

      case true:
        return "success";
    }
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between">
        <span className="border rounded-lg relative">
          <i className="pi pi-search ml-2 absolute right-3 top-3" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            className="py-2 px-2 border-gray-300 border"
            placeholder="Keyword Search"
          />
        </span>

        <Button
          onClick={() => {
            setLable("s");
            setVisible(true);
          }}
          label="Create Teacher"
          className="bg-cyan-500 hover:bg-cyan-600 duration-300 text-white p-2"
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.status === true ? "Active" : "De-active"}
        severity={getSeverity(rowData.status)}
      />
    );
  };

  const statusItemTemplate = (option) => {
    return (
      <Tag
        value={option === true ? "Active" : "De-Active"}
        severity={getSeverity(option)}
      />
    );
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };

  const header = renderHeader();
  const footer = `In total there are ${
    Teacher ? Teacher.length : 0
  } Teacher's.`;
  return (
    <>
      <Dialog
        header="Create Teacher"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "50vh" }}
      >
        <TeacherFrom
          data={selectTeacher}
          label={label}
          visibles={() => setVisible(false)}
        />
      </Dialog>
      <Dialog
        header="Teacher"
        maximized
        visible={visible2}
        onHide={() => setVisible2(false)}
      >
        <TeacherLoginUpdate data={selectTeacher} />
      </Dialog>
      <div className="card">
        <DataTable
          size="small"
          value={Teacher}
          paginator
          rows={10}
          footer={footer}
          loading={loading}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["name", "lastnm"]}
          header={header}
          stripedRows
          showGridlines
          emptyMessage="No customers found."
          selectionMode="single"
          onSelectionChange={(e) => {
            setSelectTeacher(e.value);
            setVisible2(true);
            setLable("u");
          }}
        >
          <Column
            field="name"
            header="Name"
            filter
            showFilterMenu={false}
            filterPlaceholder="Search by name"
            style={{ minWidth: "12rem" }}
            headerClassName="text-xs"
            className="text-xs"
          />
          <Column
            field="lastnm"
            header={"Last Name"}
            style={{ minWidth: "12rem" }}
            headerClassName="text-xs"
            className="text-xs"
          />
          <Column
            field="classs"
            header="Class"
            filter
            filterPlaceholder="Search by name"
            style={{ minWidth: "12rem" }}
            headerClassName="text-xs"
            showFilterMenu={false}
            className="text-xs"
          />
          <Column
            field="section"
            header="Section"
            filter
            filterPlaceholder="Search by name"
            style={{ minWidth: "12rem" }}
            showFilterMenu={false}
            headerClassName="text-xs"
            className="text-xs"
          />
          <Column
            field="address"
            header="Address"
            className="text-xs"
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="mobile"
            header="Mobile"
            style={{ minWidth: "14rem" }}
            headerClassName="text-xs"
            className="text-xs"
          />
          <Column
            field="status"
            header="Status"
            showFilterMenu={false}
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "12rem" }}
            filter
            body={statusBodyTemplate}
            filterElement={statusRowFilterTemplate}
            headerClassName="text-xs"
            className="text-xs"
          />
        </DataTable>
      </div>
    </>
  );
}
