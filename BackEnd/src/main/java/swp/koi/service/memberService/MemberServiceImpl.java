package swp.koi.service.memberService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Member;
import swp.koi.repository.MemberRepository;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{

    private final MemberRepository memberRepository;

    @Override
    public Member getMemberById(int id) {
        return memberRepository.findById(id).orElseThrow(() -> new KoiException(ResponseCode.MEMBER_NOT_FOUND));
    }

}
