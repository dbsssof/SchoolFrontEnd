import Compressor from "compressorjs";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ConfirmPopup } from "primereact/confirmpopup";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AllClassBySchoolStatus } from "../Redux/Slice/ClassSlice";
import {
  createIcard,
  updateIcard
} from "../Redux/Slice/IcardSlice";
import { AllSectionBySchoolStatus } from "../Redux/Slice/SectionSlice";
import No_Image from "./Assets/Image/NO_IMAGE.jpg";
import Loading from "./Loading";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { BiCamera, BiMenu } from "react-icons/bi";
import ImageCropper from "./ImageCropper2";

export default function ICardForm({ item, label, visbile, disble }) {
  const [formData, setFormData] = useState({
    address: "",
    father_name: "",
    name: "",
    mobile: "",
    image: "",
    class: "",
    dob: null,
    schoolid: localStorage.getItem("schoolid"),
    admission_id: "",
    section: "",
    status: false,
    print: false,
  });
  const { loading } = useSelector((state) => state.Icard);
  const [visbileModel, setVisbileModel] = useState(false);
  const [visbiles, setVisbiles] = useState(false);
  const [imageData, setImageData] = useState(null);

  const [date, setDate] = useState();
  const [checked, setChecked] = useState(false);
  const [checkedPrint, setCheckedPrint] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [fatherImage, setFatherImage] = useState(null);
  const [motherImage, setMotherImage] = useState(null);
  const [guardianImage, setGuardianImage] = useState(null);
  const disptch = useDispatch();
  const { Classs } = useSelector((state) => state.Class);
  const { Sections } = useSelector((state) => state.Section);
  const formDataHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useLayoutEffect(() => {
    disptch(AllClassBySchoolStatus(localStorage.getItem("schoolid")));
    disptch(AllSectionBySchoolStatus(localStorage.getItem("schoolid")));
  }, [disptch]);

  useLayoutEffect(() => {
    if (label === "u" && item) {
      setFormData(item);
      setDate(new Date(item.dob));
      setChecked(item.status);
      setCheckedPrint(item.print);
      setSelectedClass(item.class);
      setSelectedSection(item.section);
      setImageData(item.image);
      setFatherImage(item.fatherimage);
      setMotherImage(item.motherimage);
      setGuardianImage(item.guardianimage);
    }
    if (label === "s") {
      setSelectedClass("");
      setSelectedSection("");
      setFormData(formData);
    }
  }, [label, item]);

  useEffect(() => {
    setFormData({
      ...formData,
      image: imageData,
      dob: date,
      status: checked,
      print: checkedPrint,
      section: selectedSection,
      class: selectedClass,
      motherimage: motherImage,
      fatherimage: fatherImage,
      guardianimage: guardianImage,
    });
  }, [
    imageData,
    date,
    checkedPrint,
    checked,
    fatherImage,
    motherImage,
    selectedSection,
    selectedClass,
    guardianImage,
  ]);

  const motherImageHandler = async (e) => {
    try {
      const base64String = await handleImageUpload(e.target.files[0]);
      setMotherImage(base64String);
    } catch (error) {
      console.error("Error handling father image:", error);
    }
  };

  const gaurdianImageHandler = async (e) => {
    try {
      const base64String = await handleImageUpload(e.target.files[0]);
      setGuardianImage(base64String);
    } catch (error) {
      console.error("Error handling father image:", error);
    }
  };

  const fatherImageHandler = async (e) => {
    try {
      const base64String = await handleImageUpload(e.target.files[0]);
      setFatherImage(base64String);
    } catch (error) {
      console.error("Error handling father image:", error);
    }
  };

  const handleImageUpload = (event) => {
    return new Promise((resolve, reject) => {
      const file = event; // Accessing the file from event

      try {
        new Compressor(file, {
          quality: 0.45,
          maxWidth: 500,
          resize: false,
          success: async (result) => {
            const base64String = await blobUrlToBase64(result);
            resolve(base64String);
            // You may set the base64 URL to state or perform other actions here
          },
          error(error) {
            console.error("Error compressing image:", error);
            reject(error);
          },
        });
      } catch (error) {
        console.error("Error compressing image:", error);
        reject(error);
      }
    });
  };

  async function blobUrlToBase64(blob) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  const toast = useRef(null);

  const showErrorToast = (error) => {
    toast.current.show({
      severity: "info",
      summary: "Error Message",
      detail: error,
      life: 3000,
    });
  };

  const onSave = () => {
    disptch(
      createIcard({ ...formData, schoolid: localStorage.getItem("schoolid") })
    ).then((doc) => {
      if (doc.payload?.response?.status !== 302) {
        visbile();
      }
      if (doc.payload.response?.data.error) {
        showErrorToast(doc.payload.response?.data.error);
      }
    });
  };

  const onUpdate = () => {
    disptch(
      updateIcard({ ...formData, school: localStorage.getItem("schoolid") })
    ).then(() => {
      visbile();
    });
  };

  const confirm2 = () => {
    confirmDialog({
      message: "Are you sure you want to update ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      acceptClassName: "ml-3 bg-cyan-500 px-4 py-3 text-white",
      rejectClassName: "px-4 py-3",
      accept: onUpdate,
    });
  };

  const [image, setImage] = useState("");

  const handleOnChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function () {
        setImage(reader.result);
        setVisbileModel(true);
      };
    }
  };

  // Callback function when cropping is done
  const onCropDone = async (imgCroppedArea) => {
    // Create a canvas element to crop the image
    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext("2d");

    // Load the selected image
    let imageObj1 = new Image();
    imageObj1.src = image;
    imageObj1.onload = async function () {
      // Draw the cropped portion of the image onto the canvas
      context.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );

      // Convert the canvas content to a data URL (JPEG format)
      const dataURL = canvasEle.toDataURL("image/jpeg");

      const blob = await fetch(dataURL).then((res) => res.blob());

      new Compressor(blob, {
        quality: 0.4,
        maxWidth: 500,
        success(result) {
          const reader = new FileReader();
          reader.readAsDataURL(result);
          reader.onloadend = () => {
            setImageData(reader.result);
            setVisbileModel(false);
          };
        },
        error(err) {
          console.error(err.message);
        },
      });
    };
  };

  return (
    <>
      <ConfirmDialog />
      <ConfirmPopup />
      <Toast ref={toast} />
      {loading && <Loading />}
      <Dialog
        visible={visbiles}
        header="Enter Parents Details"
        onHide={() => setVisbiles(false)}
      >
        <form>
          <div>
            <label htmlFor="fathername" className="capitalize font-medium">
              Upload father Photo
            </label>
            <span className="flex gap-3 items-center">
              {fatherImage && <img src={fatherImage} width={50} height={50} />}
              <input
                type="file"
                id="fathername"
                accept="image/*"
                name="fatherimage"
                onChange={fatherImageHandler}
                className="w-full h-12"
              />
            </span>
          </div>

          <span className="p-float-label mt-8">
            <InputText
              id="mothername"
              name="mothername"
              value={formData?.mothername}
              onChange={formDataHandler}
              className="border border-gray-300 w-full h-12 pl-3"
            />
            <label htmlFor="mothername">Enter Mother Name</label>
          </span>

          <div className="mt-3">
            <label htmlFor="motherimage">Upload Mother Photo </label>
            <span className="flex items-center gap-3">
              {motherImage && <img src={motherImage} width={50} />}
              <input
                type="file"
                id="motherimage"
                name="motherimage"
                accept="image/*"
                onChange={motherImageHandler}
                className="h-12 w-full"
              />
            </span>
          </div>

          <span className="p-float-label mt-8">
            <InputText
              id="guardianname"
              name="guardianname"
              value={formData?.guardianname}
              onChange={formDataHandler}
              className="border border-gray-300 w-full h-12 pl-3"
            />
            <label htmlFor="mothername">Enter Guardian Name</label>
          </span>

          <div className="mt-3">
            <label htmlFor="motherimage">Upload Guardian Photo </label>
            <span className="flex items-center gap-3">
              {guardianImage && <img src={guardianImage} width={50} />}
              <input
                mode="basic"
                type="file"
                id="motherimage"
                name="motherimage"
                accept="image/*"
                onChange={gaurdianImageHandler}
                className="h-12 w-full"
              />
            </span>
          </div>

          <span className="p-float-label mt-8">
            <InputText
              id="trasnport"
              name="transport"
              value={formData?.transport}
              onChange={formDataHandler}
              className="border border-gray-300 w-full h-12 pl-3"
            />
            <label htmlFor="trasnport">Enter Trasnport Mode</label>
          </span>
          <span className="p-float-label mt-8">
            <InputTextarea
              id="remark"
              name="remark"
              value={formData?.remark}
              onChange={formDataHandler}
              rows={5}
              className="border border-gray-300 pl-2 w-full"
              cols={30}
            />
            <label htmlFor="remark">Remark</label>
          </span>
        </form>
      </Dialog>
      <Dialog
        className="w-[95vw] md:w-[450px] h-[95vh] mx-2"
        header={"Adjust Image"}
        visible={visbileModel}
        onHide={() => {
          setVisbileModel(false);
          setImage("");
        }}
      >
        <ImageCropper image={image} onCropDone={onCropDone} />
      </Dialog>
      <div className="bg-white">
        <form className="flex flex-col items-center">
          <Button
            type="button"
            onClick={() => setVisbiles(true)}
            label={<BiMenu />}
            className="absolute right-14 p-3 border border-gray-500"
          />
          <div className="relative w-28 my-3">
            <img
              className="border w-[250px]"
              src={imageData || No_Image}
              alt="student"
            />
            <input type="file" hidden id="inpfile" onChange={handleOnChange} />
            <label
              htmlFor="inpfile"
              className=" border-gray-500 border-2 rounded-full w-10 h-10 flex justify-center items-center font-bold absolute -bottom-2 -right-3 bg-blue-500"
            >
              <BiCamera color="#fff" size={30} />
            </label>
          </div>
          <div className="w-full  flex items-center my-1">
            <label
              htmlFor="number-input"
              className="font-semibold w-28 text-start"
            >
              Adm. No.:
            </label>
            <InputText
              id="number-input"
              name="admission_id"
              value={formData.admission_id}
              onChange={formDataHandler}
              placeholder="Enter Admission Number"
              inputClassName="pl-2"
              useGrouping={false}
              className="pl-2 border-gray-300 border mx-3 w-full rounded-md h-12"
            />
          </div>
          <div className="w-full  flex items-center my-1">
            <label className="font-semibold w-28 text-start">Roll No.:</label>
            <InputText
              type="tel"
              name="rollno"
              value={formData.rollno}
              onChange={formDataHandler}
              useGrouping={false}
              placeholder="Enter Roll Number"
              inputClassName="pl-2"
              className="pl-2 border-gray-300 border h-12 mx-3 w-full rounded-md"
            />
          </div>
          <div className="w-full flex items-center my-1">
            <label className="font-semibold w-28 text-start">
              Name:<strong className="text-red-500">*</strong>
            </label>
            <InputText
              type="text"
              placeholder="Enter student name"
              name="name"
              disabled={disble}
              required
              value={formData.name}
              onChange={formDataHandler}
              className="border-gray-300 border mx-3 py-2 px-2 h-12 w-full rounded-md"
            />
          </div>
          <div className="w-full flex items-center my-1">
            <label className="font-semibold w-28 text-start">
              Class:<strong className="text-red-500">*</strong>
            </label>
            <Dropdown
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.value)}
              options={Classs}
              optionLabel="class"
              disabled={disble}
              optionValue="class"
              placeholder="Select Class"
              className="capitalize border-gray-300 border mx-3 h-12 w-full rounded-md"
            />
          </div>
          <div className="w-full flex items-center my-1">
            <label className="font-semibold w-28 text-start">
              Section:<strong className="text-red-500">*</strong>
            </label>
            <Dropdown
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.value)}
              options={Sections}
              optionLabel="section"
              disabled={disble}
              optionValue="section"
              placeholder="Select Section"
              className=" capitalize border-gray-300 border mx-3 h-12 w-full rounded-md"
            />
          </div>

          <div className="w-full flex items-center my-1">
            <label className="font-semibold w-24 mr-2 text-start">
              DOB:<strong className="text-red-500">*</strong>
            </label>{" "}
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value)}
              dateFormat="dd/mm/yy"
              showIcon
              disabled={disble}
              placeholder="Enter date of birth"
              inputClassName="pl-3"
              className="border-gray-300 border mx-3 h-12 w-full rounded-md"
            />
          </div>
          <div className="w-full flex items-center my-1">
            <label className="font-semibold w-28 text-start">F. Name:</label>
            <InputText
              type="text"
              required
              name="father_name"
              value={formData.father_name}
              onChange={formDataHandler}
              disabled={disble}
              placeholder="Enter Father Name"
              className="border-gray-300 border mx-3 py-2 px-2 h-12 w-full rounded-md"
            />
          </div>
          <div className="w-full flex items-center my-1">
            <label className="font-semibold w-28 text-start">
              Contact:<strong className="text-red-500">*</strong>
            </label>{" "}
            <InputNumber
              type="tel"
              name="mobile"
              value={formData.mobile}
              onValueChange={formDataHandler}
              disabled={disble}
              placeholder="Enter Contact Number"
              inputClassName="pl-2"
              useGrouping={false}
              className="border-gray-300 border mx-3 h-12 w-full rounded-md"
            />
          </div>

          <div className="w-full flex items-center my-1">
            <label className="font-semibold w-28 text-start">Address:</label>{" "}
            <InputText
              type="text"
              name="address"
              required
              disabled={disble}
              value={formData.address}
              onChange={formDataHandler}
              placeholder="Enter Address"
              className="border-gray-300 border mx-3 py-2 px-2 h-12 w-full rounded-md"
            />
          </div>
          <div className="flex">
            <div className="flex items-center my-1 gap-3">
              <Checkbox
                onChange={(e) => setChecked(e.checked)}
                checked={checked}
                className="border-gray-400 border rounded-md"
              ></Checkbox>
              <label htmlFor="checkstatus" className="font-bold w-28">
                Active
              </label>
            </div>
            <div className="flex items-center my-1 gap-3">
              <Checkbox
                onChange={(e) => setCheckedPrint(e.checked)}
                checked={checkedPrint}
                className="border-gray-400 border rounded-md"
              ></Checkbox>
              <label htmlFor="checkstatus" className="font-bold w-28">
                Printed
              </label>
            </div>
          </div>
        </form>
        <div className="flex flex-col justify-center">
          {label === "s" ? (
            <Button
              label="save"
              icon="pi pi-check"
              disabled={
                formData.name &&
                selectedClass &&
                selectedSection &&
                date &&
                formData.mobile
                  ? false
                  : true
              }
              loading={loading}
              onClick={onSave}
              className="flex items-center justify-center gap-2 bg-cyan-500 text-white py-3 px-36 my-2 disabled:bg-cyan-300"
            ></Button>
          ) : (
            <Button
              label="update"
              icon="pi pi-check"
              onClick={confirm2}
              disabled={loading}
              loading={loading}
              className="flex items-center justify-center gap-2 bg-cyan-500 text-white py-3 px-32 my-2"
            ></Button>
          )}
        </div>
      </div>
    </>
  );
}
