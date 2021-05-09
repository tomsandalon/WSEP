import { useState, useEffect } from "react";

const usePost = (url, toStringify, thenFunc) => {
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: document.cookie,
      body: JSON.stringify(toStringify),
    },
  };

  useEffect(() => {
    const abortCont = new AbortController();

    fetch(url, requestOptions, { signal: abortCont.signal })
      .then((res) => {
        if (!res.ok) {
          throw Error("Fetching failed!");
        }
        return res.json();
      })
      .then(() => {
        thenFunc();
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

  return { isPending, error };
};
export default usePost;
