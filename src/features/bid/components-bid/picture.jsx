/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

function Picture({ img }) {
  const [picture, setPicture] = useState("");

  useEffect(() => {
    setPicture(img);
  }, [img]);
  return (
    <div className="ml-[200px] mt-[20px]">
      <img
        src={picture}
        width={900}
        height={970}
        className="rounded-3xl"
        alt="Koi Fish"
      />
    </div>
  );
}

export default Picture;
