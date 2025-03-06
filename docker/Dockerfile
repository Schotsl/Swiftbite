FROM python:3.9-slim

RUN apt-get update && \
  apt-get install -y \
  imagemagick \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt
RUN python load.py

EXPOSE 3000

CMD ["uvicorn", "index:app", "--host", "0.0.0.0", "--port", "3000"]