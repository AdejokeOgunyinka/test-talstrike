import Webcam from "react-webcam";
import React, { useState, useRef, useCallback } from "react";
import ModalContainer from "@/components/Modal";

const CameraImageComponent=()=> {
  const webcamRef = useRef(null);
  const [img, setImg] = useState(null);

const capture = useCallback(() => {
    const cam = webcamRef.current as unknown as Webcam
    const imageSrc:any = cam.getScreenshot();
    setImg(imageSrc);
  }, [webcamRef]);

  const videoConstraints = {
    width: 390,
    height: 390,
    facingMode: "user",
  };

  return (
  
        <ModalContainer>
              <div className="vidContainer">
                {img === null ? (
                    <>
                    <Webcam
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        audio={false}
                        height={500}
                        width={500}
                        ref={webcamRef}
                        mirrored={true}
                    />
                    <button onClick={capture} className="vidButton">Capture photo</button>
                    </>
                ) : (
                    <>
                    <img src={img} alt="screenshot" className="vidImg" />
                    <button onClick={() => setImg(null)}>Recapture</button>
                    </>
                )}
             </div>
        </ModalContainer>
         
  );
}

export default CameraImageComponent;