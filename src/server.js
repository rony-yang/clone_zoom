import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set('view engine', "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/")); // 다른 주소가 입력되어도 홈으로 복귀

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// const handleListen = () => console.log(`Listening on ws://localhost:3000`);

const server = http.createServer(app); // express를 사용하여 http 서버 생성
const wss = new WebSocket.Server({server}); // ws를 사용하여 http 서버 위에 WebSocket 서버 생성. (wss = WebSocket Secure)

const sockets = []; // 서버에 연결된 사람을 확인하기 위해 생성

wss.on("connection", (socket) => {
  sockets.push(socket); // 누군가 연결하면 sockets 배열에 넣어준다
  socket["nickname"] = "익명"; // 닉네임이 없을 경우 익명 으로 표시
  console.log("브라우저에 연결되었습니다.");
  socket.on("close", () => { // 인터넷 창이 꺼졌을때
    console.log("브라우저 연결이 해제되었습니다.");
  });
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      // 받은 내용이 메세지일때
      case "new_message" :
        sockets.forEach(aSocket => aSocket.send(JSON.stringify({
          type: "new_message",
          payload: `${socket.nickname}: ${message.payload}`,
          userId: message.userId // Include userId
        })));
        break;
      // 받은 내용이 닉네임일때
      case "nickname" :
        socket["nickname"] = message.payload; // 받아온 닉네임을 소켓으로 넣어준다
        break;
    }
  });
  //socket.send("hello!");
});

server.listen(3000, handleListen); // server 객체를 사용하여 http와 webSocket 모두 같은 포트에서 연결할 수 있도록 함