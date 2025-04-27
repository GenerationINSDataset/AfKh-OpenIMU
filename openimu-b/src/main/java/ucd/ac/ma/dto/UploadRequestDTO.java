package ucd.ac.ma.dto;


import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UploadRequestDTO {
    private MultipartFile attachement;
    private String biais;
    private String nose;
    private String scale;
    private String time;
    private String variant;
}
