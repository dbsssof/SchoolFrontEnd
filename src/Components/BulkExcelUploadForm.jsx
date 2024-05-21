import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import {
  insertManyIcards
} from "../Redux/Slice/IcardSlice";
import { BiCheck, BiClipboard, BiUpload } from "react-icons/bi";
import { Ripple } from "primereact/ripple";
import Loading from "./Loading";

export default function BulkExcelUploadForm({ }) {
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const { loading } = useSelector((state) => state.Icard);
  const dispatch = useDispatch();

  const tableData = [
    [
      "admission_id",
      "name",
      "father_name",
      "class",
      "mobile",
      "address",
      "dob",
      "schoolid",
      "status",
      "section",
      "rollno",
      "remark",
      "transport",
      "mothername",
    ],
    ["", "", "", "", "", "", "", localStorage.getItem("schoolid"), "", ""],
  ];

  const convertExcelDate = (serial) => {
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const epoch = new Date(1899, 11, 30);
    const daysSinceEpoch = serial - 1;
    const offset = daysSinceEpoch * millisecondsInDay;
    const date = new Date(epoch.getTime() + offset);
    return date.toISOString().slice(0, 10);
  };

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const formattedData = [];
      const allErrors = [];

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, {
          raw: false,
          defval: null,
        });

        const requiredColumns = [
          "admission_id",
          "name",
          "father_name",
          "class",
          "mobile",
          "address",
          "dob",
          "schoolid",
          "status",
          "section",
          "rollno",
          "remark",
          "transport",
          "mothername",
        ];
        const sheetErrors = validateSheet(parsedData, requiredColumns);

        if (sheetErrors.length > 0) {
          allErrors.push({ sheetName, errors: sheetErrors });
        } else {
          const formattedSheetData = parsedData.map((row) => {
            const formattedRow = {};
            for (const key in row) {
              if (row.hasOwnProperty(key)) {
                const value = row[key];
                formattedRow[key] =
                  typeof value === "number" ? convertExcelDate(value) : value;
              }
            }
            return formattedRow;
          });

          formattedData.push({ sheetName, data: formattedSheetData });
        }
      });

      if (allErrors.length > 0) {
        setErrors(allErrors);
      } else {
        setErrors([]);
        setData(formattedData);
      }
    };
  };

  const validateSheet = (data, requiredColumns) => {
    const errors = [];

    data.forEach((row, rowIndex) => {
      requiredColumns.forEach((column) => {
        if (
          row.hasOwnProperty(column) &&
          (row[column] === null || row[column] === "")
        ) {
          errors.push(`Line ${rowIndex + 2}: empty column '${column}'`);
        }
      });

      // Add more validation checks as needed
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          const value = row[key];
          if (typeof value === "string" && value.trim() === "") {
            errors.push(
              `Row ${rowIndex + 1}: Column '${key}' contains an empty string`
            );
          }
          // Additional checks can be added here
        }
      }
    });

    return errors;
  };

  const copyToClipboard = () => {
    const tsvData = tableData.map((row) => row.join("\t")).join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      setCopied(true);
      navigator.clipboard
        .writeText(tsvData)
        .then(() => {
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error);
        });
    } else {
      console.error(
        "Clipboard API not supported or writeText method not available"
      );
    }
  };

  const onSubmit = () => {
    dispatch(insertManyIcards(data));
  };

  return (
    <>
      {loading && <Loading />}
      <div className="flex items-center justify-center gap-3 bg-gray-50 mt-5 py-3 px-2 border-gray-300 border rounded-md w-full">
        <small className="font-bold capitalize">
          Copy excel Table and paste in Excel Sheet
        </small>
        {copied ? (
          <div className="border-gray-300 border w-10 h-10 rounded-full flex justify-center items-center p-ripple">
            <BiCheck size={18} />
          </div>
        ) : (
          <button
            onClick={copyToClipboard}
            className="border-gray-300 border w-10 h-10 rounded-full flex justify-center items-center p-ripple"
          >
            <BiClipboard />
            <Ripple />
          </button>
        )}
      </div>
      <div className="grid gap-3 my-2">
        <div className="flex flex-col mt-3">
          <input
            type="file"
            id="username-help"
            accept=".xlsx, .xls"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="username-help"
            className="flex items-center justify-center gap-3 text-md font-semibold text-white bg-cyan-500 py-3 rounded-lg p-ripple"
          >
            <BiUpload size={25} /> Upload
            <Ripple />
          </label>
          <small id="username-help" className="flex py-1">
            <span>
              Please Upload Excel Sheet For Bulk Upload
              <strong className="text-red-500"> Student only</strong>
            </span>
          </small>
        </div>
        <button
          type="button"
          disabled={data.length > 0 ? false : true}
          onClick={onSubmit}
          className="bg-blue-500 disabled:bg-blue-300 px-3 py-3 rounded-lg p-ripple text-white font-semibold"
        >
          Submit
          <Ripple />
        </button>
      </div>
      {errors.length > 0 && (
        <div className="mt-3">
          <h3 className="text-red-500">Errors found:</h3>
          {errors.map((errorGroup, index) => (
            <div key={index} className="mt-2">
              <strong>Sheet: {errorGroup.sheetName}</strong>
              <ul className="text-red-500">
                {errorGroup.errors.map((error, errorIndex) => (
                  <li key={errorIndex}>{error}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
