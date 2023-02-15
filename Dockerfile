FROM golang:1.19 as builder

ENV GIN_MODE=release \
    CGO_ENABLED=0 \
    GOSUMDB=off \
    GOARCH=amd64

RUN go env -w GO111MODULE=on
WORKDIR /app

COPY backend .
RUN go build -o deschool .
RUN mkdir dist && cp deschool dist

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/dist .
# COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/cert

RUN apk add -U tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && apk del tzdata

ENV GIN_MODE=release 
EXPOSE 80

ENTRYPOINT [ "./deschool"]