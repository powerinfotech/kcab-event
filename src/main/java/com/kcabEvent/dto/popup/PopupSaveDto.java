package com.kcabEvent.dto.popup;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PopupSaveDto {
    @NotNull
    private List<PopupListDto> popupList;
}
