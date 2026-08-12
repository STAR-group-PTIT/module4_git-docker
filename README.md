# Group: STARS - KADA PROGRAM PTITHCM
Team members:
Nguyễn Thanh Tâm - 
Phạm Thanh Nhựt Trọng - 
Nguyễn Võ Phi Long - 
Nguyễn Ngọc Hoàng - 
Nguyễn Thanh Cường - 

# module4_git-docker

NestJS + PostgreSQL + Redis chạy bằng Podman (podman-compose).

## Stack

| Service  | Image               | Port (host) | Container port |
| -------- | ------------------- | ----------- | -------------- |
| API      | build từ Dockerfile | 3100        | 3000           |
| Postgres | postgres:16-alpine  | 5433        | 5432           |
| Redis    | redis:7-alpine      | 6380        | 6379           |

> Port 5432/6379/3000 đang được project khác dùng trên host, nên các service
> được map sang port 5433/6380/3100.

## Yêu cầu

- Podman 5.x + podman-compose
- (Tùy chọn) Node 22 để chạy app trực tiếp trên host

## Chạy

```bash
cp .env.example .env   # điều chỉnh nếu cần
podman-compose up -d --build
curl http://localhost:3100/health
```

Kết quả mong đợi:

```json
{"status":"ok","info":{"database":{"status":"up"},"redis":{"status":"up","reply":"PONG"}}}
```

## Lệnh thường dùng

```bash
podman-compose up -d            # khởi động các service
podman-compose down             # dừng + xóa container (giữ volume)
podman-compose down -v          # dừng + xóa cả volume dữ liệu
podman-compose logs -f api      # xem log
podman-compose ps               # trạng thái container
```

## Chạy app trên host (dev)

```bash
npm install
npm run start:dev               # kết nối tới postgres:5433, redis:6380 qua .env
npm run build && npm run start:prod
```

## Cấu trúc

- `src/app.module.ts` — TypeORM (Postgres) + Redis module, cấu hình từ `.env`
- `src/health/` — endpoint `GET /health` kiểm tra kết nối DB + Redis (NestJS Terminus)
- `src/redis/` — global module cung cấp ioredis client
- `Dockerfile` — multi-stage: `npm ci` → `nest build` → chỉ chạy `dist/` với prod dependencies
- `compose.yaml` — postgres + redis (có healthcheck) + api (`depends_on` chờ health)

## Lưu ý

- `synchronize: true` đang bật cho mục đích học tập — không dùng cho production (nên dùng migration).
- `.env` không commit lên git; xem `.env.example` làm mẫu.
