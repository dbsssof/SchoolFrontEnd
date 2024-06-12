import moment from "moment";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AllClass } from "../../../Redux/Slice/ClassSlice";
import {
  fetchAllIcards,
  updateManyIcards,
} from "../../../Redux/Slice/IcardSlice";
import { AllSection } from "../../../Redux/Slice/SectionSlice";
import BulkUpload from "../../BulkExcelUploadForm";
import ICardForm from "../../ICardForm";
import { InputSwitch } from "primereact/inputswitch";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
export default function DeActiveWithoutImage({}) {
  const dispatch = useDispatch();
  const toast = useRef(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedPrinted, setSelectedPrinted] = useState([]);
  const [printAllSelect, setPrintAllSelect] = useState(false);
  const [selectTeacher, setSelectTeacher] = useState();
  const [allSelect, setAllSelect] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const { ICards, loading, message, error } = useSelector(
    (state) => state.Icard
  );
  const [filterStudent, setFilterStudent] = useState();
  const [imageFilterChecked, setImageFilterChecked] = useState(false);
  const [label, setLable] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("Admintoken")) {
      return navigate("/adminlogin");
    }

    dispatch(AllClass(localStorage.getItem("schoolid")));
    dispatch(AllSection(localStorage.getItem("schoolid")));
  }, [dispatch, navigate]);

  useLayoutEffect(() => {
    dispatch(fetchAllIcards(localStorage.getItem("schoolid"))).then((doc) =>
      setFilterStudent(
        doc.payload.filter(
          (item) =>
            (item.status === false &&
              item.print === false &&
              item.image != null) ||
            ""
        )
      )
    );
  }, [dispatch]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    class: { value: null, matchMode: FilterMatchMode.EQUALS },
    section: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    admission_id: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const handlePrint = () => {
    navigate("/print", { state: { student: selectedProducts } });
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
          label="Bulk student upload "
          onClick={() => setVisible2(true)}
          className="bg-cyan-500 hover:bg-cyan-600 duration-300 text-white p-2"
        />
        <Button 
          label={`Print ICard's (${selectedProducts.length})`}
          onClick={handlePrint}
          //  disabled
         disabled={selectedProducts.length >= 1 ? false : true}
          className="bg-cyan-500 hover:bg-cyan-600 duration-300 text-white p-2"
        />

        <Button
          onClick={() => {
            setLable("s");
            setVisible(true);
          }}
          label="Create Student"
          className="bg-cyan-500 hover:bg-cyan-600 duration-300 text-white p-2"
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.status === true ? "Active" : "De-active"}
        severity={getSeverity(rowData.status || false)}
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

  const representativesItemTemplate = (option) => {
    return (
      <div className="flex w-24 h-24 align-items-center gap-2 border">
        <img alt={"student image"} src={option.image} className="w-24 h-24" />
      </div>
    );
  };

  const dOBTemplate = (option) => {
    return <span>{moment(option.dob).format("DD/MM/YYYY")}</span>;
  };

  const header = renderHeader();
  const footer = `In total there are ${
    filterStudent ? filterStudent.length : 0
  } Student's.`;
  const updatetemplete = (event) => {
    return (
      <button
        onClick={() => {
          setSelectTeacher(event);
          setVisible(true);
          setLable("u");
        }}
        className="bg-cyan-500 p-2 text-white rounded-lg"
      >
        <BiEdit />
      </button>
    );
  };
  useEffect(() => {
    if (imageFilterChecked === true) {
      setFilterStudent(
        ICards.filter(
          (doc) => (doc.status === false && doc.image == null) || ""
        )
      );
    }
    if (imageFilterChecked === false) {
      setFilterStudent(
        ICards.filter(
          (doc) => (doc.status === false && doc.image != null) || ""
        )
      );
    }
  }, [imageFilterChecked, ICards]);

  const imageFilterHeader = () => {
    return (
      <InputSwitch
        checked={imageFilterChecked}
        onChange={(e) => setImageFilterChecked(e.value)}
      />
    );
  };

  const prindedSubmit = () => {
    dispatch(updateManyIcards(selectedPrinted)).then(() => {
      dispatch(fetchAllIcards(localStorage.getItem("schoolid")));
      setSelectedPrinted([]);
    });
  };

  const printFilterHeader = () => {
    return (
      <Button
        onClick={prindedSubmit}
        label={`Move to Printed (${selectedPrinted.length})`}
        className="bg-cyan-500 w-24 p-2 text-white hover:bg-cyan-600 duration-300"
      />
    );
  };

  const printFilterBody = (rowData) => {
    const isSelected = selectedPrinted.some(
      (product) => product._id === rowData._id
    );
    return (
      <div className="flex gap-2 items-center">
        <Checkbox
          checked={isSelected}
          onChange={(e) => {
            const checked = e.checked;
            const updatedSelectedProducts = [...selectedPrinted];

            if (checked) {
              if (rowData.image !== null && rowData.status == true) {
                updatedSelectedProducts.push({ ...rowData, print: true });
              } else {
                showInfo("Image not uploaded or Student not active !!!");
              }
            } else {
              const index = updatedSelectedProducts.findIndex(
                (product) => product._id === rowData._id
              );
              if (index !== -1) {
                updatedSelectedProducts.splice(index, 1);
              }
            }

            setSelectedPrinted(updatedSelectedProducts);
          }}
        />
        {rowData.print && (
          <i
            className={`pi ${
              rowData.print
                ? "true-icon pi-check-circle text-green-500"
                : "false-icon pi-times-circle text-red-500"
            }`}
          />
        )}
      </div>
    );
  };

  useEffect(() => {
    if (allSelect) {
      setSelectedProducts(
        ICards.filter(
          (doc) =>
            (doc.status === true && doc.print === false && doc.image != null) ||
            ""
        )
      );
    } else {
      setSelectedProducts([]);
    }
  }, [filterStudent, allSelect]);

  const selectFilterHeader = () => {
    return (
      <Checkbox checked={allSelect} onChange={(e) => setAllSelect(e.checked)} />
    );
  };
  const selectFilterBody = (rowData) => {
    const isSelected = selectedProducts.some(
      (product) => product._id === rowData._id
    );
    return (
      <Checkbox
        checked={isSelected}
        onChange={(e) => {
          const checked = e.checked;
          const updatedSelectedProducts = [...selectedProducts];

          if (checked) {
            if (rowData.image !== null || "") {
              updatedSelectedProducts.push(rowData);
            } else {
              showInfo("Image Not Uploaded !!!");
            }
          } else {
            const index = updatedSelectedProducts.findIndex(
              (product) => product._id === rowData._id
            );
            if (index !== -1) {
              updatedSelectedProducts.splice(index, 1);
            }
          }

          setSelectedProducts(updatedSelectedProducts);
        }}
      />
    );
  };

  const showInfo = (message) => {
    toast.current.show({ severity: "info", detail: message, life: 3000 });
  };

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      detail: message,
      life: 3000,
    });
  };

  useEffect(() => {
    if (message) {
      showSuccess(message);
    }
    if (error) {
      showInfo(error);
    }
  }, [message, error]);

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={label === "s" ? "Create Student" : "Update Student"}
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "50vh" }}
      >
        <ICardForm
          item={selectTeacher}
          visbile={() => setVisible(false)}
          label={label}
        />
      </Dialog>
      <Dialog
        header="Student's Bulk Upload via Excel"
        visible={visible2}
        onHide={() => setVisible2(false)}
        style={{ width: "50vh" }}
      >
        <BulkUpload visbile={() => setVisible2(false)} />
      </Dialog>
      <div className="card">
        <DataTable
          value={filterStudent}
          paginator
          rows={10}
          footer={footer}
          size="small"
          loading={loading}
          dataKey="_id"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["name", "class", "section"]}
          className="h-full  relative"
          stripedRows
          header={header}
          emptyMessage="No customers found."
          metaKeySelection={false}
          selectionMode="checkbox"
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
        >
          <Column
            selectionMode="multiple"
            // filter
            showFilterMenu={false}
            // body={selectFilterBody}
            // filterElement={selectFilterHeader}
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column
            header={"Action"}
            body={updatetemplete}
            headerStyle={{ width: "3rem" }}
            headerClassName="text-xs"
            className="text-xs"
          ></Column>
          <Column
            field="admission_id"
            header="Admi. No."
            filter
            showFilterMenu={false}
            filterPlaceholder="Search by name"
            style={{ minWidth: "8rem" }}
            bodyClassName="pl-12 "
            filterHeaderClassName=""
            headerClassName="text-xs pl-7"
            className="text-xs"
          />
          <Column
            field="image"
            header="Image"
            filter
            showFilterMenu={false}
            body={representativesItemTemplate}
            filterElement={imageFilterHeader}
            bodyClassName="px-2 "
            filterHeaderClassName="pl-10"
            headerClassName="text-xs pl-12"
            className="text-xs"
          />
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
            field="father_name"
            header="Father Name"
            style={{ minWidth: "12rem" }}
            headerClassName="text-xs"
            className="text-xs"
          />
          <Column
            field="class"
            header="Class"
            filter
            showFilterMenu={false}
            filterPlaceholder="class"
            style={{ minWidth: "8rem" }}
            headerClassName="text-xs"
            className="text-xs"
          />
          <Column
            field="section"
            header="Section"
            filter
            showFilterMenu={false}
            filterPlaceholder="section"
            style={{ minWidth: "8rem" }}
            headerClassName="text-xs"
            className="text-xs"
          />
          <Column
            field="dob"
            header="DOB"
            style={{ minWidth: "5rem" }}
            body={dOBTemplate}
            headerClassName="text-xs"
            className="text-xs"
          />
          <Column
            field="address"
            header="Address"
            style={{ minWidth: "14rem" }}
            headerClassName="text-xs"
            className="text-xs"
          />
          <Column
            field="mobile"
            header="Mobile"
            style={{ minWidth: "5rem" }}
            headerClassName="text-xs"
            className="text-xs"
          />
          <Column
            field="status"
            header="Status"
            showFilterMenu={false}
            filterMenuStyle={{ width: "10rem" }}
            style={{ minWidth: "4rem" }}
            body={statusBodyTemplate}
            filterElement={statusRowFilterTemplate}
            headerClassName="text-xs"
            className="text-xs"
          />
          <Column
            field="print"
            header="Printed"
            showFilterMenu={false}
            filterMenuStyle={{ width: "10rem" }}
            style={{ minWidth: "4rem" }}
            filter
            body={printFilterBody}
            filterElement={printFilterHeader}
            bodyClassName="pl-16 "
            filterHeaderClassName="pl-6"
            headerClassName="text-xs pl-12"
            className="text-xs"
          />
        </DataTable>
      </div>
    </>
  );
}
