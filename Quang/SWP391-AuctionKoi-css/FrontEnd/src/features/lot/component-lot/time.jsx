/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";

function Time({ remainingTime }) {
  // Hàm để chuyển đổi thời gian còn lại thành định dạng giờ:phút:giây
  const formatTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / 1000 / 60 / 60) % 24);
    const days = Math.floor(time / 1000 / 60 / 60 / 24);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="ml-[200px] pt-[80px]">
      <h1 className="font-bold text-3xl text-white">Auction#63</h1>
      <h2 className="text-2xl text-white">18:30:23</h2>
    </div>
  );
}

Time.propTypes = {
  remainingTime: PropTypes.number.isRequired,
};

export default Time;
