package ucd.ac.ma.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ucd.ac.ma.dto.TrajectoryResponseDTO;
import ucd.ac.ma.dto.UploadRequestDTO;
import ucd.ac.ma.service.ImuService;

import java.util.List;

@RestController
@RequestMapping("/imu")
public class OpenimuRestController {

    @Autowired
    private ImuService imuService;

    @PostMapping(value = "/generate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<TrajectoryResponseDTO>> handleUpload(@RequestPart("attachement") MultipartFile attachement,
                                                                    @RequestPart("data") UploadRequestDTO data) {

        List<TrajectoryResponseDTO> listTrajectoryResponseDTO = imuService.generateTrajectory(attachement, data);

        return ResponseEntity.ok()
                .body(listTrajectoryResponseDTO);
    }

}
