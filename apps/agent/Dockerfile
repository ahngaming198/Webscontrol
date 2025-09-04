FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest

# Install required packages
RUN apk --no-cache add ca-certificates nginx openssl

# Create necessary directories
RUN mkdir -p /certs /var/backups /etc/nginx/sites-available /etc/nginx/sites-enabled

# Copy the binary
COPY --from=builder /app/main /app/main
COPY --from=builder /app/config.yaml /app/config.yaml

# Set permissions
RUN chmod +x /app/main

# Expose ports
EXPOSE 50051 8080

# Start the application
CMD ["/app/main"]
