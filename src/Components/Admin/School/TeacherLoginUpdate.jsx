import { TabPanel, TabView } from "primereact/tabview";
import { BiDetail, BiGroup } from "react-icons/bi";
import TeacherFrom from "./TeacherForm";
import { Password } from "primereact/password";
import { FloatLabel } from "primereact/floatlabel";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import {
  createTeacherLogin,
  findlogger,
  updateTeacherLogin,
} from "../../../Redux/Slice/TeacherLoginSlice";
import { Toast } from "primereact/toast";

export default function TeacherLoginUpdate({ data }) {
  return (
    <>
      <TabView>
        <TabPanel
          header="Update Teacher"
          leftIcon={<BiDetail className="mr-3" />}
        >
          <TeacherFrom data={data} label={"u"} />
        </TabPanel>
        <TabPanel
          header="Create Teacher login"
          leftIcon={<BiGroup className="mr-3" />}
        >
          <RegisterForm data={data} />
        </TabPanel>
      </TabView>
    </>
  );
}

const RegisterForm = ({ data }) => {
  const [formData, setFormData] = useState();
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();

  const formHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  useLayoutEffect(() => {
    if (data) {
      dispatch(findlogger(data?._id)).then((e) => {
        setChecked(e.payload.data?.status);
        setFormData(e.payload.data);
      });
    }
  }, [dispatch]);

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
  const onChangeUserPassword = () => {
    dispatch(updateTeacherLogin({ ...formData, status: checked })).then(
      (doc) => {
        if (doc.payload?.message) {
          showSuccessToast(doc.payload?.message);
        }
        if (doc.payload?.error) {
          showErrorToast(doc.payload?.error);
        }
      }
    );
  };
  const onRegister = () => {
    dispatch(
      createTeacherLogin({
        ...formData,
        status: checked,
        auth: true,
        user: data?._id,
      })
    ).then((doc) => {
      if (doc.payload?.message) {
        showSuccessToast(doc.payload?.message);
      }
      if (doc.payload?.error) {
        showErrorToast(doc.payload?.error);
      }
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="flex gap-3">
        <span className="p-float-label w-full mt-7">
          <FloatLabel>
          <InputText
            id="username"
            value={data?.name}
            name="email"
            onChange={formHandler}
            disabled
            className="w-full pl-3 border-gray-300 border px-2 py-3"
          />
          <label htmlFor="username">First Name</label>
          </FloatLabel>
        </span>
        <span className="p-float-label w-full mt-7">
          <FloatLabel>
          <InputText
            id="username"
            value={data?.lastnm}
            name="email"
            onChange={formHandler}
            disabled
            className="w-full pl-3 border-gray-300 border px-2 py-3"
          />
          <label htmlFor="username">Last Name</label>
          </FloatLabel>
        </span>
      </div>
      <span className="p-float-label w-full mt-7">
        <FloatLabel >
        <InputText
          id="username"
          value={formData?.email}
          name="email"
          onChange={formHandler}
          className="w-full pl-3  border-gray-300 border px-2 py-3"
        />
        <label htmlFor="username">Username</label>
        </FloatLabel>
      </span>
      {formData?.auth ? (
        <>
          <span className="p-float-label mt-7">
            <InputText
              id="username"
              value={formData?.ogpass}
              name="ogpass"
              onChange={formHandler}
              feedback={false}
              disabled
              className="w-full pl-3 border-gray-300 border  h-12 rounded-md"
            />
            <label htmlFor="username">Orignal Password</label>
          </span>
          <div className="p-float-label mt-7">
            <FloatLabel>
            <Password
              id="username"
              value={formData?.newpass}
              name="newpass"
              onChange={formHandler}
              feedback={false}
              inputClassName="w-full h-12 pl-3"
              toggleMask
              className="w-full border-gray-300 border  h-12 rounded-md"
            />
            <label htmlFor="username">Enter Password</label>
            </FloatLabel></div>
        </>
      ) : (
        
        <span className="p-float-label w-full mt-7 relative">
          <FloatLabel>
            <Password
              inputId="password"
              value={formData?.pass}
              name="pass"
              onChange={formHandler}
              inputClassName="w-full h-12 pl-3"
              className="w-full rounded-md border-gray-300 border"
              feedback={false}
              toggleMask
            />
            <label htmlFor="password">Password</label>
          </FloatLabel>
        </span>
      )}

      <span className="flex justify-center gap-3 mt-7">
        <Checkbox
          id="status"
          name="status"
          className="outline-gray-300 outline outline-1 rounded-md"
          onChange={(e) => setChecked(e.checked)}
          checked={checked}
        ></Checkbox>
        <label htmlFor="address">Active</label>
      </span>
      {formData?.auth ? (
        <Button
          label="Update"
          onClick={onChangeUserPassword}
          className="mt-7 bg-cyan-500 w-full text-white p-3"
        />
      ) : (
        <Button
          label="Create"
          onClick={onRegister}
          className="mt-7 bg-cyan-500 w-full text-white p-3"
        />
      )}
    </>
  );
};
