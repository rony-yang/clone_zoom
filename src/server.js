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

wss.on("connection", (socket) => {
  console.log("브라우저에 연결되었습니다.");
  socket.on("close", () => { // 인터넷 창이 꺼졌을때
    console.log("브라우저 연결이 해제되었습니다.");
  });
  socket.on("message", (message) => {
    console.log(message.toString()); // WebSocket에서 전송한 메세지를 제대로 인코딩하지 않으면 buffer 형식으로 표시 -> 문자열로 변환 필요
  });
  socket.send("hello!");
});

server.listen(3000, handleListen); // server 객체를 사용하여 http와 webSocket 모두 같은 포트에서 연결할 수 있도록 함