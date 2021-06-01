const deleteFetch = (url, toStringify, thenFunc) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Cookie': document.cookie,
      },
      body: JSON.stringify(toStringify),
    };
    fetch(url, requestOptions).then((response) => thenFunc(response));
  };
  
  export default deleteFetch;
  