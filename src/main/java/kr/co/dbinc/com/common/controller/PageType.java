package kr.co.dbinc.com.common.controller;

public enum PageType {
    MAIN("/WEB-INF/views/main.jsp"), MEMBER_FORM("/WEB-INF/views/member/memberForm.jsp");

    private final String jspPath;

    PageType(String jspPath) {
        this.jspPath = jspPath;
    }

    public String getJspPath() {
        return jspPath;
    }
}
