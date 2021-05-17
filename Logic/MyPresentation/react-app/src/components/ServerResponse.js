const serverResponse = async (response, success, failure401) => {
  switch (response.status) {
    case 200: //welcome
      success();
      break;
    case 400:
      const err_message = await response.text();
      failure401(err_message);
      break;
    case 404:
      return "404";
      break;
    default:
      break;
  }
};
export default serverResponse;
