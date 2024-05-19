import React, { useEffect, useRef, useState } from "react";

import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { useDispatch, useSelector } from "react-redux";

import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import {
  AllSection,
  CreateSection,
  UpdateSection,
} from "../../../Redux/Slice/SectionSlice";
export default function Section() {
  const dispatch = useDispatch();
  const [selectTeacher, setSelectTeacher] = useState();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [label, setLable] = useState();
  const { Sections, loading } = useSelector((state) => state.Section);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(AllSection(localStorage.getItem("schoolid")));
    if (!localStorage.getItem("Admintoken")) {
      return navigate("/adminlogin");
    }
  }, [dispatch, navigate]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
            className="py-2 px-2"
            placeholder="Keyword Search"
          />
        </span>
        <Button
          onClick={() => {
            setLable("s");
            setVisible(true);
          }}
          label="Create Section"
          className="bg-cyan-500 text-white p-2"
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
    Sections ? Sections.length : 0
  } Section's.`;

  return (
    <>
      <Dialog
        header={label === "s" ? "Create Section" : "Update Section"}
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "50vh" }}
      >
        <SectionForm data={selectTeacher} label={label} />
      </Dialog>
      <div className="card">
        <DataTable
          value={Sections}
          paginator
          rows={10}
          footer={footer}
          size="small"
          loading={loading}
          dataKey="id"
          filters={filters}
          showGridlines
          stripedRows
          filterDisplay="row"
          globalFilterFields={["name", "lastnm"]}
          header={header}
          emptyMessage="No customers found."
          selectionMode="single"
          onSelectionChange={(e) => {
            setSelectTeacher(e.value);
            setVisible(true);
            setLable("u");
          }}
        >
          <Column
            field="section"
            header="Section"
            showFilterMenu={false}
            filter
            filterPlaceholder="Search seaction"
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

const SectionForm = ({ data, label }) => {
  const [formData, setFormData] = useState();
  const dispatch = useDispatch();
  const formDataHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      status: e.target.checked,
    });
  };

  useEffect(() => {
    if (data && label === "u") {
      setFormData(data);
    }
  }, [label, data]);
  const toast = useRef(null);
  const showSuccessToast = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success Message",
      detail: message,
      life: 3000,
    });
  };

  const showErrorToast = (error) => {
    toast.current.show({
      severity: "info",
      summary: "Error Message",
      detail: error,
      life: 3000,
    });
  };
  const onSubmit = () => {
    dispatch(
      CreateSection({ ...formData, school: localStorage.getItem("schoolid") })
    ).then((doc) => {
      if (doc.payload?.response?.status != 302) {
        showSuccessToast(doc.payload?.message);
      }
      if (doc.payload.response?.data.error) {
        showErrorToast(doc.payload.response?.data.error);
      }
    });
  };
  const onUpdate = () => {
    dispatch(UpdateSection(formData)).then((doc) =>
      showSuccessToast(doc.payload.message)
    );
  };

  return (
    <div className="grid">
      <Toast ref={toast} />
      <span className="p-float-label mt-7">
        <InputText
          id="username"
          name="section"
          value={formData?.section}
          onChange={formDataHandler}
          className="border-gray-400 uppercase border h-12 w-full pl-3"
        />
        <label htmlFor="username">Enter Section <strong className="text-red-500">*</strong></label>
      </span>
      <span className="flex justify-center items-center gap-3 mt-4">
        <Checkbox
          className="outline-gray-400 outline outline-1 rounded-md"
          name="status"
          checked={formData?.status}
          onChange={formDataHandler}
        ></Checkbox>
        <h1>Active</h1>
      </span>
      <div className="mt-5">
        {label === "u" ? (
          <Button
            label="Update"
            onClick={onUpdate}
            className="bg-cyan-500 w-full py-3 text-white"
          />
        ) : (
          <Button
            label="Save"
            disabled={formData?.section ? false : true}
            onClick={onSubmit}
            className="bg-cyan-500 w-full py-3 text-white"
          />
        )}
      </div>
    </div>
  );
};
