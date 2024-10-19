package swp.koi.service.redisService;

public interface RedisService {
    void saveData(String key, Object value, Long expireTime);

    Object getData(String key);

    void deleteData(String key);

    boolean existData(String key);
}
