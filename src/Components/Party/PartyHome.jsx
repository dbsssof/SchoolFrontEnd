import { Ripple } from "primereact/ripple";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../Redux/Slice/PartySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useLayoutEffect } from "react";
import { getByUserAllSchool } from "../../Redux/Slice/SchoolSlice";
import {
  BiUserCircle,
  BiLogOutCircle,
  BiIdCard,
  BiError,
} from "react-icons/bi";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {verifyExpire} from "../../Redux/Slice/ExpireSlice";
export default function PartyHome(params) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { School } = useSelector((state) => state.School);

  const { error } = useSelector((state) => state.PartyAuth);

  useEffect(() => {
    if (!localStorage.getItem("partyToken")) {
      navigate("/thirdpartylogin");
    }
  }, [navigate]);

  useLayoutEffect(() => {
    dispatch(getByUserAllSchool(localStorage.getItem("schoolid"))).then(
      (doc) => {
        if (doc.payload?.response?.status === 403) {
          dispatch(logout());
          navigate("/thirdpartylogin");
        }
      }
    );
    dispatch(verifyExpire());
  }, [dispatch]);

  const accept = () => {
    dispatch(logout());
    navigate("/thirdpartylogin");
  };

  const confirm1 = () => {
    confirmDialog({
      message: "Are you sure you want to Logout ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "bg-cyan-500 text-white px-5 py-2 ml-5",
      rejectClassName: "border-2 border-cyan-500 px-5 py-2",
      defaultFocus: "accept",
      accept,
    });
  };

  return (
    <>
      <ConfirmDialog />
      <div className="bg-red-500 rounded-b-3xl fixed top-0 left-0 right-0 z-50 shadow-gray-400 shadow-md">
        <div className="flex justify-between px-10 py-4">

          <div className="flex items-center gap-4">
            <BiUserCircle size="50" color="#fff" />
            <label className="flex flex-col ">
              <small className="text-white">
                {localStorage.getItem("schoolName")}
              </small>
              <span className="text-[8pt] italic text-white">
                Welcome, {localStorage.getItem("user")}
              </span>
            </label>
          </div>      

          <button onClick={confirm1} className="text-white p-ripple">
            <BiLogOutCircle size={30} />
            <Ripple />
          </button>

        </div>
      </div>
      <div className="overflow-scroll h-screen">
        <div className="mt-36 flex justify-center mb-10">
          <div className="grid grid-cols-3 gap-8 md:grid-cols-7 place-content-cente mx-5">
            <Link
              to={"/thirdparty/icard"}
              className="w-24 h-24 p-ripple border bg-white shadow-gray-300 shadow-md rounded-2xl flex flex-col items-center justify-center"
            >
              <Ripple
                pt={{
                  root: { style: { background: "rgba(0, 0, 0, 0.5)" } },
                }}
              />
              <BiIdCard size={40} />

              <label className="font-semibold">ICard</label>
            </Link>
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
}
