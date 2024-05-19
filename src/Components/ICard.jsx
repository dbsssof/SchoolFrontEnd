import moment from "moment";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";
import { Ripple } from "primereact/ripple";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import No_Image from "./Assets/Image/NO_IMAGE.jpg";
import Loading from "./Loading";

import { BiChevronLeft, BiEdit, BiIdCard } from "react-icons/bi";

import ICardForm from "./ICardForm";

import { AllClass } from "../Redux/Slice/ClassSlice";
import { fetchByClassSectionSchoolAllIcards } from "../Redux/Slice/IcardSlice";
import { AllSection } from "../Redux/Slice/SectionSlice";
import { getByIdTeacher } from "../Redux/Slice/TeacherSlice";
import { Toast } from "primereact/toast";

export default function ICard() {
  const navigate = useNavigate();
  const disptch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [selectOneStudent, setSelectOneStudent] = useState();
  const [label, setLable] = useState("");
  // const [filterItem, setFilterItem] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  // const [filterClass, setFilterClass] = useState();
  // const [filterSection, setFilterSection] = useState();
  const [selectAll, setSelectAll] = useState(false);
  const { ICards, loading, message, error } = useSelector(
    (state) => state.Icard
  );
  // const { Classs } = useSelector((state) => state.Class);
  // const { Sections } = useSelector((state) => state.Section);

  useLayoutEffect(() => {
    disptch(getByIdTeacher(localStorage.getItem("teach"))).then((doc) => {
      disptch(
        fetchByClassSectionSchoolAllIcards({
          classs: doc.payload?.classs,
          section: doc.payload?.section,
          school: doc.payload?.schoolid,
        })
      );
    });
    disptch(AllClass());
    disptch(AllSection());
  }, [disptch]);

  useLayoutEffect(() => {
    if (!localStorage.getItem("Ttoken")) {
      navigate("/login");
    }
  }, []);

  const handleCreateIcard = () => {
    setLable("s");
    setVisible(true);
  };
  const toast = useRef(null);

  const showErrorToast = (error) => {
    toast.current.show({
      severity: "info",
      detail: error,
      life: 3000,
    });
  };
  const showSuccessToast = (message) => {
    toast.current.show({
      severity: "success",
      detail: message,
      life: 3000,
    });
  };

  useEffect(() => {
    if (message) {
      showSuccessToast(message);
    }
    if (error) {
      showErrorToast(error);
    }
  }, [message, error]);

  return (
    <>
      {loading && <Loading />}
      <Toast ref={toast} />
      <div className="w-full bg-red-500 p-3 flex ">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(-1)} className="p-ripple">
            <BiChevronLeft color="#FFF" size={40} />
            <Ripple />
          </button>
          <span className=" text-white font-semibold text-xl"> ICard List</span>
        </div>
      </div>

      {/* <Dialog
        header={"Bulk Upload via Excel"}
        visible={visible2}
        style={{ width: "400px", height: "auto" }}
        onHide={() => setVisible2(false)}
      >
        <BulkExcelUploadForm visbile={() => setVisible2(false)} />
      </Dialog> */}

      <Dialog
        header={label === "s" ? "Create ICard" : "Update ICard"}
        position="bottom"
        visible={visible}
        onHide={() => setVisible(false)}
        className="w-[95vw] md:w-[450px] h-[95vh] md:h-auto  mx-2"
      >
        <ICardForm
          item={selectOneStudent}
          label={label}
          visbile={() => setVisible(false)}
        />
      </Dialog>

      <div className="w-fill sticky z-40 bg-white top-0 left-0 right-0 p-3">
        <div className="w-full flex justify-center mx-auto">
          <div className="w-full gap-3 grid sm:grid-cols-1 md:grid-cols-2 md:justify-between">
            <div className="flex sm:w-full sm:justify-between lg:justify-start gap-5">
              {/* <button
                disabled={selectedItems >= 0 ? true : false}
                onClick={handlePrint}
                className="bg-blue-500 w-10 h-10 flex rounded-full p-ripple disabled:bg-blue-700"
              >
                <BiPrinter className="text-2xl m-auto text-white" />
                <Ripple />
              </button> */}
              <button
                onClick={handleCreateIcard}
                className="bg-blue-500 w-auto px-3 h-10 rounded-md flex items-center p-ripple"
              >
                <BiIdCard className=" text-2xl text-white" />
                <label
                  htmlFor="ingredient1"
                  className="ml-2 text-base text-white font-semibold"
                >
                  create
                </label>
                <Ripple />
              </button>
              {/* <button
                onClick={handleSelectAll}
                className="bg-blue-500 w-auto px-3 h-10 rounded-full flex items-center p-ripple"
              >
                <Checkbox
                  inputId="selectAll"
                  value="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAll}
                ></Checkbox>
                <label
                  htmlFor="ingredient1"
                  className="ml-2 text-[8pt] md:text-lg text-white font-semibold"
                >
                  Select All
                </label>
                <Ripple />
              </button> */}
              {/* <button
                className="bg-blue-500 w-auto px-3 h-10 rounded-full flex items-center p-ripple text-white"
                onClick={() => setVisible2(true)}
              >
                <BiListOl size={25} />
              </button> */}
            </div>

            {/* <div className="flex items-center sm:justify-between lg:justify-start">
              <label>Filter</label>
              <Dropdown
                placeholder="class"
                value={filterClass}
                options={Classs}
                optionLabel="class"
                optionValue="class"
                onChange={(e) => setFilterClass(e.value)}
                className="border-gray-400 border mx-2 h-13"
              />
              <Dropdown
                disabled={filterClass ? false : true}
                value={filterSection}
                options={Sections}
                optionLabel="section"
                optionValue="section"
                onChange={(e) => setFilterSection(e.value)}
                placeholder="Section"
                className="border-gray-400 border mx-2 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                className="p-ripple bg-blue-500 w-full max-w-16 py-3 rounded-md text-white"
                onClick={() => {
                  setFilterClass("");
                  setFilterSection("");
                }}
              >
                <BiReset size={30} className="w-full" />
                <Ripple />
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {ICards?.map((item, index) => (
            <div
              key={index}
              className="icard shadow-gray-400 shadow-lg  m-2 relative border-gray-300 border rounded-lg"
            >
              <div className="grid gap-3 absolute right-3 top-5 z-30">
                {/* <div className=" text-white w-10 h-10 p-1 rounded-full  flex justify-center items-center">
                  <Checkbox
                    className="outline-sky-400 outline rounded-md"
                    inputId={`item-${item.id}`}
                    checked={selectedItems.includes(item)}
                    onChange={() => handleSelectItem(item)}
                  />
                </div> */}

                <Button
                  onClick={() => {
                    setSelectOneStudent({ ...item, id: item._id });
                    setLable("u");
                    setVisible(true);
                  }}
                  className="bg-black text-white w-10 h-10 rounded-full flex justify-center items-center"
                >
                  <BiEdit className="text-2xl"></BiEdit>
                </Button>
              </div>
              <div className="flex items-center gap-3 relative p-2">
                <div className="relative">
                  <Image
                    className=""
                    src={item?.image || No_Image}
                    alt="Image"
                    width={150}
                    height={150}
                    loading="lazy"
                  />
                </div>

                <div className="text-xs">
                  <div className="">
                    <label className="font-bold">Adm. No. :-</label>
                    <span className="">{item.admission_id}</span>
                  </div>
                  <div className="">
                    <label className="font-bold">Roll No. :-</label>
                    <span className="">{item.rollno}</span>
                  </div>
                  <div className="">
                    <label className="font-bold">Name :-</label>
                    <span className="">{item.name}</span>
                  </div>
                  <div className="">
                    <div className="">
                      <label className="font-bold">Class :-</label>
                      <span className="">{item.class}</span>
                    </div>
                    <div className="">
                      <label className="font-bold capitalize">Section :-</label>
                      <span className="capitalize">{item.section}</span>
                    </div>
                  </div>
                  <div className="">
                    <label className="font-bold">DOB :-</label>
                    <span className="">
                      {moment(item.dob).format("DD/MM/YYYY")}
                    </span>
                  </div>
                  <div className="">
                    <label className="font-bold">F. Name :-</label>
                    <span className="">{item.father_name}</span>
                  </div>
                  <div className="">
                    <label className="font-bold">Mobile NO.:-</label>
                    <span className="">{item.mobile}</span>
                  </div>
                  <div className="">
                    <label className="font-bold">Address:-</label>
                    <span className="">{item.address}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
