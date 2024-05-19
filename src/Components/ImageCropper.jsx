import { useEffect, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import Compressor from "compressorjs";
import setCanvasPreview from "./setCanvasPreview";

const ASPECT_RATIO = 1 / 1;
const MIN_DIMENSION = 150;
const ImageCropper = ({ closeModal, updateAvatar, file }) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState({
    unit: "%",
    y: 25,
    x: 25,
    width: 150,
    height: 150,
  });


  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgSrc(reader.result || "");
    });
    reader.readAsDataURL(file);
  }, [file]);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    setCrop(crop);
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const updateAvatarWithCrop = debounce((croppedImage) => {
    updateAvatar(croppedImage);
    closeModal();
  }, 300);

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
    setCanvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      convertToPixelCrop(newCrop, imgRef.current.width, imgRef.current.height)
    );
  };

  const handleCropComplete = async () => {
    if (!imgRef.current || !crop.width || !crop.height) {
      return;
    }
    const dataUrl = previewCanvasRef.current.toDataURL();
    const blob = await fetch(dataUrl).then((res) => res.blob());
    
    new Compressor(blob, {
      quality: 0.4,
      maxWidth: 500,
      success(result) {
        const reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onloadend = () => {
          updateAvatarWithCrop(reader.result);
        };
      },
      error(err) {
        console.error(err.message);
      },
    });

  };

  function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  async function blobUrlToBase64(blobUrl) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  return (
    <>
    

      {imgSrc && (
        <div className="flex flex-col items-center">
          <button
            className="mb-3 w-full text-white font-mono text-xs py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-600"
            onClick={handleCropComplete}
          >
            Crop Image
          </button>
          <ReactCrop
      
            crop={crop}
            onChange={handleCropChange}
            onImageLoaded={onImageLoad}
            keepSelection
            minWidth={MIN_DIMENSION}
            minHeight={MIN_DIMENSION}
            ruleOfThirds
            aspect={ASPECT_RATIO}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Upload"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
         
        </div>
      )}

      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}
    </>
  );
};
export default ImageCropper;
