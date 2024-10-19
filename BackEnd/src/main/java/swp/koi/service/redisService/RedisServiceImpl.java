package swp.koi.service.redisService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public void saveData(String key, Object value, Long expireTime) {
        redisTemplate.opsForValue().set(key, value);
        redisTemplate.expire(key,expireTime, TimeUnit.MILLISECONDS);
    }

    @Override
    public Object getData(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public void deleteData(String key) {
        redisTemplate.delete(key);
    }

    @Override
    public boolean existData(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

}
