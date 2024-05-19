import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getByUserAllSchool } from "../../../Redux/Slice/SchoolSlice";
import "../Style.css";
import SchoolDashboard from "./SchoolDashboard";
import SchoolForm from "./SchoolForm";

export default function School({ data }) {
  const dispatch = useDispatch();
  const [selectSchool, setSelectSchool] = useState();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [lable, setLable] = useState();
  const { loading, School } = useSelector((state) => state.School);
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("Admintoken")) {
      return navigate("/adminlogin");
    }
    dispatch(getByUserAllSchool(localStorage.getItem("schoolid")));
  }, [dispatch, navigate]);

  const statusBodyTemplate = (School) => {
    return (
      <Tag
        value={School.status === true ? "Active" : "De-active"}
        severity={getSeverity(School.status || false)}
      ></Tag>
    );
  };

  const getSeverity = (School) => {
    switch (School) {
      case true:
        return "success";

      case false:
        return "danger";
    }
  };

  const header = (
    <div className="flex justify-between items-center">
      <span className="text-xl text-900 font-bold">School List</span>
      <Button
        onClick={() => {
          setVisible(true);
          setLable("s");
        }}
        label="Create School"
        className="bg-cyan-500 p-2 text-white"
      />
    </div>
  );
  const footer = `In total there are ${School ? School.length : 0} Schools.`;

  return (
    <>
      <Dialog
        header={"Create School"}
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "50vh" }}
      >
        <SchoolForm label={lable} close={() => setVisible(false)} />
      </Dialog>
      {selectSchool && (
        <Dialog
          header={selectSchool?.name + " Dashboard"}
          visible={visible2}
          maximized
          onHide={() => setVisible2(false)}
        >
          <SchoolDashboard data={selectSchool} />
        </Dialog>
      )}
      <DataTable
        value={School}
        header={header}
        rows={10}
        paginator
        footer={footer}
        tableStyle={{ minWidth: "60rem" }}
        selectionMode="single"
        selection={selectSchool}
        onSelectionChange={(e) => {
          setSelectSchool(e.value);
          setVisible2(true);
        }}
      >
        <Column field="name" header="School Name"></Column>
        <Column field="address" header="Address"></Column>
        <Column field="city" header="City"></Column>
        <Column field="state" header="State"></Column>
        <Column field="office1" header="Office Number"></Column>
        <Column field="office2" header="Office Number"></Column>
        <Column
          header="Status"
          field="status"
          body={statusBodyTemplate}
        ></Column>
      </DataTable>
    </>
  );
}
