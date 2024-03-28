git pull origin main

sudo docker build -t ghcr.io/ogwen123/auth-service .
sleep 2
sudo docker push ghcr.io/ogwen123/auth-service:latest
sleep 2
sudo docker compose down -v
sleep 2
sudo docker compose up --pull always -d
