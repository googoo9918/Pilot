package kr.co.dbinc.com.web.mapper.item;

import jakarta.validation.Valid;
import kr.co.dbinc.com.web.dto.item.ItemRequestDto;
import kr.co.dbinc.com.web.dto.item.ItemResponseDto;
import kr.co.dbinc.com.web.dto.item.ItemWriteRequestDto;
import kr.co.dbinc.com.web.entity.item.Item;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ItemMapper {

    Item itemRequestDtoToItem(ItemRequestDto.ItemRequest itemRequest);

    ItemResponseDto.ItemResponse itemToItemResponseDto(Item newItem);

    ItemWriteRequestDto.ItemCreate itemRequestDtoToItemCreate(ItemRequestDto.ItemRequest itemRequest);

    List<ItemResponseDto.ItemResponse> itemListToItemResponseDtoList(List<Item> itemList);
}
