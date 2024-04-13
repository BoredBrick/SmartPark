const formatTime = (seconds) => {
  const padZero = (num) => (num < 10 ? `0${num}` : num);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
  } else if (minutes > 0) {
    return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
  } else {
    return `${remainingSeconds} seconds`;
  }
};

export default formatTime;
