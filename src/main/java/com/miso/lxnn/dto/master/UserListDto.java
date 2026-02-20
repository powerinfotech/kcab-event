package com.miso.lxnn.dto.master;

import com.miso.lxnn.domain.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;


@Getter
@Setter
public class UserListDto extends User {
    private String lastModifyUserName;
    private Boolean useFlag;

     public LocalDate getLastUpdateDate() {
         return LocalDate.parse(this.getUptDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
     }

     public Boolean getUseFlag() {
         if(this.useFlag == null||!this.useFlag)
             return false;

         if(this.getStrDate().isBefore(LocalDate.now().plusDays(1))) {
             if(this.getEndDate() == null || this.getEndDate().isAfter(LocalDate.now().minusDays(1)))
                 return true;
         }
         return false;
     }
}
