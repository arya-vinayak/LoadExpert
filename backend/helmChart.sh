#!/bin/zsh

helm install keda kedacore/keda

helm install prometheus bitnami/kube-prometheus --set kubeEtcd.enabled=false 
set kubeScheduler.enabled=false \
  --set kubeControllerManager.enabled=false \
  --set kubeProxy.enabled=false \
  --set kubeStateMetrics.enabled=false \
  --set nodeExporter.enabled=false \
  --set prometheusOperator.enabled=true \
  --set alertmanager.enabled=false \
  --set grafana.enabled=false