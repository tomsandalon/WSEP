const postFetch = (url, toStringify, thenFunc) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Cookie': document.cookie,
    },
    body: JSON.stringify(toStringify),
  };
  fetch(url, requestOptions).then((response) => thenFunc(response));
};

export default postFetch;
