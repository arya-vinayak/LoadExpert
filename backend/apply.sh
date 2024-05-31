#!/bin/zsh

# Apply Zookeeper stateful set
kubectl apply -f zookeeper-statefulset.yaml

# Apply Kafka stateful set
kubectl apply -f kafka-stateful.yaml


# Apply orchestrator deployment
kubectl apply -f orchestrator-deployment.yaml

# Apply tester deployment
kubectl apply -f tester-deployment.yaml

# Apply scaler object
kubectl apply -f scaler-object.yaml

