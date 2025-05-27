import express from 'express';
import helmet from 'helmet';
import noCache from 'nocache';

const app = express();
const port = 3000;

{ // 보안
  app.use(helmet.hidePoweredBy());
  app.use(helmet.xssFilter());
  app.use(noCache());
}

// '/' 경로로 GET 요청이 왔을 때 실행될 함수를 정의합니다.
app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript (ESM)!');
});


// 설정한 포트(3000번)에서 서버를 시작합니다.
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
  console.log('웹 브라우저에서 이 주소로 접속해 보세요!');
});