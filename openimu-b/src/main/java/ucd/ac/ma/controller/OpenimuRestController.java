package ucd.ac.ma.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ucd.ac.ma.dto.TrajectoryResponseDTO;
import ucd.ac.ma.dto.UploadRequestDTO;
import ucd.ac.ma.service.ImuService;

import java.util.List;

@RestController
@RequestMapping("/imu")
public class OpenimuRestController {

    @Autowired
    private ImuService imuService;

    @PostMapping("/generate")
    public ResponseEntity<List<TrajectoryResponseDTO>> handleUpload(@ModelAttribute UploadRequestDTO request) {

        List<TrajectoryResponseDTO> listTrajectoryResponseDTO = imuService.generateTrajectory(request);

        return ResponseEntity.ok()
                .body(listTrajectoryResponseDTO);
    }

}
