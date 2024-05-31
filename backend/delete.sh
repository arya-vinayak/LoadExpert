#!/bin/zsh

# Delete Zookeeper stateful set
kubectl delete -f zookeeper-statefulset.yaml

# Delete orchestrator deployment
kubectl delete -f orchestrator-deployment.yaml


# Delete Kafka stateful set
kubectl delete -f kafka-stateful.yaml

#Delete tester deployment
kubectl delete -f tester-deployment.yaml

# Delete scaler object
kubectl delete -f scaler-object.yaml
