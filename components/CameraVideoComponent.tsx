import Webcam from "react-webcam";
import ModalContainer from "@/components/Modal";


const CameraVideoComponent=()=> {

    const videoConstraints = {
        aspectRatio: 0.6666666667,
          facingMode: "user",
          width: { min: 480 },
          height: { min: 720 },
         };
         
  return (
    <div className="App">
      <Webcam width={480} height={720} videoConstraints={videoConstraints} audio={true} />
    </div>
  );
}
export default CameraVideoComponent
