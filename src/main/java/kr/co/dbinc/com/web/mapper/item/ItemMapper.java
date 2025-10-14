package kr.co.dbinc.com.web.mapper.item;

import kr.co.dbinc.com.web.dto.item.ItemQueryResponseDto;
import kr.co.dbinc.com.web.dto.item.ItemRequestDto;
import kr.co.dbinc.com.web.dto.item.ItemResponseDto;
import kr.co.dbinc.com.web.dto.item.ItemWriteRequestDto;
import kr.co.dbinc.com.web.entity.item.Item;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ItemMapper {

    Item itemRequestDtoToItem(ItemRequestDto.ItemRequest itemRequest);

    @Mapping(target = "itemId", source = "id")
    ItemResponseDto.ItemResponse itemToItemResponseDto(Item newItem);

    ItemWriteRequestDto.ItemCreate itemRequestDtoToItemCreate(ItemRequestDto.ItemRequest itemRequest);

    List<ItemResponseDto.ItemResponse> itemListToItemResponseDtoList(List<Item> itemList);

    ItemResponseDto.ItemResponse itemQueryResponseToItemResponse(ItemQueryResponseDto.ItemQueryResponse itemQueryResponse);
    List<ItemResponseDto.ItemResponse> itemQueryResponseListToItemResponseList(List<ItemQueryResponseDto.ItemQueryResponse> itemQueryResponseList);

    ItemResponseDto.ItemResponse itemCreateToItemResponseDto(ItemWriteRequestDto.ItemCreate itemCreate);

    ItemWriteRequestDto.ItemUpdate itemRequestDtoToItemUpdate(ItemRequestDto.ItemRequest itemRequest);
}
