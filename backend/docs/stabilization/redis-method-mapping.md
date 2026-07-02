# REDIS METHOD MAPPING

## Converted APIs
| Legacy / Inconsistent Method | Standardized Wrapper Method | node-redis v4 Underlying Call |
|------------------------------|-----------------------------|-------------------------------|
| `.get` / `.get()`        | `redisManager.get()`      | `client.get()`              |
| `.setex` / `.setEx`      | `redisManager.setEx()`    | `client.setEx()`            |
| `.sadd` / `.sAdd`        | `redisManager.addToSet()` | `client.sAdd()`             |
| `.smembers` / `.sMembers`| `redisManager.getMembers()`|`client.sMembers()`          |
| `.hgetall` / `.hGetAll`  | `redisManager.hashGetAll()`|`client.hGetAll()`          |
| `.del` / `.delete`       | `redisManager.delete()`   | `client.del()`              |
