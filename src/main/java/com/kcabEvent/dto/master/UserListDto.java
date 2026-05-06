package com.kcabEvent.dto.master;

import com.kcabEvent.domain.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;


/**
 * UserListDto - 사용자 목록 조회 결과 DTO
 *
 * <p>{@link User} 엔티티를 상속하고 최종 수정자 이름 및 사용 유효 여부 계산 로직을 추가한다.</p>
 *
 * <h3>getUseFlag() 동작</h3>
 * <ul>
 *   <li>{@code useYn}이 {@code "Y"}가 아니면 {@code false}</li>
 *   <li>{@code strDate}가 오늘 이후(미래)이면 아직 활성화되지 않음 → {@code false}</li>
 *   <li>{@code endDate}가 어제 이전(만료)이면 → {@code false}</li>
 *   <li>위 조건을 모두 통과하면 → {@code true}</li>
 * </ul>
 *
 * @see com.kcabEvent.dao.UserDao#selectUserList
 */
@Getter
@Setter
public class UserListDto extends User {
    private static final DateTimeFormatter VARCHAR8 = DateTimeFormatter.ofPattern("yyyyMMdd");

    /** 최종 수정자 이름 (JOIN으로 조회) */
    private String lastModifyUserName;

    /** 사용기간 기준 유효 사용여부 (use_yn + str_date/end_date) */
    public Boolean getUseFlag() {
         if (!"Y".equals(this.getUseYn()))
             return false;
         LocalDate str = parseStrDate(this.getStrDate());
         LocalDate end = parseStrDate(this.getEndDate());
         if (str == null || !str.isBefore(LocalDate.now().plusDays(1)))
             return false;
         return end == null || end.isAfter(LocalDate.now().minusDays(1));
     }

     private static LocalDate parseStrDate(String dateStr) {
         if (dateStr == null || dateStr.isEmpty()) return null;
         try {
             return dateStr.length() == 8
                 ? LocalDate.parse(dateStr, VARCHAR8)
                 : LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
         } catch (Exception e) {
             return null;
         }
     }
}
