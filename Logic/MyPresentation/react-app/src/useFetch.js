import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: document.cookie,
      },
    };
    const abortCont = new AbortController();
    fetch(url, requestOptions, { signal: abortCont.signal })
      .then((res) => {
        if (!res.ok) {
          console.log("Fetch FAILURE!");
          throw Error("Fetching failed!");
        }
        return res.json();
      })
      .then((data) => {
        // console.group(data);
        setData(data);
        setIsPending(false);
        setError(null);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setIsPending(false);
          setError(err.message);
        }
      });
    return () => abortCont.abort;
  }, [url]);

  return { data, isPending, storeError: error };
};
export default useFetch;
