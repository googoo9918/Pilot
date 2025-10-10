package kr.co.dbinc.com.web.mapper.member;

import jakarta.validation.Valid;
import kr.co.dbinc.com.web.dto.member.MemberQueryResponseDto;
import kr.co.dbinc.com.web.dto.member.MemberRequestDto;
import kr.co.dbinc.com.web.dto.member.MemberResponseDto;
import kr.co.dbinc.com.web.dto.member.MemberWriteRequestDto;
import kr.co.dbinc.com.web.entity.Address;
import kr.co.dbinc.com.web.entity.member.Member;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MemberMapper {
    @Mapping(target = "address", source = "memberRequest", qualifiedByName = "toAddress")
    @Mapping(target = "phoneNumber", source= "memberRequest", qualifiedByName = "toPhoneNumber")
    Member memberRequestDtoToMember(MemberRequestDto.MemberRequest memberRequest);

    @Named("toAddress")
    default Address toAddress(MemberRequestDto.MemberRequest memberRequest) {
        if (memberRequest == null) return null;
        return new Address(memberRequest.getCity(), memberRequest.getStreet(), memberRequest.getZipcode());
    }

    @Named("toPhoneNumber")
    default String toPhoneNumber(MemberRequestDto.MemberRequest memberRequest) {
        if (memberRequest == null) return null;
        StringBuilder sb = new StringBuilder();
        return sb.append(memberRequest.getPhonePrefix()).append(memberRequest.getPhoneMiddle()).append(memberRequest.getPhoneLast()).toString();
    }

    @Mapping(target = "memberId", source = "id")
    @Mapping(target = "city", source = "address.city")
    @Mapping(target = "street", source = "address.street")
    @Mapping(target = "zipcode", source = "address.zipcode")
    @Mapping(target = "phoneNumber", source = "phoneNumber", qualifiedByName = "formatPhoneNumber")
    MemberResponseDto.MemberResponse memberToMemberResponseDto(Member member);

    @Named("formatPhoneNumber")
    default String formatPhoneNumber(String phoneNumber) {
        if (phoneNumber == null) return null;
        if (phoneNumber.length() == 11) {
            return phoneNumber.substring(0, 3) + "-"
                 + phoneNumber.substring(3, 7) + "-"
                 + phoneNumber.substring(7);
        }
        return phoneNumber;
    }


    List<MemberResponseDto.MemberResponse> memberListToMemberResponseDtoList(List<Member> memberList);

    @Mapping(target = "phoneNumber", source= "memberRequest", qualifiedByName = "toPhoneNumber")
    MemberWriteRequestDto.MemberCreate memberRequestDtoToMemberCreate(MemberRequestDto.MemberRequest memberRequest);

    @Mapping(target = "phoneNumber", source = "phoneNumber", qualifiedByName = "formatPhoneNumber")
    MemberResponseDto.MemberResponse memberQueryResponseToMemberResponse(MemberQueryResponseDto.MemberQueryResponse memberQueryResponse);

    List<MemberResponseDto.MemberResponse> memberQueryResponseListToMemberResponseList(List<MemberQueryResponseDto.MemberQueryResponse> memberQueryResponseList);
}
