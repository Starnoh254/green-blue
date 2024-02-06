const useURL = () => {
  const baseUrl = "https://api.greenbluefoundation.org";
  // const baseUrl = "http://localhost:4000";
  const baseWss = "wss://api.greenbluefoundation.org";
  // const baseWss = "wss://localhost:4000";
  return {
    baseUrl,
    baseWss,
  };
};
export default useURL;
