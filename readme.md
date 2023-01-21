docker build -t dockerlab2:latest .
docker run -d -p 5005:8080 dockerlab2:latest
http://localhost:5005