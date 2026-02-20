package com.miso.lxnn.dao;

import com.miso.lxnn.domain.User;
import com.miso.lxnn.dto.common.LoginRequestDto;
import com.miso.lxnn.dto.master.UserComboListDto;
import com.miso.lxnn.dto.master.UserListDto;
import com.miso.lxnn.dto.master.UserListSearchDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("userDao")
public interface UserDao {
	User selectUser(@Param("userId") String userId) throws Exception;
    String selectSalt(@Param("userId") String userId) throws Exception;
	Integer selectUserLoginCheck(LoginRequestDto loginRequestDto) throws Exception;
	List<UserListDto> selectUserList(UserListSearchDto param) throws Exception;
    List<UserComboListDto> selectUserComboList(@Param("searchText") String searchText) throws Exception;
    Boolean selectUserIdValidation(@Param("userId") String userId) throws Exception;
    void insertUser(User user) throws Exception;
    void updateUser(User user) throws Exception;
    void deleteUser(User user) throws Exception;
    void updatePassword(User user) throws Exception;
}