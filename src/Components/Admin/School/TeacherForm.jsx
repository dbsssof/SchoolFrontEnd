import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import {
  updateTeacher,
  createTeacher,
} from "../../../Redux/Slice/TeacherSlice";
import { useDispatch, useSelector } from "react-redux";

export default function TeacherForm({ label, data, visibles }) {
  const [formData, setFormData] = useState({});
  const [checked, setChecked] = useState(false);
  const { Teacher, message, error, loading } = useSelector(
    (state) => state.Teacher
  );
  const { Classs } = useSelector((state) => state.Class);
  const { Sections } = useSelector((state) => state.Section);
  const dispatch = useDispatch();
  const formHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (label === "u" && data) {
      const sch = Teacher.filter((item) => item?._id === data?._id);
      setFormData(sch[0]);
      setChecked(sch[0]?.status);
    }
  }, [data, label, Teacher]);

  const toast = useRef(null);

  const showSuccessToast = (message) => {
    toast.current.show({
      severity: "success",
      detail: message,
      life: 3000,
    });
  };

  const showErrorToast = (error) => {
    toast.current.show({
      severity: "info",
      detail: error,
      life: 3000,
    });
  };

  const onSubmit = () => {
    dispatch(
      createTeacher({
        ...formData,
        status: checked,
        schoolid: localStorage.getItem("schoolid"),
      })
    ).then(() => {
      error && showErrorToast(error);
      message && showSuccessToast(message);
    });
  };
  const onUpdate = () => {
    dispatch(
      updateTeacher({
        ...formData,
        status: checked,
      })
    ).then(() => {
      (error && showErrorToast(error)) ||
        (message && showSuccessToast(message));
    });
  };

  return (
    <>
      <Toast ref={toast} />

      <div className="">
        <div className="flex gap-3">
          <span className="p-float-label mt-7 w-full">
            <InputText
              id="name"
              name="name"
              value={formData?.name || ""}
              onChange={formHandler}
              className="w-full border-gray-300 border h-12 p-2"
              autoComplete="off"
            />
            <label htmlFor="name">
              Enter Name <small className=" text-red-500">*</small>
            </label>
          </span>
          <span className="p-float-label mt-7 w-full">
            <InputText
              id="lastnm"
              name="lastnm"
              value={formData?.lastnm || ""}
              onChange={formHandler}
              className="w-full border-gray-300 border h-12 p-2"
              autoComplete="off"
            />
            <label htmlFor="lastnm">
              Last Name <small className=" text-red-500">*</small>
            </label>
          </span>
        </div>
        <span className="p-float-label mt-7">
          <InputText
            id="address"
            name="address"
            value={formData?.address || ""}
            onChange={formHandler}
            className="w-full border-gray-300 border h-12 p-2"
            autoComplete="off"
          />
          <label htmlFor="address">Address</label>
        </span>
        <span className="p-float-label mt-7">
          <InputNumber
            id="mobile"
            name="mobile"
            value={formData?.mobile}
            onChange={(e) => formHandler(e.originalEvent)}
            useGrouping={false}
            inputClassName="pl-2"
            className="w-full h-12 rounded-lg  border-gray-300 border"
            autoComplete="off"
          />
          <label htmlFor="mobile">Enter Mobile</label>
        </span>

        <div className="flex gap-2 mt-7">
          <span className="p-float-label w-full md:w-14rem">
            <Dropdown
              inputId="dd-class"
              value={formData?.classs}
              onChange={formHandler}
              options={Classs}
              name="classs"
              optionLabel="class"
              optionValue="class"
              className="w-full border-gray-300 border"
              autoComplete="off"
            />
            <label htmlFor="dd-class">
              Select Class <small className=" text-red-500">*</small>
            </label>
          </span>
          <span className="p-float-label w-full md:w-14rem">
            <Dropdown
              inputId="dd-section"
              name="section"
              value={formData?.section}
              onChange={formHandler}
              options={Sections}
              optionLabel="section"
              optionValue="section"
              className="w-full border-gray-300 border"
              autoComplete="off"
            />
            <label htmlFor="dd-section">
              Select Section <small className=" text-red-500">*</small>
            </label>
          </span>
        </div>
        <div className="flex justify-center mt-7">
          <span className="flex gap-3">
            <Checkbox
              id="status"
              name="status"
              className="outline-gray-300 outline outline-1 rounded-md"
              onChange={(e) => setChecked(e.checked)}
              checked={checked}
            ></Checkbox>
            <label htmlFor="status">Active</label>
          </span>
        </div>
        {label === "s" ? (
          <Button
            loading={loading}
            disabled={
              formData?.name &&
              formData?.lastnm &&
              formData?.classs &&
              formData?.section
                ? false
                : true
            }
            onClick={onSubmit}
            className="bg-cyan-500 text-white w-full py-3 mt-5"
            label="Create"
          />
        ) : (
          <Button
            loading={loading}
            disabled={loading}
            onClick={onUpdate}
            className="bg-cyan-500 text-white w-full py-3 mt-5"
            label="Update"
          />
        )}
      </div>
    </>
  );
}
