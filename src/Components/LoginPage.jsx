import React, { useLayoutEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Ripple } from "primereact/ripple";
import { loginUser, logout } from "../Redux/Slice/LoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Message } from "primereact/message";
import { FloatLabel } from "primereact/floatlabel";
import { Toast } from "primereact/toast";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const dispatch = useDispatch();
  const toast = useRef(null);
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.Auth);
  useLayoutEffect(() => {
    if (localStorage.getItem("Ttoken")) {
      navigate("/");
    }
  }, [navigate]);

  const onSubmilt = () => {
    dispatch(loginUser({ email: user, pass: pass })).then(() => {
      if (!error) {
        navigate("/");
      }
    });
  };
  return (
    <>
      <Toast ref={toast} />
      <div className="w-screen h-screen bg-blue-500">
        <div className="login-gray-layer bg-gray-200 rounded-b-3xl">
          <h1 className="capitalize text-4xl font-bold text-center pt-24">
            <span className="text-blue-500">Digital</span> branded school
            solutions
          </h1>
          <h2 className="mt-3 flex flex-col items-center">
            <label className="font-bold text-5xl uppercase text-red-500">
              Teacher Login
            </label>
          </h2>
        </div>
        <div className="formAnim md:w-[480px] bg-white absolute bottom-24 left-0 right-0 mx-5 md:mx-auto rounded-3xl border-gray-400 border shadow-gray-500 shadow-md px-5 py-12">
          {error && (
            <Message
              severity="error"
              text={`${error}`}
              className="absolute -top-20 left-0 w-full"
            />
          )}
          <form>
            <span className="p-float-label ">
              <InputText
                id="username"
                value={user}
                className="w-full border-gray-300 border rounded-xl h-16 pl-3"
                onChange={(e) => setUser(e.target.value)}
              />
              <label htmlFor="username">Username</label>
            </span>
            <span className="p-float-label w-full mt-10">
              <FloatLabel>
                <Password
                  inputId="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  inputClassName="w-full h-16 pl-3"
                  className="w-full border-gray-300 border rounded-xl overflow-hidden"
                  toggleMask
                  feedback={false}
                />
                <label htmlFor="password">Password</label>
              </FloatLabel>
            </span>
            <button
              onClick={onSubmilt}
              type="button"
              disabled={user && pass ? false : true}
              className="w-full bg-red-500 text-white p-6 rounded-full text-center mt-5 font-bold p-ripple disabled:bg-red-700"
            >
              Login
              {user && pass ? <Ripple /> : ""}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
