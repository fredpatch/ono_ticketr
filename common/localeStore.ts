const StoreInLocal = (key: string, value: any) => {
  return localStorage.setItem(key, value);
};

const lookInLocal = (key: string) => {
  return localStorage.getItem(key);
};

const removeFromLocal = (key: string) => {
  return localStorage.removeItem(key);
};

const logOutUser = () => {
  return localStorage.clear();
};

export { StoreInLocal, lookInLocal, removeFromLocal, logOutUser };
