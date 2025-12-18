export const getTime = (date: string) => {
  const timeStamp = new Date(date);
  const timeInSeconds = Math.floor(timeStamp.getTime() / 1000);
  return timeInSeconds;
};

export const getFormatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(minutes)}:${pad(remainingSeconds)}`;
};
