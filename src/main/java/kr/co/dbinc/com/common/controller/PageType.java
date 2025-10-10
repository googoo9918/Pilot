package kr.co.dbinc.com.common.controller;

public enum PageType {
    MAIN("/WEB-INF/views/main.jsp"),
    MEMBER_FORM("/WEB-INF/views/member/memberForm.jsp"),
    MEMBER_LIST("/WEB-INF/views/member/memberList.jsp"),
    ITEM_FORM("/WEB-INF/views/item/itemForm.jsp"),
    ITEM_LIST("/WEB-INF/views/item/itemList.jsp"),
    ORDER_FORM("/WEB-INF/views/order/orderForm.jsp");

    private final String jspPath;

    PageType(String jspPath) {
        this.jspPath = jspPath;
    }

    public String getJspPath() {
        return jspPath;
    }
}
