/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Follow from "../../../components/Follow";

function Picture({ img, lotId, followed, fetchCheckFollow, isLogin }) {
  const [picture, setPicture] = useState("");

  useEffect(() => {
    setPicture(img);
    console.log("Followed? ", followed);
  }, [img]);

  return (
    <div className="border-2 border-[#bcab6f] rounded-2xl outline outline-offset-2 outline-white relative">
      <img
        src={picture}
        height={200}
        width={300}
        className="rounded-2xl"
        alt="Koi Fish"
      />
      <div className="absolute top-2 right-2">
        <Follow
          lotId={lotId}
          followed={followed}
          fetchCheckFollow={fetchCheckFollow}
          isLogin={isLogin}
        />
      </div>
    </div>
  );
}

export default Picture;
