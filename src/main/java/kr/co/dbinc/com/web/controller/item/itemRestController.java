package kr.co.dbinc.com.web.controller.item;

import jakarta.validation.Valid;
import kr.co.dbinc.com.web.dto.item.ItemRequestDto;
import kr.co.dbinc.com.web.dto.item.ItemResponseDto;
import kr.co.dbinc.com.web.dto.item.ItemWriteRequestDto;
import kr.co.dbinc.com.web.entity.item.Item;
import kr.co.dbinc.com.web.mapper.item.ItemMapper;
import kr.co.dbinc.com.web.service.item.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/items")
public class itemRestController {
    private final ItemService itemService;
    private final ItemMapper itemMapper;

    /**
     * 상품 등록
     */
    @PostMapping()
    public ResponseEntity createItem(@Valid @RequestBody ItemRequestDto.ItemRequest itemRequest) {
        // 1. JPA 사용 시
//        Item item = itemMapper.itemRequestDtoToItem(itemRequest);
//        ItemResponseDto.ItemResponse itemResponse = itemService.createItemByJpa(item);
//
//        return ResponseEntity.ok(itemResponse);

        // 2. myBatis 사용 시
        //requestDto -> WriteRequestDto로 변환
        ItemWriteRequestDto.ItemCreate itemCreate = itemMapper.itemRequestDtoToItemCreate(itemRequest);
        itemService.createItemByMyBatis(itemCreate);

        return ResponseEntity.ok(itemRequest);
    }
}
