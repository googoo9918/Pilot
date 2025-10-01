package kr.co.dbinc.com.web.service.item;

import jakarta.transaction.Transactional;
import kr.co.dbinc.com.common.error.ErrorCode;
import kr.co.dbinc.com.common.error.exception.BusinessException;
import kr.co.dbinc.com.web.dto.item.ItemResponseDto;
import kr.co.dbinc.com.web.entity.item.Item;
import kr.co.dbinc.com.web.mapper.item.ItemMapper;
import kr.co.dbinc.com.web.repository.item.ItemJpaRepository;
import kr.co.dbinc.com.web.repository.item.ItemMyBatisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
