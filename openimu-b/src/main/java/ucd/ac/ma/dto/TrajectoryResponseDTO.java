package ucd.ac.ma.dto;

import lombok.Data;

@Data
public class TrajectoryResponseDTO {
    String x;
    String y;
    String z;
    private String biais;
    private String nose;
    private String scale;
    private String time;
    private String variant;
}
