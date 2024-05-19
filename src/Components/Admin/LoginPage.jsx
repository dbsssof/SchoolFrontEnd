import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Redux/Slice/AdminLoginSlice";
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getByUserAllSchool } from "../../Redux/Slice/SchoolSlice";
import { FloatLabel } from "primereact/floatlabel";

export default function LoginPage(params) {
  const [formData, setFormData] = useState({ email: "", pass: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.SchoolAdmin
  );
  const formHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!localStorage.getItem("Admintoken")) {
      return navigate("/adminlogin");
    }
  }, {});
  const onLogin = () => {
    dispatch(loginUser(formData)).then((doc) => {
      if (localStorage.getItem("schoolid")) {
        dispatch(getByUserAllSchool(localStorage.getItem("schoolid")));
        navigate("/admin");
      }
    });
  };
  return (
    <>
      <Dialog maximized visible={true} showHeader={false}>
        <div className="grid h-full  place-content-center ">
          <div className="grid grid-cols-1 place-content-center p-5  w-96">
            <div className="h-12 mb-2">
              {error && (
                <div className="h-full border flex justify-center items-center text-red-500 font-bold bg-red-100 rounded-lg ">
                  {error}
                </div>
              )}
            </div>
            <div className="text-center font-bold text-2xl">
              <h1>School Admin Login</h1>
            </div>
            <span className="w-full mt-7">
              <FloatLabel>
                <InputText
                  autoFocus={true}
                  id="username"
                  name="email"
                  value={formData?.email}
                  onChange={formHandler}
                  className="w-full h-12 p-2 border-gray-300 border"
                />
                <label htmlFor="username">Username </label>
              </FloatLabel>
            </span>
            <span className="w-full mt-7">
              <FloatLabel>
                <Password
                  inputId="password"
                  name="pass"
                  value={formData?.pass}
                  onChange={formHandler}
                  inputClassName="w-full h-12 pl-3"
                  className="w-full rounded-md border-gray-300 border"
                  feedback={false}
                  toggleMask
                
                />
                <label htmlFor="password">Password</label>
              </FloatLabel>
            </span>
            <Button
              label="Login"
              disabled={formData.email && formData.pass ? false : true}
              loading={loading}
              unstyled={true}
              onClick={onLogin}
              className="flex justify-center gap-3 items-center bg-cyan-500 hover:bg-cyan-600 duration-300 text-white py-3 mt-7 disabled:bg-cyan-300 rounded-lg"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
