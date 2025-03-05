FROM oven/bun:latest

ENV TZ=Europe/London

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update && apt-get install -y \
  python3 \
  python3-pip \
  imagemagick \
  && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir backgroundremover

WORKDIR /app

COPY . /app

EXPOSE 3000

RUN bun install

CMD ["bun", "run", "index.ts"]
