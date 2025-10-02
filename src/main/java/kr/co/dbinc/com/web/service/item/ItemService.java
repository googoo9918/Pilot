package kr.co.dbinc.com.web.service.item;

import jakarta.transaction.Transactional;
import kr.co.dbinc.com.common.error.ErrorCode;
import kr.co.dbinc.com.common.error.exception.BusinessException;
import kr.co.dbinc.com.common.error.exception.EntityNotFoundException;
import kr.co.dbinc.com.web.dto.item.ItemQueryResponseDto;
import kr.co.dbinc.com.web.dto.item.ItemResponseDto;
import kr.co.dbinc.com.web.dto.item.ItemWriteRequestDto;
import kr.co.dbinc.com.web.entity.item.Item;
import kr.co.dbinc.com.web.mapper.item.ItemMapper;
import kr.co.dbinc.com.web.repository.item.ItemJpaRepository;
import kr.co.dbinc.com.web.repository.item.ItemMyBatisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ItemService {
    private final ItemMapper itemMapper;
    private final ItemJpaRepository itemJpaRepository;
    private final ItemMyBatisRepository itemMyBatisRepository;

    public ItemResponseDto.ItemResponse createItemByJpa(Item item) {
        if (itemJpaRepository.existsByName(item.getName())) {
            throw new BusinessException(ErrorCode.ITEM_ALREADY_EXIST);
        }

        Item newItem = itemJpaRepository.save(item);
        return itemMapper.itemToItemResponseDto(newItem);
    }

    public void createItemByMyBatis(ItemWriteRequestDto.ItemCreate itemCreate) {
        boolean isExistItem = itemMyBatisRepository.isExistItem(itemCreate.getName());
        if(isExistItem){
            throw new BusinessException(ErrorCode.ITEM_ALREADY_EXIST);
        }

        itemMyBatisRepository.createItem(itemCreate);
    }

    public List<ItemResponseDto.ItemResponse> getItemListByJpa() {
        List<Item> itemList = itemJpaRepository.findAll();
        return itemMapper.itemListToItemResponseDtoList(itemList);
    }

    public List<ItemResponseDto.ItemResponse> getItemListByMyBatis() {
        List<ItemQueryResponseDto.ItemQueryResponse> itemQueryResponseList = itemMyBatisRepository.findItemList();
        //QueryResponseDto -> Response 변환
        return itemMapper.itemQueryResponseListToItemResponseList(itemQueryResponseList);
    }

    public Item getItemById(Long itemId) {
        return itemJpaRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.NOT_EXIST_ITEM));
    }
}
