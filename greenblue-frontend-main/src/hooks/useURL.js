const useURL = () => {
  // const baseUrl = "https://api.greenbluefoundation.org";
  // const baseUrl = "http://localhost:4000";
  const baseUrl = "https://green-blue.onrender.com"
  // const baseWss = "wss://api.greenbluefoundation.org";
  // const baseWss = "wss://localhost:4000";

  const baseWss = "wsss://green-blue.onrender.com"

  return {
    baseUrl,
    baseWss,
  };
};
export default useURL;
