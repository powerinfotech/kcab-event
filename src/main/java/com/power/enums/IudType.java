package com.power.enums;

import lombok.Getter;

/**
 * IudType - 행(Row) 변경 유형 (Insert / Update / Delete)
 *
 * <p>프론트엔드 그리드에서 수정된 행의 상태를 나타내며,
 * 서버에서 IUD 처리 시 이 값을 기준으로 INSERT / UPDATE / DELETE를 분기한다.</p>
 *
 * <h3>처리 패턴</h3>
 * <pre>
 * switch (dto.getIudType()) {
 *     case I: dao.insert(dto); break;
 *     case U: dao.update(dto); break;
 *     case D: dao.delete(dto.getSeq()); break;
 * }
 * </pre>
 *
 * <h3>JSON 역직렬화</h3>
 * <p>클라이언트는 {@code "iudType": "I"} 형태로 전송하며,
 * Jackson이 enum 이름으로 자동 매핑한다.</p>
 */
@Getter
public enum IudType {
    /** INSERT — 새로 추가된 행 */
    I,
    /** UPDATE — 수정된 행 */
    U,
    /** DELETE — 삭제 요청된 행 */
    D
    ;

}
