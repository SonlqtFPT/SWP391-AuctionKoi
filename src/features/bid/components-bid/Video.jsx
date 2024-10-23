/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

function Video({ vid }) {
  const [video, setVideo] = useState("");

  useEffect(() => {
    setVideo(vid);
  }, [vid]);
  return (
    <>
      <div className="">
        <video
          controls
          src={video}
          type="video.mp4"
          className="rounded-2xl"
          height="200px"
          width="300px"
        ></video>
      </div>
    </>
  );
}

export default Video;
