package kr.co.dbinc.com.web.repository.item;

import kr.co.dbinc.com.web.dto.item.ItemQueryResponseDto;
import kr.co.dbinc.com.web.dto.item.ItemRequestDto;
import kr.co.dbinc.com.web.dto.item.ItemWriteRequestDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ItemMyBatisRepository {
    boolean isExistItem(String name);

    int createItem(ItemWriteRequestDto.ItemCreate itemCreate);

    List<ItemQueryResponseDto.ItemQueryResponse> findItemList();

    int updateItem(ItemRequestDto.ItemRequest itemRequest, Long itemId);

    ItemQueryResponseDto.ItemQueryResponse selectItemById(Long itemId);
}
