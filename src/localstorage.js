const setUser = user => {
  localStorage.setItem("user", JSON.stringify(user));
};

const getUser = () => {
  const userString = localStorage.getItem("user");
  if (!userString) return false;
  const user = JSON.parse(userString);
  return user;
};

const setRoom = roomName => {
  console.log("set room", roomName);
  const user = getUser();
  user.room = roomName;
  setUser(user);
};

export default { setUser, getUser, setRoom };
