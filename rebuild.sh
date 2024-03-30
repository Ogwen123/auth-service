sudo docker build --no-cache --progress=plain -t ghcr.io/ogwen123/auth-service . &> build.log
sleep 2
sudo docker push ghcr.io/ogwen123/auth-service:latest
sleep 2
sudo docker compose down -v
sleep 2
sudo docker compose up --pull always -d
