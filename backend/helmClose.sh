#!/bin/bash

# This script uninstalls the KEDA and Prometheus Helm charts.

helm uninstall keda  # Uninstall KEDA Helm chart
helm uninstall prometheus  # Uninstall Prometheus Helm chart

# $PLACEHOLDER$