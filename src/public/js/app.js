// nodemon.json에서 ignore 설정을 통해 현재 파일(프론트엔드 부분)이 수정되더라도 서버는 재시작되지 않음

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("서버에 연결되었습니다.");
});

socket.addEventListener("message", (message) => {
  console.log("메세지 : ", message.data);
});

socket.addEventListener("close", () => {
  console.log("서버 연결이 해제되었습니다.");
});

setTimeout(() => {
  socket.send("이 메세지는 10초 뒤에 실행됩니다.");
}, 10000); // 10초