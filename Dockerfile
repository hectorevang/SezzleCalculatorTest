# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build Go Backend
FROM golang:1.21-alpine AS backend-builder
WORKDIR /app
COPY backend-go/go.mod ./
# If there were dependencies, we would run: RUN go mod download
COPY backend-go/ .
RUN go build -o main .

# Stage 3: Final Image
FROM alpine:latest
WORKDIR /root/
# Copy the Go binary
COPY --from=backend-builder /app/main .
# Copy the built frontend assets to a 'dist' folder next to the binary
COPY --from=frontend-builder /app/dist ./dist

EXPOSE 8080
CMD ["./main"]
