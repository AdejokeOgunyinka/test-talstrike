/* eslint-disable @next/next/no-img-element */
import { DashboardVideoLayout } from "@/layout/Dashboard";
import { useRef, useState   } from "react";

import { Flex } from "@chakra-ui/react";
import Webcam from "react-webcam";
import BackArrowIcon from "@/assets/backArrow.svg";
import NextImage from "next/image";
import VideoRecorderIcon from "@/assets/videoRecorder.svg";
import StopLiveStreamIcon from "@/assets/cancelLiveStream.svg";
import GlobeIcon from "@/assets/globe.svg";
import { useTypedSelector } from "@/hooks/hooks";
import { handleOnError } from "@/libs/utils";
import { Select } from '@chakra-ui/react'
import config from "@/libs/config";
import {initLiveStream} from '@cloudinary/js-streaming';




const Index = () => {

  const cloudName = 'dblqvlycm' //config.CLOUDINARY_CLOUD_NAME;
const uploadPreset = 'talstrike-livestream' //config.CLOUDINARY_LIVESTREAM_UPLOAD_PRESET;
const vidRef = useRef(null)
const streamRef = useRef(0);
const [streamTitle, setStreamTitle] = useState("")
const [livestreamStarted, setLiveStreamStarted] = useState(false);
const [liveVideoStreamLibrary, setStreamLibrary] = useState<any>()
let liveStreamLibrary;
 
  const videoConstraints = {
    aspectRatio: 0.6666666667,
      facingMode: "user",
      width: { min: 1280 },
      height: { min: 400 },
     };

  const { userInfo } = useTypedSelector((state) => state.profile);

  const startStreaming =()=>{
     setLiveStreamStarted(true);
    initLiveStream({
      cloudName: cloudName,
      uploadPreset: uploadPreset,
      debug: "all",
      hlsTarget: true,
      fileTarget: true,
      events: {
        start: function (args) {
          // user code
          console.log(args, "...video stream...")
        },
        stop: function (args) {
          // user code
          console.log("Video Stream stopped", "...video stream...")
        },
        error: function(error){
          // user code
        },
        local_stream: function (stream) {
          // user code, typically attaching the stream to a video view:
          const videoStream = vidRef.current as unknown as Webcam
          liveStreamLibrary.attach(videoStream, stream);
        }
      }
     }).then((result) => {
       // keep handle to instance to start/stop streaming 
       console.log(result, "... streaming result...")
       liveStreamLibrary = result;
       
       // Extract public id and url from result (publish the url for people to watch the stream):
       let publicId = result.response.public_id;
       streamRef.current = publicId;
       let url = result.response.secure_url;
       setStreamLibrary(liveStreamLibrary)
       // start the streaming:
       liveStreamLibrary.start(publicId);

     })

  }

 const stopStreaming = ()=>{
  liveVideoStreamLibrary.stop();
  setLiveStreamStarted(false);
 }

 const setVideoStreamTitle = (e)=>{
  setStreamTitle(e.target.value);
 }



  return (
    <DashboardVideoLayout>
      <div className="w-full flex flex-col min-h-[100vh] 2xl:min-h-[calc(85vh-60px)] bg-brand-1000 2xl:pt-0 overflow-y-scroll ml-[-180px]">
      <div className="inline-flex  bg-black p-2 min-h-[100px]">
        <div className="p-2 align-middle"><NextImage src={BackArrowIcon} alt="Back arrow" />&nbsp;</div>  
        <div className="overflow-hidden justify-center items-center cursor-pointer p-2">
                  <img
                    src={
                      userInfo?.profile?.user?.image !== null
                        ? userInfo?.profile?.user?.image
                        : "/profileIcon.svg"
                    }
                    alt="me"
                    className="object-cover w-[35px] h-[35px]"
                    style={{
                      borderRadius: "100%",
                      border: "1px solid #D7EAFB",
                    }}
                    onError={handleOnError}
                  />
        </div>  
        <div className="overflow-hidden justify-center items-center cursor-pointer text-white pl-2">
          {
            `${userInfo?.profile?.user?.firstname} ${userInfo?.profile?.user?.lastname}`
          }<br />
          10 hours ago
        </div>  
        <div className="overflow-hidden justify-center items-center cursor-pointer text-white pl-2">
        <Select  className="rounded-xl">
            <option>Public</option>
            <option>Private</option>
        </Select>
        </div>
      </div>
      {livestreamStarted?<button className="bg-red-600 absolute flex justify-center top-[25%] left-[60%] p-2 text-white">LIVE</button>:
      <button className="bg-red-600 absolute flex justify-center top-[30%] left-[25%] p-2 text-white">Ready to go live?</button>}
      {livestreamStarted?<label className="top-[25%] left-[1%]  absolute flex justify-center text-white placeholder:text-white bg-gray-400/0 border-none outline-none h-[30px] text-3xl transition-colors z-50">
        {streamTitle}
      </label>:
      <input type="text" className="top-[50%] left-[20%]  absolute flex justify-center text-white placeholder:text-white bg-gray-400/0 border-none outline-none h-[30px] text-3xl transition-colors z-50" placeholder="Click to add a title..." onChange={setVideoStreamTitle} />}

      {livestreamStarted?<NextImage src={StopLiveStreamIcon} alt="Video Recorder" onClick={stopStreaming} className="top-[75%] left-[25%]  absolute flex justify-center z-50 cursor-pointer" />:<NextImage src={VideoRecorderIcon} alt="Video Recorder" onClick={startStreaming} className="top-[70%] left-[25%]  absolute flex justify-center z-50 cursor-pointer" />}

      <Webcam width={1280} height={400} videoConstraints={videoConstraints} audio={true} ref={vidRef} />
      <div className="flex flex-col bg-black p-2 min-h-[100px]">
         
      </div>
      </div>
    </DashboardVideoLayout>
  );
};

export default Index;
