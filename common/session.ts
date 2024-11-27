const StoreInSession = (key: string, value: any) => {
   sessionStorage.setItem(key, value);
  return;
};

const lookInSession = (key: string) => {
  return sessionStorage.getItem(key);
};

const removeFromSession = (key: string) => {
  return sessionStorage.removeItem(key);
};

const logOutUser = () => {
  return sessionStorage.clear();
};

export { StoreInSession, lookInSession, removeFromSession, logOutUser };
