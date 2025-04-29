package ucd.ac.ma.dto;

import lombok.Data;

@Data
public class TrajectoryResponseDTO {
    String x;
    String y;
    String z;
    private GradeDTO grade;
    private String time;
    private String variant;
}
