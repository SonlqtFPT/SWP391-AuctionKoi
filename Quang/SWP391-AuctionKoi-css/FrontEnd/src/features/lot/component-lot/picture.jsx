import { useEffect, useState } from "react";

function Picture({ img }) {
  const [pic, setPic] = useState("");

  useEffect(() => {
    setPic(img);
    console.log("Đây là ảnh: ", img);
  }, [img]);
  return (
    <div className="w-96">
      <img
        className="rounded-tl-[50px] rounded-tr-[50px] h-[400px] w-[300px]"
        src={pic}
        alt="Đây là ảnh á"
      />
    </div>
  );
}

export default Picture;
