package ucd.ac.ma.dto;


import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UploadRequestDTO {
    private GradeDTO grade;
    private String time;
    private String variant;
}
