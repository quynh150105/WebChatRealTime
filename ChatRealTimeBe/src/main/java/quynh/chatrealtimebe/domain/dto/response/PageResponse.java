package quynh.chatrealtimebe.domain.dto.response;

import lombok.*;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PageResponse <T>{
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

}
