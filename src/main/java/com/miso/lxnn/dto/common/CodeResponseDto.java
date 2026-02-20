package com.miso.lxnn.dto.common;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CodeResponseDto {
    public CodeResponseDto(){}
    public CodeResponseDto (String label,String value) {
        this.label = label;
        this.value = value;
    }
    public CodeResponseDto (String label,String value,String parent) {
        this.label = label;
        this.value = value;
        this.parent = parent;
    }
    private String label;
    private String value;
    private String parent;
}
