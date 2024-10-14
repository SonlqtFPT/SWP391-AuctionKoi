/* eslint-disable react/prop-types */
function Information({ gender, size, age, breeder }) {
  const formatGender = (gender) => {
    switch (gender) {
      case "MALE":
        return "Male";
      case "FEMALE":
        return "Female";
      case "UNKNOWN":
        return "Unknown";
    }
  };

  return (
    <div className="ml-[30px] mt-[20px] h-[200px] w-[800px] bg-gray-900 hover:bg-gray-800 rounded-2xl border-2 hover:border-4 border-[#bcab6f] outline outline-offset-2 outline-white">
      <h1 className="font-bold text-3xl pt-3 pl-3 text-[#bcab6f]">Kohaku #2</h1>
      <div className="flex items-center justify-between gap-3 mt-7">
        <div className="bg-slate-500 h-[40px] w-[550px] rounded-[50px] flex items-center justify-between pl-7 ml-3 ">
          <div className="text-xl font-bold">Gender</div>
          <div className="text-xl font-bold mr-8">{formatGender(gender)}</div>
        </div>
        <div className="bg-slate-500 h-[40px] w-[550px] rounded-[50px] flex items-center justify-between pl-7 mr-3">
          <h1 className="text-xl font-bold">Size</h1>
          <h1 className="text-xl font-bold mr-8">{size} cm</h1>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="bg-slate-500 h-[40px] w-[550px] mt-5 rounded-[50px] flex items-center justify-between pl-7 ml-3">
          <h1 className="text-xl font-bold">Breeder</h1>
          <h1 className="text-xl font-bold mr-8">{breeder}</h1>
        </div>
        <div className="bg-slate-500 h-[40px] w-[550px] mt-5 rounded-[50px] flex items-center justify-between pl-7 mr-3">
          <h1 className="text-xl font-bold">Age</h1>
          <h1 className="text-xl font-bold mr-8">{age} year</h1>
        </div>
      </div>
    </div>
  );
}

export default Information;
