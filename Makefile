.PHONY: server
.PHONY: client

db:
	cd run && \
	start /B java -Djava.library.path=.\dynamodb_local_latest\DynamoDBLocal_lib \
		-jar .\dynamodb_local_latest\DynamoDBLocal.jar \
		-sharedDb -dbPath . && \
	timeout 2 && \
	aws dynamodb list-tables --endpoint-url http://localhost:8000

server:
	cd server && \
	npm run seed && \
	npm run dev

client:
	cd client && \
	npm run dev