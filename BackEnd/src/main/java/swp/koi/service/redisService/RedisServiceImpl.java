package swp.koi.service.redisService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import swp.koi.model.Member;
import swp.koi.model.SubscribeRequest;
import swp.koi.service.authService.GetUserInfoByUsingAuth;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final GetUserInfoByUsingAuth getUserInfoByUsingAuth;



    @Override
    public void saveData(String key, Object value, Long expireTime) {
        redisTemplate.opsForValue().set(key, value);
        redisTemplate.expire(key,expireTime, TimeUnit.MILLISECONDS);
    }


    @Override
    public void saveDataWithoutTime(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }

    @Override
    public void saveDataToSet(String key, Object object) {
        redisTemplate.opsForSet().add(key, object);
    }

    @Override
    public Object getData(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public List<?> getListData(String key) {
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    @Override
    public Set<?> getSetData(String key) {
        return redisTemplate.opsForSet().members(key);
    }

    @Override
    public void deleteData(String key) {
        redisTemplate.delete(key);
    }

    @Override
    public boolean existData(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }


    @Override
    public boolean isUserFollowedThisLot(int lotId){
        Member member = getUserInfoByUsingAuth.getMemberFromAuth();

        Set<SubscribeRequest> subscribeRequests = (Set<SubscribeRequest>) getSetData("Notify_"+lotId);
        if(subscribeRequests != null && !subscribeRequests.isEmpty()) {
           return subscribeRequests.stream().anyMatch(request -> request.getMemberId().equals(member.getMemberId()));
        }
        return false;
    }
}
