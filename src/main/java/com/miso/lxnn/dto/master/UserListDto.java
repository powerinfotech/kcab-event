package com.miso.lxnn.dto.master;

import com.miso.lxnn.domain.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;


@Getter
@Setter
public class UserListDto extends User {
    private static final DateTimeFormatter VARCHAR8 = DateTimeFormatter.ofPattern("yyyyMMdd");

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
