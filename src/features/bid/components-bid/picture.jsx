/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Follow from "../../../components/Follow";

function Picture({ img, lotId, followed }) {
  const [picture, setPicture] = useState("");

  useEffect(() => {
    setPicture(img);
  }, [img]);
  return (
    <div className="ml-[200px] border-2 border-[#bcab6f] rounded-2xl outline outline-offset-2 outline-white relative">
      <img
        src={picture}
        width={900}
        height={970}
        className="rounded-2xl"
        alt="Koi Fish"
      />
      <div className="absolute top-2 right-2">
        <Follow lotId={lotId} followed={followed} />
      </div>
    </div>
  );
}

export default Picture;
