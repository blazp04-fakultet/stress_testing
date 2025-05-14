import json
import matplotlib.pyplot as plt
import pandas as pd

# Load summary.json
with open('summary.json', 'r') as f:
    data = json.load(f)

# Extract metrics (example: p95 response time)
metrics = data['metrics']
p95_duration = metrics['http_req_duration']['values']['p(95)']
error_rate = metrics['http_req_failed']['values']['rate']
rps = metrics['http_reqs']['values']['rate']

# Create a simple plot
plt.figure(figsize=(10, 6))
plt.plot([100, 1000, 5000], [p95_duration],
         marker='o', label='p95 Response Time (ms)')
plt.plot([100, 1000, 5000], [error_rate * 100],
         marker='x', label='Error Rate (%)')
plt.xlabel('Virtual Users (VUs)')
plt.ylabel('Metrics')
plt.title('k6 Stress Test Results')
plt.legend()
plt.grid(True)
plt.show()
