import "./App.css";
import "react-image-crop/dist/ReactCrop.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import Home from "./Components/Home";
import ICard from "./Components/ICard";
import PrintPage from "./Components/PrintPage";
import BulkExcelUploadForm from "./Components/BulkExcelUploadForm";
import ImageCropper from "./Components/ImageCropper";
import Admin from "./Components/Admin/AdminHome";
import AdminLogin from "./Components/Admin/LoginPage";
import Class from "./Components/Admin/School/Class";
import Section from "./Components/Admin/School/Section";
import Students from "./Components/Admin/School/Students";
import Teacher from "./Components/Admin/School/Teacher";
import PartyHome from "./Components/Party/PartyHome";
import PartyLogin from "./Components/Party/LoginPage";
import PartyICard from "./Components/Party/ICard";
import ImageCropTest from "./Components/ImageCropTest";
import PrintedICards from "./Components/Admin/School/PrindedIcards";
import DeActiveWithoutImage from "./Components/Admin/School/DeActiveWithoutImage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<ImageCropTest />} />
        <Route path="/crop" element={<ImageCropper />} />
        <Route path="/print" element={<PrintPage />} />
        <Route path="/icard" element={<ICard />} />
        <Route path="/bulk" element={<BulkExcelUploadForm />} />
        <Route path="/adminlogin" element={<AdminLogin />} />

        <Route path="/admin" element={<Admin />}>
          <Route path="class" element={<Class />} />
          <Route path="section" element={<Section />} />
          <Route path="teacher" element={<Teacher />} />
          <Route path="student" element={<Students />} />
          <Route path="printed" element={<PrintedICards />} />
          <Route path="deactivewithoutimage" element={<DeActiveWithoutImage />} />
        </Route>

        <Route path="/thirdpartylogin" element={<PartyLogin />} />
        <Route path="/thirdparty/icard" element={<PartyICard />} />
        <Route path="/thirdparty" element={<PartyHome />}></Route>
      </Routes>
    </>
  );
}

export default App;
