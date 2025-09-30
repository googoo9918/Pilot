package kr.co.dbinc.com.web.mapper.member;

import kr.co.dbinc.com.web.dto.member.MemberRequestDto;
import kr.co.dbinc.com.web.dto.member.MemberResponseDto;
import kr.co.dbinc.com.web.entity.Address;
import kr.co.dbinc.com.web.entity.member.Member;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MemberMapper {
    @Mapping(target = "address", source = "m", qualifiedByName = "toAddress")
    Member memberRequestDtoToMember(MemberRequestDto.MemberRequest m);

    @Named("toAddress")
    default Address toAddress(MemberRequestDto.MemberRequest m) {
        if (m == null) return null;
        return new Address(m.getCity(), m.getStreet(), m.getZipcode());
    }

    @Mapping(target = "memberId", source = "id")
    @Mapping(target = "city", source = "address.city")
    @Mapping(target = "street", source = "address.street")
    @Mapping(target = "zipcode", source = "address.zipcode")
    MemberResponseDto.MemberResponse memberToMemberResponseDto(Member newMember);

    List<MemberResponseDto.MemberResponse> memberListToMemberResponseDtoList(List<Member> memberList);
}
