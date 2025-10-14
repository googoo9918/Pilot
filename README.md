# ERP System

### 접속 URL
- **애플리케이션**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui
- **H2 Console**: http://localhost:8080/h2
  - JDBC URL: `jdbc:h2:mem:test`
  - Username: `sa`
  - Password: (비어있음)

## 📊 데이터베이스 ERD

```mermaid
erDiagram
    MEMBER {
        bigint member_id PK
        varchar name UK "회원명 (최대 10자)"
        varchar phone_number UK "전화번호 (11자리)"
        varchar city "도시"
        varchar street "도로명"
        varchar zipcode "우편번호"
    }
    
    ITEM {
        bigint item_id PK
        varchar name UK "상품명 (최대 10자)"
        int price "가격"
        int stock_quantity "재고수량"
    }
    
    ORDERS {
        bigint order_id PK
        bigint member_id FK "주문 회원"
        bigint delivery_id FK "배송 정보"
        datetime order_date "주문일시"
        varchar status "주문상태 (ORDER, CANCEL)"
    }
    
    ORDER_ITEM {
        bigint order_item_id PK
        bigint item_id FK "주문 상품"
        bigint order_id FK "주문"
        int order_price "주문가격 (스냅샷)"
        int count "주문수량"
    }
    
    DELIVERY {
        bigint delivery_id PK
        varchar city "배송 도시"
        varchar street "배송 도로명"
        varchar zipcode "배송 우편번호"
        varchar status "배송상태 (READY, COMPLETE)"
    }

    MEMBER ||--o{ ORDERS : "주문"
    ORDERS ||--|| DELIVERY : "배송"
    ORDERS ||--o{ ORDER_ITEM : "주문상품"
    ITEM ||--o{ ORDER_ITEM : "상품"
```

## 🏗️ Entity Class Diagram

```mermaid
classDiagram
    class Member {
        -Long id
        -String name
        -String phoneNumber
        -Address address
        +Member(name, phoneNumber, address)
    }

    class Item {
        -Long id
        -String name
        -int price
        -int stockQuantity
        +Item(name, price, stockQuantity)
        +addStock(quantity)
        +removeStock(quantity)
        +updateByRequest(request)
    }

    class Order {
        -Long id
        -Member member
        -List~OrderItem~ orderItems
        -Delivery delivery
        -LocalDateTime orderDate
        -OrderStatus status
        +assignMember(member)
        +addOrderItem(orderItem)
        +assignDelivery(delivery)
        +changeStatus(status)
        +createOrder(member, delivery, orderItems)
    }

    class OrderItem {
        -Long id
        -Item item
        -Order order
        -int orderPrice
        -int count
        +createOrderItem(item, orderPrice, count)
        +assignItem(item)
        +assignOrder(order)
        +assignOrderPrice(orderPrice)
        +assignCount(count)
    }

    class Delivery {
        -Long id
        -Address address
        -DeliveryStatus status
        +Delivery(address, deliveryStatus)
    }

    class Address {
        -String city
        -String street
        -String zipcode
        +Address(city, street, zipcode)
    }

    %% 관계 설정 (UML 호환 방식)
    Member "1" --> "many" Order : 주문
    Order "1" --> "1" Delivery : 배송
    Order "1" --> "many" OrderItem : 주문상품
    Item "1" --> "many" OrderItem : 상품
    Member "1" --> "1" Address : 주소
    Delivery "1" --> "1" Address : 배송주소

```

## 📋 주요 기능

- **회원 관리**: 회원 등록, 조회
- **상품 관리**: 상품 등록, 수정, 조회, 재고 관리
- **주문 관리**: 주문 생성, 조회, 취소, 배송 관리

## 🔧 기술 스택

- **Backend**: Spring Boot 3.5.5, Java 17
- **Database**: H2 (개발용), JPA/Hibernate, MyBatis
- **API**: REST API, Swagger UI
- **Validation**: Jakarta Validation, MapStruct

## 📚 API 엔드포인트

### 회원 관리 (`/api/members`)
- `POST /api/members` - 회원 생성
- `GET /api/members` - 회원 목록 조회

### 상품 관리 (`/api/items`)
- `POST /api/items` - 상품 등록
- `GET /api/items` - 상품 목록 조회
- `PUT /api/items/{id}` - 상품 수정

### 주문 관리 (`/api/orders`)
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 조회
- `DELETE /api/orders/{id}` - 주문 취소
