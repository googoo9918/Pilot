package kr.co.dbinc.com.web.repository.member;

import kr.co.dbinc.com.web.dto.member.MemberRequestDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMyBatisRepository {
    int createMember(MemberRequestDto.MemberRequest memberRequest);
}
