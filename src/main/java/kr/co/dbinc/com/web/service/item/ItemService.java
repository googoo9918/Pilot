package kr.co.dbinc.com.web.service.item;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import kr.co.dbinc.com.common.error.ErrorCode;
import kr.co.dbinc.com.common.error.exception.BusinessException;
import kr.co.dbinc.com.common.error.exception.EntityNotFoundException;
import kr.co.dbinc.com.web.dto.item.ItemQueryResponseDto;
import kr.co.dbinc.com.web.dto.item.ItemRequestDto;
import kr.co.dbinc.com.web.dto.item.ItemResponseDto;
import kr.co.dbinc.com.web.dto.item.ItemWriteRequestDto;
import kr.co.dbinc.com.web.entity.item.Item;
import kr.co.dbinc.com.web.mapper.item.ItemMapper;
import kr.co.dbinc.com.web.repository.item.ItemJpaRepository;
import kr.co.dbinc.com.web.repository.item.ItemMyBatisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ItemService {
    private final ItemMapper itemMapper;
    private final ItemJpaRepository itemJpaRepository;
    private final ItemMyBatisRepository itemMyBatisRepository;

    /**
     * Jpa로 상품 생성
     */
    public ItemResponseDto.ItemResponse createItemByJpa(ItemRequestDto.ItemRequest itemRequest) {
        // requestDto -> Entity
        Item item = itemMapper.itemRequestDtoToItem(itemRequest);
        if (itemJpaRepository.existsByName(item.getName())) {
            throw new BusinessException(ErrorCode.ITEM_ALREADY_EXIST);
        }

        Item newItem = itemJpaRepository.save(item);
        return itemMapper.itemToItemResponseDto(newItem);
    }

    /**
     * mybatis로 상품 생성
     */
    public ItemResponseDto.ItemResponse createItemByMyBatis(ItemRequestDto.ItemRequest itemRequest) {
        //requestDto -> WriteRequestDto로 변환
        ItemWriteRequestDto.ItemCreate itemCreate = itemMapper.itemRequestDtoToItemCreate(itemRequest);
        boolean isExistItem = itemMyBatisRepository.isExistItem(itemCreate.getName());
        if (isExistItem) {
            throw new BusinessException(ErrorCode.ITEM_ALREADY_EXIST);
        }

        int createCount = itemMyBatisRepository.createItem(itemCreate);
        if(createCount == 0) throw new IllegalStateException("생성에 실패했습니다.");

        ItemQueryResponseDto.ItemQueryResponse itemQueryResponse = itemMyBatisRepository.selectItemById(itemCreate.getItemId());
        return itemMapper.itemQueryResponseToItemResponse(itemQueryResponse);
    }

    /**
     * Jpa로 상품 목록 조회
     */
    @Transactional(readOnly = true)
    public List<ItemResponseDto.ItemResponse> getItemListByJpa() {
        List<Item> itemList = itemJpaRepository.findAll();
        return itemMapper.itemListToItemResponseDtoList(itemList);
    }

    /**
     * mybatis로 상품 목록 조호
     */
    @Transactional(readOnly = true)
    public List<ItemResponseDto.ItemResponse> getItemListByMyBatis() {
        List<ItemQueryResponseDto.ItemQueryResponse> itemQueryResponseList = itemMyBatisRepository.findItemList();
        //QueryResponseDto -> Response 변환
        return itemMapper.itemQueryResponseListToItemResponseList(itemQueryResponseList);
    }

    /**
     * pk로 item 조회
     */
    @Transactional(readOnly = true)
    public Item getItemById(Long itemId) {
        return itemJpaRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.NOT_EXIST_ITEM));
    }

    /**
     * jpa로 상품 수정
     */
    public ItemResponseDto.ItemResponse updateItemByJpa(ItemRequestDto.ItemRequest itemRequest, @Positive Long itemId) {
        Item preItem = getItemById(itemId);

        preItem.updateByRequest(itemRequest);

        return itemMapper.itemToItemResponseDto(preItem);
    }

    /**
     * mybatis로 상품 수정
     */
    public ItemResponseDto.ItemResponse updateItemByMyBaits(ItemRequestDto.ItemRequest itemRequest, Long itemId) {
        //requestDto -> WriteRequestDto로 변환
        ItemWriteRequestDto.ItemUpdate itemUpdate = itemMapper.itemRequestDtoToItemUpdate(itemRequest);
        int updateCount = itemMyBatisRepository.updateItem(itemRequest, itemId);

        if(updateCount == 0){
            throw new EntityNotFoundException(ErrorCode.NOT_EXIST_ITEM);
        }

        ItemQueryResponseDto.ItemQueryResponse itemQueryResponse = itemMyBatisRepository.selectItemById(itemId);
        return itemMapper.itemQueryResponseToItemResponse(itemQueryResponse);
    }
}
