const http = require("http");

const server = http.createServer((req, res) => {
  //console.log(req);

  let body = [];
  req
    .on("data", chunk => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body);
      console.log(body.toString());
    });

  res.statusCode = 200;
  res.setHeader("X-Powerd-By", "NodeJS");
  res.setHeader("Content-Type", "application/json");
  const todos = [
    { id: 1, text: "test 1" },
    { id: 2, text: "test 2" },
    { id: 3, text: "test 3" }
  ];

  //res.write("<h1>Ciao</h1>");
  res.end(
    JSON.stringify({
      success: true,
      data: todos
    })
  );
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
