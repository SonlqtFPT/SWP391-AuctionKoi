package swp.koi.service.redisService;

import java.util.List;

public interface RedisService {
    void saveData(String key, Object value, Long expireTime);

    void saveDataToList(String key, Object object);

    Object getData(String key);

    void deleteData(String key);

    boolean existData(String key);
}
