package com.kcabEvent.service.sponsor.impl;

import com.kcabEvent.dao.SponsorDao;
import com.kcabEvent.domain.Sponsor;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.sponsor.SponsorDetailDto;
import com.kcabEvent.dto.sponsor.SponsorListDto;
import com.kcabEvent.dto.sponsor.SponsorSaveDto;
import com.kcabEvent.dto.sponsor.SponsorSearchDto;
import com.kcabEvent.dto.sponsor.SponsorTierDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.sponsor.SponsorService;
import jakarta.annotation.Resource;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service("sponsorService")
public class SponsorServiceImpl extends EgovAbstractServiceImpl implements SponsorService {

    @Resource(name = "sponsorDao")
    private SponsorDao sponsorDao;

    @Value("${file.url.image-prefix:/api/public/file-image}")
    private String imageUrlPrefix;

    @Override
    public List<SponsorListDto> selectSponsorList(SponsorSearchDto search) {
        SponsorSearchDto normalized = normalizeSearch(search);
        List<SponsorListDto> sponsors = sponsorDao.selectSponsorList(normalized);
        sponsors.forEach(this::applyLogoUrl);
        return sponsors;
    }

    @Override
    public SponsorDetailDto selectSponsorDetail(Long sponsorSeq) {
        if (sponsorSeq == null) {
            throw new BusinessException("Sponsor id is required.");
        }
        SponsorDetailDto detail = sponsorDao.selectSponsorDetail(sponsorSeq);
        if (detail == null) {
            throw new BusinessException("Sponsor was not found.");
        }
        applyLogoUrl(detail);
        return detail;
    }

    @Override
    public List<SponsorTierDto> selectSponsorTiers() {
        return sponsorDao.selectSponsorTiers();
    }

    @Override
    @Transactional("transactionManager")
    public Long saveSponsor(SponsorSaveDto saveDto, LoginUser loginUser) {
        if (saveDto == null) {
            throw new BusinessException("Request body is required.");
        }
        Long userSeq = loginUser != null && loginUser.getUserSeq() != null
                ? loginUser.getUserSeq().longValue()
                : null;

        Sponsor entity = new Sponsor();
        entity.setSponsorSeq(saveDto.getSponsorSeq());
        entity.setEditionYear(resolveEditionYear(saveDto.getEditionYear(), saveDto.getSponsorSeq() == null));
        entity.setTierCd(requireText(saveDto.getTierCd(), "Tier is required."));
        entity.setCompanyName(requireText(saveDto.getCompanyName(), "Company name is required."));
        entity.setLogoFileSeq(saveDto.getLogoFileSeq());
        entity.setDescription(blankToNull(saveDto.getDescription()));
        entity.setRepresentativeRemarks(blankToNull(saveDto.getRepresentativeRemarks()));
        entity.setSortSeq(saveDto.getSortSeq() != null ? saveDto.getSortSeq() : 0);
        entity.setUseYn(normalizeYn(saveDto.getUseYn(), "Y"));
        entity.setUptUserSeq(userSeq);

        if (entity.getSponsorSeq() == null) {
            entity.setRgstUserSeq(userSeq);
            sponsorDao.insertSponsor(entity);
        } else {
            int updated = sponsorDao.updateSponsor(entity);
            if (updated == 0) {
                throw new BusinessException("Sponsor was not found.");
            }
        }
        return entity.getSponsorSeq();
    }

    @Override
    @Transactional("transactionManager")
    public void deleteSponsor(Long sponsorSeq, LoginUser loginUser) {
        if (sponsorSeq == null) {
            throw new BusinessException("Sponsor id is required.");
        }
        Long userSeq = loginUser != null && loginUser.getUserSeq() != null
                ? loginUser.getUserSeq().longValue()
                : null;
        int deleted = sponsorDao.softDeleteSponsor(sponsorSeq, userSeq);
        if (deleted == 0) {
            throw new BusinessException("Sponsor was not found.");
        }
    }

    private SponsorSearchDto normalizeSearch(SponsorSearchDto search) {
        SponsorSearchDto normalized = search != null ? search : new SponsorSearchDto();
        normalized.setUseYn(normalizeYnNullable(normalized.getUseYn()));
        normalized.setTierCd(blankToNull(normalized.getTierCd()));
        if (normalized.getKeyword() != null) {
            String trimmed = normalized.getKeyword().trim();
            normalized.setKeyword(trimmed.isEmpty() ? null : trimmed);
        }
        return normalized;
    }

    private Integer resolveEditionYear(Integer year, boolean insert) {
        if (year == null) {
            if (insert) {
                return LocalDate.now().getYear();
            }
            throw new BusinessException("Year is required.");
        }
        if (year < 2000 || year > 2100) {
            throw new BusinessException("Year must be between 2000 and 2100.");
        }
        return year;
    }

    private String normalizeYn(String value, String defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        String upper = value.trim().toUpperCase();
        if (!"Y".equals(upper) && !"N".equals(upper)) {
            throw new BusinessException("Use 'Y' or 'N'.");
        }
        return upper;
    }

    private String normalizeYnNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return normalizeYn(value, "Y");
    }

    private String requireText(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new BusinessException(message);
        }
        return value.trim();
    }

    private String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private void applyLogoUrl(SponsorListDto sponsor) {
        if (sponsor == null || sponsor.getLogoFileDtlSeq() == null) {
            return;
        }
        sponsor.setLogoFileUrl(buildImageUrl(sponsor.getLogoFileDtlSeq()));
    }

    private void applyLogoUrl(SponsorDetailDto sponsor) {
        if (sponsor == null || sponsor.getLogoFileDtlSeq() == null) {
            return;
        }
        sponsor.setLogoFileUrl(buildImageUrl(sponsor.getLogoFileDtlSeq()));
    }

    private String buildImageUrl(Long fileDtlSeq) {
        if (fileDtlSeq == null) {
            return null;
        }
        String normalizedPrefix = imageUrlPrefix == null || imageUrlPrefix.isBlank()
                ? "/api/public/file-image"
                : imageUrlPrefix.trim();
        if (normalizedPrefix.endsWith("/")) {
            normalizedPrefix = normalizedPrefix.substring(0, normalizedPrefix.length() - 1);
        }
        return normalizedPrefix + "/" + fileDtlSeq;
    }
}
