import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 100 }, // Ramp up to 100 VUs over 30s
    { duration: "1m", target: 100 }, // Stay at 100 VUs for 1m
    { duration: "30s", target: 1000 }, // Ramp up to 1,000 VUs over 30s
    { duration: "1m", target: 1000 }, // Stay at 1,000 VUs for 1m
    { duration: "30s", target: 5000 }, // Ramp up to 5,000 VUs over 30s
    { duration: "1m30s", target: 5000 }, // Stay at 5,000 VUs for 1m30s
    { duration: "30s", target: 0 }, // Ramp down to 0 VUs over 30s
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests should be below 500ms
    http_req_failed: ["rate<0.01"], // Error rate should be below 1%
    checks: ["rate>0.99"], // 99% of checks should pass
  },
  discardResponseBodies: true,
};

// Main test function
export default function () {
  const baseUrl = "http://localhost:3000";
  const url = `${baseUrl}/api/v1/news`;

  const payload = JSON.stringify({
    id: 1,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status is 200": (r) => r.status === 200,
  });
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
    "summary.json": JSON.stringify(data),
  };
}
