package kr.co.dbinc.com.web.controller.item;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import kr.co.dbinc.com.web.doc.item.ItemAPI;
import kr.co.dbinc.com.web.dto.item.ItemRequestDto;
import kr.co.dbinc.com.web.dto.item.ItemResponseDto;
import kr.co.dbinc.com.web.dto.item.ItemWriteRequestDto;
import kr.co.dbinc.com.web.entity.item.Item;
import kr.co.dbinc.com.web.mapper.item.ItemMapper;
import kr.co.dbinc.com.web.service.item.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/items")
public class itemRestController implements ItemAPI {
    private final ItemService itemService;
    private final ItemMapper itemMapper;

    /**
     * 상품 등록
     */
    @PostMapping()
    public ResponseEntity createItem(@Valid @RequestBody ItemRequestDto.ItemRequest itemRequest) {
        // 1. JPA 사용 시
//        ItemResponseDto.ItemResponse itemResponse = itemService.createItemByJpa(itemRequest);

        // 2. myBatis 사용 시
        ItemResponseDto.ItemResponse itemResponse = itemService.createItemByMyBatis(itemRequest);

        URI location = URI.create("/items/" + itemResponse.getItemId());
        return ResponseEntity.created(location).body(itemResponse);
    }

    /**
     * 상품 목록 조회
     */
    @GetMapping()
    public ResponseEntity getItemList() {
        // 1. JPA 사용 시
//        List<ItemResponseDto.ItemResponse> itemResponseList = itemService.getItemListByJpa();
//        return ResponseEntity.ok(itemResponseList);

        // 2. MyBatis 사용 시
        List<ItemResponseDto.ItemResponse> itemResponseList = itemService.getItemListByMyBatis();
        return ResponseEntity.ok(itemResponseList);
    }

    /**
     * 상품 수정
     */
    @PutMapping("/{itemId}")
    public ResponseEntity updateItem(@PathVariable @Positive Long itemId, @Valid @RequestBody ItemRequestDto.ItemRequest itemRequest){
        // 1. JPA 사용 시
//        ItemResponseDto.ItemResponse itemResponse = itemService.updateItemByJpa(itemRequest, itemId);
//        return ResponseEntity.ok(itemResponse);

        // 2. MyBatis 사용 시
        ItemResponseDto.ItemResponse itemResponse = itemService.updateItemByMyBaits(itemRequest, itemId);
        return ResponseEntity.ok(itemResponse);
    }
}
