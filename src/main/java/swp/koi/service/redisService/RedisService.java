package swp.koi.service.redisService;

import java.util.Set;

public interface RedisService {
    void saveData(String key, Object value, Long expireTime);

    void saveDataToSet(String key, Object object);

    Object getData(String key);

    Set<?> getSetData(String key);

    void deleteData(String key);

    boolean existData(String key);
}
