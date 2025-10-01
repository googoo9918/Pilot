package kr.co.dbinc.com.web.repository.item;

import kr.co.dbinc.com.web.dto.item.ItemWriteRequestDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ItemMyBatisRepository {
    boolean isExistItem(String name);

    void createItem(ItemWriteRequestDto.ItemCreate itemCreate);
}
