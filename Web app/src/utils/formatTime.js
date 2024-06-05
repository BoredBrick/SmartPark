const formatTime = (seconds) => {
  const padZero = (num) => (num < 10 ? `0${num}` : num);

  const days = Math.floor(seconds / 86400); // Number of seconds in a day
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (days > 0) {
    return `${days} days, ${padZero(hours)}:${padZero(minutes)}:${padZero(
      remainingSeconds
    )}`;
  } else if (hours > 0) {
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
  } else if (minutes > 0) {
    return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
  } else {
    return `${remainingSeconds} seconds`;
  }
};

export default formatTime;
