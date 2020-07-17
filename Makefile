docker_tag := hackmit-playground-frontend

build:
	yarn build
	docker build -t $(docker_tag) .

push: build
	docker tag hackmit-playground-frontend:latest 233868805618.dkr.ecr.us-east-1.amazonaws.com/hackmit-playground-frontend:latest
	docker push 233868805618.dkr.ecr.us-east-1.amazonaws.com/hackmit-playground-frontend:latest
