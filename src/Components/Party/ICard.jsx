import { Dialog } from "primereact/dialog";
import No_Image from "../Assets/Image/NO_IMAGE.jpg";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Ripple } from "primereact/ripple";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import Loading from "../Loading";
import {
  BiChevronLeft,
  BiPrinter,
  BiIdCard,
  BiReset,
  BiEdit,
} from "react-icons/bi";
import ICardForm from "../ICardForm";
import { fetchAllIcards } from "../../Redux/Slice/IcardSlice";
import { AllSection } from "../../Redux/Slice/SectionSlice";
import { AllClass } from "../../Redux/Slice/ClassSlice";
import { Dropdown } from "primereact/dropdown";

export default function ICard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [selectOneStudent, setSelectOneStudent] = useState();
  const [label, setLable] = useState("");
  const [filterIcard, setFilterIcard] = useState();
  const [searchInput, setSearchInput] = useState();

  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const { ICards, loading } = useSelector((state) => state.Icard);
  const { Classs } = useSelector((state) => state.Class);
  const { Sections } = useSelector((state) => state.Section);

  useEffect(() => {
    dispatch(fetchAllIcards(localStorage.getItem("schoolid")));
    dispatch(AllClass(localStorage.getItem("schoolid")));
    dispatch(AllSection(localStorage.getItem("schoolid")));
  }, [dispatch]);

  const filterData = (item) => {
    return (
      (!filterClass || item.class === filterClass) &&
      (!filterSection || item.section === filterSection) &&
      (!searchInput ||
       (item.name && item.name.toLowerCase().includes(searchInput.toLowerCase())) )// Step 2: Filter based on name
    );
  };

  useEffect(() => {}, []);
  return (
    <>
      {loading && <Loading />}

      <div className="w-full bg-red-500 p-3 flex ">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(-1)} className="p-ripple">
            <BiChevronLeft color="#FFF" size={40} />
            <Ripple />
          </button>
          <span className="text-white font-semibold text-xl">ICard List</span>
        </div>
      </div>

      <Dialog
        header={label === "s" ? "Create ICard" : "Update ICard"}
        position="bottom"
        visible={visible}
        onHide={() => setVisible(false)}
        className="w-[95vw] md:w-[450px] h-[95vh] md:h-auto mx-2"
      >
        <ICardForm
          item={selectOneStudent}
          label={label}
          disble={false}
          visbile={() => setVisible(false)}
        />
      </Dialog>

      <div className="w-fill sticky z-40 bg-white top-0 left-0 right-0 p-3">
        <div className="w-full flex flex-col justify-center mx-auto">
          <div>
            <button
              className="bg-blue-500 px-3 py-2 w-full my-2 rounded-md text-white"
              onClick={() => {
                setLable("s");
                setVisible(true);
              }}
            >
              Create
            </button>
          </div>
          <div className=" flex gap-3 w-full">
            <IconField iconPosition="right" className="w-full">
              <InputText
                v-model="value1"
                placeholder="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="border w-full h-12 pl-2 mb-3"
              />
            </IconField>
            <button
              type="button"
              className="p-ripple bg-blue-500 w-full max-w-16 h-12 rounded-md text-white"
              onClick={() => {
                setSearchInput("");
              }}
            >
              <BiReset size={30} className="w-full" />
              <Ripple />
            </button>
          </div>
          <div className="w-full gap-3 grid sm:grid-cols-1 md:grid-cols-2 md:justify-between">
            <div className="flex items-center sm:justify-between lg:justify-start">
              <label>Filter</label>
              <Dropdown
                placeholder="Class"
                value={filterClass}
                options={Classs}
                optionLabel="class"
                optionValue="class"
                onChange={(e) => setFilterClass(e.value)}
                className="border-gray-400 border mx-2 h-13"
              />
              <Dropdown
                disabled={!filterClass}
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
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {ICards.filter(filterData).map((item, index) => (
            <div
              key={index}
              className="icard shadow-gray-400 shadow-md m-2 relative border-gray-300 border"
            >
              <div className="grid gap-3 absolute right-3 top-5 z-30">
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
                <div className="relative w-[150px] h-[150px]">
                  <Image
                    className="w-full h-full"
                    src={item?.image || No_Image}
                    alt="Image"
                    loading="lazy"
                  />
                </div>
                <div className="text-xs">
                  <div className="">
                    <label className="font-bold">Adm. No. :-</label>
                    <span className="">{item.admission_id}</span>
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
                      <label className="font-bold">Section :-</label>
                      <span className="">{item.section}</span>
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
