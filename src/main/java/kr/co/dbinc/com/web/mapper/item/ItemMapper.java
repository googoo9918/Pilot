package kr.co.dbinc.com.web.mapper.item;

import kr.co.dbinc.com.web.dto.item.ItemRequestDto;
import kr.co.dbinc.com.web.dto.item.ItemResponseDto;
import kr.co.dbinc.com.web.entity.item.Item;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ItemMapper {

    Item itemRequestDtoToItem(ItemRequestDto.ItemRequest itemRequest);

    ItemResponseDto.ItemResponse itemToItemResponseDto(Item newItem);
}
