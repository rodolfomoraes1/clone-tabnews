function status(request, response) {
  response.status(200).json({ message: "status working!" });
}

export default status;
