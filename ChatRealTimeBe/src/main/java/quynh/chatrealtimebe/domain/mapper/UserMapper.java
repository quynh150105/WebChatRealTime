package quynh.chatrealtimebe.domain.mapper;

import org.mapstruct.Mapper;
import quynh.chatrealtimebe.domain.dto.response.UserResponse;
import quynh.chatrealtimebe.domain.entity.User;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toUserResponse(User user);

    List<UserResponse> toListUserResponse(List<User> users);

    User toUser(UserResponse userResponse);

}
