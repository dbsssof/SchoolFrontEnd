import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { FloatLabel } from "primereact/floatlabel";
import { Ripple } from "primereact/ripple";
import { loginParty, logout } from "../../Redux/Slice/PartySlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const dispatch = useDispatch();
  const toast = useRef(null);
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.PartyAuth);

  useLayoutEffect(() => {
    if (localStorage.getItem("partyToken")) {
      navigate("/thirdparty");
    }
  }, [navigate]);

  const onSubmilt = () => {
    dispatch(loginParty({ email: user, pass: pass })).then((doc) => {
      if (doc.payload?.status === true) {
        navigate("/thirdparty");
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
          <h2 className="pt-24 flex flex-col items-center">
            <label className="font-bold text-5xl uppercase text-red-500">
              Third party
            </label>
            {/* <span className="text-xl text-blue-500 font-semibold">
              LMS, ICARD, EXAM
            </span> */}
          </h2>
        </div>
        <div className="formAnim md:w-[480px] bg-white absolute bottom-24 left-0 right-0 mx-5 md:mx-auto rounded-3xl border-gray-400 border shadow-gray-500 shadow-md px-5 py-12">
          <div className="absolute -top-16 h-12 w-[90%] mb-2">
            {error && (
              <div className="h-full border flex justify-center items-center text-red-500 font-bold bg-red-100 rounded-lg ">
                {error}
              </div>
            )}
          </div>
          <span className="w-full mt-7">
            <FloatLabel>
              <InputText
                autoFocus={true}
                id="username"
                name="email"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full h-12 p-2 border-gray-300 border"
              />
              <label htmlFor="username">Username </label>
            </FloatLabel>
          </span>
          <span className="p-float-label w-full mt-7">
            <FloatLabel>
              <Password
                inputId="password"
                name="pass"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                inputClassName="w-full h-12 pl-3"
                className="w-full rounded-md border-gray-300 border"
                feedback={false}
                toggleMask
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
        </div>
      </div>
    </>
  );
}
