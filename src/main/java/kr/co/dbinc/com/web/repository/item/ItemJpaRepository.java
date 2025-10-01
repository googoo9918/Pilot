package kr.co.dbinc.com.web.repository.item;

import kr.co.dbinc.com.web.entity.item.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemJpaRepository extends JpaRepository<Item, Long> {
    boolean existsByName(String name);
}
