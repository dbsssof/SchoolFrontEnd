import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Ripple } from "primereact/ripple";
import { Tag } from "primereact/tag";
import { useEffect, useLayoutEffect } from "react";
import {
  BiBook,
  BiBookBookmark,
  BiIdCard,
  BiInfoCircle,
  BiLogOut,
  BiNote,
  BiPlayCircle,
  BiTask,
} from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Redux/Slice/LoginSlice";
import { getByUserAllSchool } from "../Redux/Slice/SchoolSlice";
import { getByIdTeacher } from "../Redux/Slice/TeacherSlice";
import { verifyExpire } from "../Redux/Slice/ExpireSlice";
export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Teacher } = useSelector((state) => state.Teacher);
  const { School } = useSelector((state) => state.School);

  useEffect(() => {
    if (!localStorage.getItem("Ttoken")) {
      navigate("/login");
    }
  }, [navigate]);
  useLayoutEffect(() => {
    dispatch(getByIdTeacher(localStorage.getItem("teach"))).then((doc) => {
      dispatch(getByUserAllSchool(doc.payload.schoolid)).then((doc) => {
        if (doc.payload?.response?.status === 403) {
          dispatch(logout());
          navigate("/login");
        } else {
          localStorage.setItem("schoolid", doc.payload._id);
        }
      });
    });
    dispatch(verifyExpire());
  }, [dispatch]);

  const accept = () => {
    dispatch(logout());
    navigate("/login");
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
      <div className="bg-red-500 rounded-b-3xl p-5 fixed top-0 left-0 right-0 z-50 shadow-gray-400 shadow-md">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <label className="flex flex-col ">
              <span className="italic text-white">{School?.name}</span>
            </label>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <small className="text-white italic">
                Welcome, {Teacher?.name} {Teacher?.lastnm}
              </small>
              <small className="text-white">
                {Teacher?.classs && "Class: " + Teacher?.classs}{" "}
                {Teacher?.section && "Section: " + Teacher?.section}
              </small>
            </div>
            <button onClick={confirm1} className="text-white p-ripple">
              <BiLogOut size={30} />
              <Ripple />
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-scroll h-screen">
        <div className="mt-36 flex justify-center mb-10">
          <div className="grid grid-cols-3 gap-8 md:grid-cols-7 place-content-cente mx-5">
            <Link
              to={"/icard"}
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
            <div className="w-24 h-24 p-ripple border bg-white shadow-gray-300 shadow-md rounded-2xl flex flex-col items-center justify-center">
              <Tag
                value={"coming soon"}
                className="text-xs absolute -top-1 scale-75"
              />
              {/* <Ripple
                pt={{
                  root: { style: { background: "rgba(0, 0, 0, 0.5)" } },
                }}
              /> */}

              <BiTask size={40} />
              <label className="font-semibold">Task</label>
            </div>
            <div className="w-24 h-24 p-ripple border bg-white shadow-gray-300 shadow-md rounded-2xl flex flex-col items-center justify-center">
              <Tag
                value={"coming soon"}
                className="text-xs absolute -top-1 scale-75"
              />
              {/* <Ripple
                pt={{
                  root: { style: { background: "rgba(0, 0, 0, 0.5)" } },
                }}
              /> */}
              <BiBook size={40} />

              <label className="font-semibold">Subject</label>
            </div>

            <div className="w-24 h-24 p-ripple border bg-white shadow-gray-300 shadow-md rounded-2xl flex flex-col items-center justify-center">
              <Tag
                value={"coming soon"}
                className="text-xs absolute -top-1 scale-75"
              />
              {/* <Ripple
                pt={{
                  root: { style: { background: "rgba(0, 0, 0, 0.5)" } },
                }}
              /> */}

              <BiNote size={40} />
              <label className="font-semibold">Exam</label>
            </div>
            <div className="w-24 h-24 p-ripple border bg-white shadow-gray-300 shadow-md rounded-2xl flex flex-col items-center justify-center">
              <Tag
                value={"coming soon"}
                className="text-xs absolute -top-1 scale-75"
              />
              {/* <Ripple
                pt={{
                  root: { style: { background: "rgba(0, 0, 0, 0.5)" } },
                }}
              /> */}
              <BiInfoCircle size={40} />

              <label className="font-semibold">Live Q&A</label>
            </div>
            <div className="w-24 h-24 p-ripple border bg-white shadow-gray-300 shadow-md rounded-2xl flex flex-col items-center justify-center">
              <Tag
                value={"coming soon"}
                className="text-xs absolute -top-1 scale-75"
              />
              {/* <Ripple
                pt={{
                  root: { style: { background: "rgba(0, 0, 0, 0.5)" } },
                }}
              /> */}
              <BiPlayCircle size={40} />

              <label className="font-semibold">Video</label>
            </div>
            <div className="w-24 h-24 p-ripple border bg-white shadow-gray-300 shadow-md rounded-2xl flex flex-col items-center justify-center">
              <Tag
                value={"coming soon"}
                className="text-xs absolute -top-1 scale-75"
              />
              {/* <Ripple
                pt={{
                  root: { style: { background: "rgba(0, 0, 0, 0.5)" } },
                }}
              /> */}

              <BiBookBookmark size={40} />
              <label className="font-semibold">Lessson</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
