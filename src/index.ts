import express from 'express';
import helmet from 'helmet';
import noCache from 'nocache';
import path from 'path';

import cors from 'cors';
import session from 'express-session';

import connectRedis from 'connect-redis';
import { createClient } from 'redis';

const __dirname = path.resolve();

const app = express();
const env = process.env.NODE_ENV || 'development';
const port = 3000;

{ // 보안
  app.use(helmet.hidePoweredBy());
  app.use(helmet.xssFilter());
  app.use(noCache());
}

app.use(express.urlencoded({ limit: '10mb', extended: false, parameterLimit: 50000 }));
app.use(express.json({ limit: '10mb' }));


let redisClient = createClient()
redisClient.connect().catch(console.error)

// const redisClient = createClient({
//   url: 'redis://localhost:6379', // Redis 서버의 주소와 포트
//   legacyMode: true
// });

// Redis 연결 성공/실패 로깅
redisClient.on('connect', () => console.log('✅ Redis 서버에 성공적으로 연결되었습니다.'));
redisClient.on('error', (err) => console.error('❌ Redis 연결 오류:', err));

// 비동기적으로 Redis 서버에 연결 시도
redisClient.connect().catch(console.error);

// 2. RedisStore 생성 (connect-redis와 express-session 연결)
const RedisStore = connectRedis(session);





app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'fallback_secret_key', // ⭐ 중요! 환경 변수 사용
  resave: false,
  saveUninitialized: false,
  cookie: {
    // secure: true // Render 배포 시 HTTPS이므로 true로 설정
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24시간
  }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));


// '/' 경로로 GET 요청이 왔을 때 실행될 함수를 정의합니다.
app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript (ESM)!');
});


// 설정한 포트(3000번)에서 서버를 시작합니다.
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
  console.log('웹 브라우저에서 이 주소로 접속해 보세요!');
});