import React, { createRef, useEffect, useRef, useState } from "react";
import "./print.css";
import ReactToPrint from "react-to-print";
import { useLocation } from "react-router-dom";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import { useDispatch } from "react-redux";
import { AllTemplateBySchoolStatus } from "../Redux/Slice/TemplateSlice";

export default function PrintPage() {
  const data = useLocation();
  const [template, setTemplate] = useState("");
  const [temp, setTemp] = useState("");
  const dispatch = useDispatch();
  const refs = useRef([]);
  const refBulk = useRef();

  useEffect(() => {
    dispatch(AllTemplateBySchoolStatus(localStorage.getItem("schoolid"))).then(
      (doc) => {
        setTemp(doc.payload[0]?.tempimage);
        setTemplate(doc.payload[0]?.temp || "");
      }
    );
  }, [dispatch]);

  const renderTemplate = (data) => {
    let modifiedTemplate = template;
    modifiedTemplate = modifiedTemplate.replace("${PuchSheelIcard}", temp);
    modifiedTemplate = modifiedTemplate.replace("${NO_IMAGE}", data?.image);
    modifiedTemplate = modifiedTemplate.replace("${name}", data?.name);
    modifiedTemplate = modifiedTemplate.replace("${class}", data?.class);
    modifiedTemplate = modifiedTemplate.replace(
      "${mothername}",
      data?.mothername
    );
    modifiedTemplate = modifiedTemplate.replace(
      "${admission_id}",
      data?.admission_id
    );
    modifiedTemplate = modifiedTemplate.replace("${rollno}", data?.rollno);
    modifiedTemplate = modifiedTemplate.replace("${remark}", data?.remark);
    modifiedTemplate = modifiedTemplate.replace(
      "${transport}",
      data?.transport || "Self"
    );
    modifiedTemplate = modifiedTemplate.replace(
      "${father_name}",
      data?.father_name
    );
    modifiedTemplate = modifiedTemplate.replace(
      "${dob}",
      moment(data?.dob).format("DD/MM/YYYY")
    );
    modifiedTemplate = modifiedTemplate.replace("${mobile}", data?.mobile);
    modifiedTemplate = modifiedTemplate.replace("${address}", data?.address);
    return modifiedTemplate;
  };

  const cardsPerPage = 10;
  const totalCards = data.state.student.length;
  const totalPages = Math.ceil(totalCards / cardsPerPage);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(0);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page);
  };

  const BulkPrint = () => {
    return (
      <div
        className="A4Page relative"
        style={{ pageBreakAfter: "always" }}
        ref={refBulk}
      >
        <div className="relative grid gap-3 portrait:grid-cols-2 landscape:grid-cols-5 border-2 print:border-none border-black">
          {data.state.student.map((item, index) => (
            <div
              key={index}
              className="my-2"
              dangerouslySetInnerHTML={{ __html: renderTemplate(item) }}
            />
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    BulkPrint();
  }, [data]);

  return (
    <>
      {template == null && temp == null ? (
        <Dialog visible={true} maximized showHeader={false}>
          <div className="flex flex-col justify-center items-center h-full w-full">
            <span className="text-7xl">🫤</span>
            <h1 className="text-4xl">Student Icard Not available</h1>
            <small>
              Please contact your service provider to update icard templete
            </small>
          </div>
        </Dialog>
      ) : (
        ""
      )}
      <div className="flex items-center">
        <ReactToPrint
          trigger={() => (
            <Button className="py-3 px-10 bg-cyan-500 text-white m-5">
              Print
            </Button>
          )}
          content={() => refs.current[page]} // Assuming only one page is printed at a time
        />

        <div className="card">
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalCards}
            onPageChange={onPageChange}
          />
        </div>

        <ReactToPrint
          trigger={() => (
            <Button
              onClick={BulkPrint}
              className="py-3 px-10 bg-cyan-500 text-white m-5"
            >
              Print
            </Button>
          )}
          content={() => refBulk.current} // Assuming only one page is printed at a time
        />
      </div>
      {<BulkPrint />}
      {Array.from({ length: totalPages }, (_, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {/* <span className="page-number border border-black h-10 w-15 rounded-full">{pageIndex + 1}</span> */}
          <div
            className="A4Page relative"
            style={{ pageBreakAfter: "always" }}
            ref={(el) => (refs.current[pageIndex] = el)}
          >
            <div className="relative grid gap-3 portrait:grid-cols-2 landscape:grid-cols-5 border-2 print:border-none border-black">
              {data.state.student
                .slice(pageIndex * cardsPerPage, (pageIndex + 1) * cardsPerPage)
                .map((item, index) => (
                  <div
                    key={index}
                    dangerouslySetInnerHTML={{ __html: renderTemplate(item) }}
                  />
                ))}
            </div>
            <span className="page-number">{pageIndex + 1}</span>
          </div>
          {pageIndex !== totalPages - 1 && <div className="page-break"></div>}
        </React.Fragment>
      ))}
    </>
  );
}
