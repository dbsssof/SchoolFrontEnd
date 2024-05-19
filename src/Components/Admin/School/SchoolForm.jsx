import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { createSchool, updateSchool } from "../../../Redux/Slice/SchoolSlice";
import "../Style.css";
import { useDispatch, useSelector } from "react-redux";
export default function SchoolForm({ label, data, close }) {
  const [formData, setFormData] = useState();
  const [checked, setChecked] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const { School, message, error } = useSelector((state) => state.School);
  const dispatch = useDispatch();
  const formHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (label === "u" && data) {
      const sch = School.filter((item) => item?._id === data?._id);
      setFormData(sch[0]);
      setChecked(sch[0]?.status);
      setSelectedState(sch[0]?.state);
    }
  }, [data, label, School]);

  const cities = ["New York", "Rome", "London"];

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
      severity: "error",
      summary: "Error Message",
      detail: error,
      life: 3000,
    });
  };

  const onSubmit = () => {
    dispatch(
      createSchool({
        ...formData,
        status: checked,
      })
    ).then((doc) =>{
    if(doc.payload.message){
      showSuccessToast(doc.payload.message)
    }
    if(doc.payload.error){
      showSuccessToast(doc.payload.error)
    }
    }
    );
  };
  const onUpdate = () => {
    dispatch(
      updateSchool({
        ...formData,

        status: checked,
      })
    ).then((doc) =>showSuccessToast(doc.payload.message));
  };
  return (
    <>
      {/* {error && showErrorToast(error)} */}
      <Toast ref={toast} />
      <div className="">
        <span className="p-float-label mt-7">
          <InputText
            id="schoolnm"
            name="name"
            value={formData?.name}
            onChange={formHandler}
            className="w-full border-gray-300 border px-2 py-3"
          />
          <label htmlFor="schoolnm">School Name</label>
        </span>
        <span className="p-float-label mt-7">
          <InputText
            id="address"
            name="address"
            value={formData?.address}
            onChange={formHandler}
            className="w-full border-gray-300 border px-2 py-3"
          />
          <label htmlFor="address">Address</label>
        </span>
        <span className="p-float-label mt-7">
          <InputNumber
            id="office1"
            useGrouping={false}
            name="office1"
            value={formData?.office1}
            onChange={(e) => formHandler(e.originalEvent)}
            className="w-full outline-gray-300 outline outline-1 h-12 rounded-md"
          />
          <label htmlFor="office1">Office Number</label>
        </span>
        <span className="p-float-label mt-7">
          <InputNumber
            id="office1"
            useGrouping={false}
            name="office2"
            value={formData?.office2}
            onChange={(e) => formHandler(e.originalEvent)}
            className=" outline-gray-300 outline outline-1 h-12 w-full rounded-md"
          />
          <label htmlFor="office1">Office Number</label>
        </span>
        <div className="flex gap-2 mt-7">
          <span className="p-float-label w-full md:w-14rem">
            <Dropdown
              inputId="dd-state"
              value={formData?.state}
              onChange={formHandler}
              options={cities}
              name="state"
              className="w-full border-gray-300 border"
            />
            <label htmlFor="dd-state">State</label>
          </span>
          <span className="p-float-label ">
            <InputText
              id="city"
              name="city"
              value={formData?.city}
              onChange={formHandler}
              className="w-full border-gray-300 border px-2 py-3"
            />
            <label htmlFor="city">City</label>
          </span>
          <span className="p-float-label ">
            <InputText
              id="address"
              name="pincode"
              value={formData?.pincode}
              onChange={formHandler}
              className="w-full border-gray-300 border px-2 py-3"
            />
            <label htmlFor="address">Pincode</label>
          </span>
        </div>
        <div className=" flex justify-center mt-7">
          <span className="flex gap-3">
            <Checkbox
              id="address"
              className="outline-gray-300 outline outline-1 rounded-md"
              onChange={(e) => setChecked(e.checked)}
              checked={checked}
            ></Checkbox>
            <label htmlFor="address">Active</label>
          </span>
        </div>
        {label === "s" ? (
          <Button
            onClick={onSubmit}
            className="bg-cyan-500 text-white w-full py-3 mt-5"
            label="Create"
          />
        ) : (
          <Button
            onClick={onUpdate}
            className="bg-cyan-500 text-white w-full py-3 mt-5"
            label="Update"
          />
        )}
      </div>
    </>
  );
}
