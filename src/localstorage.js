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
  const user = getUser();
  user.room = roomName;
  setUser(user);
};

const unsetRoom = () => {
  const user = getUser();
  user.room = undefined;
  setUser(user);
};

const unsetUser = () => {
  localStorage.removeItem("user");
};

export default { setUser, getUser, setRoom, unsetRoom, unsetUser };
