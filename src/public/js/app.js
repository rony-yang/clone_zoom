// nodemon.json에서 ignore 설정을 통해 현재 파일(프론트엔드 부분)이 수정되더라도 서버는 재시작되지 않음

// 고유한 아이디 생성
const userId = Date.now();

const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");
const socket = new WebSocket(`ws://${window.location.host}`); // 서버와 연결 시도

// JSON 객체를 받아서 string으로 반환
function makeMessage(type, payload) {
  const msg = {type, payload, userId};
  return JSON.stringify(msg);
};

// 서버 연결 성공 시
socket.addEventListener("open", () => {
  console.log("서버에 연결되었습니다.");
});

// 메세지 받기
socket.addEventListener("message", (message) => {
  let receivedMessage = JSON.parse(message.data);
  
  // 메세지를 받으면 ul안의 li안에 내용을 넣어서 화면에 표시
  const li = document.createElement("li");
  li.innerText = receivedMessage.payload;
  li.style.listStyleType = "none" // li의 기본 목록 스타일(불릿)을 없앰

  // const getUserId = JSON.parse(makeMessage(message.data.userId));

  // 받은 메시지가 내 메시지인지 확인 후 ul에 추가
  if (receivedMessage.userId === userId) {
    console.log("내가 보낸 메세지");
    li.style.backgroundColor = "lightyellow";
    li.style.textAlign = "right";
    messageList.append(li); // 내가 보낸 메시지
  } else {
    console.log("받은 메세지");
    li.style.backgroundColor = "#e0f7ff";
    li.style.textAlign = "left";
    messageList.append(li); // 다른 사용자가 보낸 메시지
  }
});

// 서버 연결 종료 시
socket.addEventListener("close", () => {
  console.log("서버 연결이 해제되었습니다.");
});

// setTimeout(() => {
//   socket.send("이 메세지는 10초 뒤에 실행됩니다.");
// }, 10000); // 10초

// 메세지 입력 후 send 버튼 입력 시
function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value)); // 프론트에서 백으로 전송
  // const li = document.createElement("li");
  // li.innerText = `You : ${input.value}`;
  // messageList.append(li);
  input.value = "";
};

// 닉네임 입력 후 save 버튼 입력 시
function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value)); // text 대신 JSON object 전체를 전송
};

messageForm.addEventListener("submit", handleSubmit); // 메세지 입력 후 send 버튼 입력 시
nickForm.addEventListener("submit", handleNickSubmit); // 닉네임 입력 후 save 버튼 입력 시