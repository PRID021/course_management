.PHONY: db server client

db:
	cd run && \
	java -Djava.library.path=.\dynamodb_local_latest\DynamoDBLocal_lib \
		-jar .\dynamodb_local_latest\DynamoDBLocal.jar \
		-sharedDb -dbPath . && \
	aws dynamodb list-tables --endpoint-url http://localhost:8000

server:
	cd server && \
	npm run seed && \
	npm run dev

client:
	cd client && \
	npm run dev


start:
	$(MAKE) db && \
	start cmd /C "cd server && npm run seed && npm run dev"
	$(MAKE) client