curl -s -X PUT 'http://localhost:8043/v1/projects/liquiz/subscriptions/tasks-questions-sub' \
    -H 'Content-Type: application/json' \
    --data '{"topic":"projects/liquiz/topics/tasks-local","pushConfig":{"pushEndpoint":"http://localhost:3000/api/tasks?token=__LOCAL_PUBSUB_VERIFICATION_TOKEN__"}, "ackDeadlineSeconds": 600}' &&
curl -s -X PUT 'http://localhost:8043/v1/projects/liquiz/subscriptions/tasks-summary-sub' \
    -H 'Content-Type: application/json' \
    --data '{"topic":"projects/liquiz/topics/history-summary-local","pushConfig":{"pushEndpoint":"http://localhost:3000/api/tasks/summary?token=__LOCAL_PUBSUB_VERIFICATION_TOKEN__"}, "ackDeadlineSeconds": 600}'