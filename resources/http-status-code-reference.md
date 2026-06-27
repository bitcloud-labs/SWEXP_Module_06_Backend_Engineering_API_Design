# HTTP Status Code Reference

Pick the status that tells the client the truth without parsing the body.

## Success
| Code | When |
|------|------|
| 200 OK | successful GET/PATCH/PUT with a body |
| 201 Created | resource created (set `Location`) |
| 202 Accepted | accepted for async processing (enqueued) |
| 204 No Content | success with no body (e.g. DELETE) |

## Client errors (the request is the problem)
| Code | When |
|------|------|
| 400 Bad Request | **validation** failed (malformed/ill-typed) |
| 401 Unauthorized | not **authenticated** (log in) |
| 403 Forbidden | authenticated but not **permitted** |
| 404 Not Found | resource absent (or hiding existence vs 403) |
| 405 Method Not Allowed | wrong method on a known path |
| 409 Conflict | **business rule** violated (e.g. pay a cancelled order) |
| 422 Unprocessable | well-formed but semantically invalid |
| 429 Too Many Requests | rate limited (send `Retry-After`) |

## Server errors (we failed)
| Code | When |
|------|------|
| 500 Internal Server Error | unhandled failure |
| 503 Service Unavailable | not ready / overloaded (readiness fail) |

## The distinctions that trip people up
- **400 vs 409/422** — malformed request (validation) vs disallowed operation (business rule).
- **401 vs 403** — not authenticated vs not permitted.
- **200-with-error-body** — never; use the real status.
