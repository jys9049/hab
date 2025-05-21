# 1. Node.js 경량 이미지
FROM node:18-alpine

# 2. 작업 디렉토리 생성
WORKDIR /app

# 3. 종속성 설치
COPY package.json package-lock.json* ./
RUN npm install

COPY .env .env

# 4. Next.js 코드 복사
COPY . .

# 5. Next.js 빌드
RUN npm run build

# 6. 포트 열기
EXPOSE 3000

# 7. 앱 실행
CMD ["npm", "start"]