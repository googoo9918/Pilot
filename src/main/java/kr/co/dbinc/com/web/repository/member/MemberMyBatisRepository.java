package kr.co.dbinc.com.web.repository.member;

import kr.co.dbinc.com.web.dto.member.MemberQueryResponseDto;
import kr.co.dbinc.com.web.dto.member.MemberWriteRequestDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MemberMyBatisRepository {
    int createMember(MemberWriteRequestDto.MemberCreate memberCreate);

    boolean isExistMember(String name);

    List<MemberQueryResponseDto.MemberQueryResponse> findMemberList();
}
