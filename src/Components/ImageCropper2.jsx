import React, { useState } from "react";
import Cropper from "react-easy-crop";

function ImageCropper2({ image, onCropDone, onCropCancel }) {
  // Define state variables
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.5);

  const [croppedArea, setCroppedArea] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1 / 1);

  // Callback when cropping is completed
  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    // Store the cropped area in pixels
    setCroppedArea(croppedAreaPixels);
  };

  // Callback when the user changes the aspect ratio
  const onAspectRatioChange = (event) => {
    setAspectRatio(event.target.value);
  };

  return (
    <div className="cropper">
      <div className="crop-box">
        {/* Image Cropper component */}
        <Cropper
          image={image}
          aspect={aspectRatio}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: {
              width: "100%",
              height: "75%",
              backgroundColor: "#fff",
            },
          }}
        />
      </div>

      <div className="action-btns" style={{ marginTop: "100px" }}>
        {/* Aspect ratio selection */}
        <div className="aspect-ratios" onChange={onAspectRatioChange}>
          <input type="radio" value={1 / 1} name="ratio" /> 1:1
          <input type="radio" value={5 / 5} name="ratio" /> 4:4
        </div>

        {/* Buttons for canceling or applying the crop */}
        <div className="btn-container">
      
          <button
            className="btn"
            onClick={() => {
              onCropDone(croppedArea);
            }}
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper2;
