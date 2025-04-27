package ucd.ac.ma.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ucd.ac.ma.dto.TrajectoryDTO;
import ucd.ac.ma.dto.TrajectoryResponseDTO;
import ucd.ac.ma.dto.UploadRequestDTO;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

@Service
public class ImuService {

    public List<TrajectoryDTO> processFile(MultipartFile file) {
        List<TrajectoryDTO> listPoint = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;

            while ((line = reader.readLine()) != null) {
                TrajectoryDTO trajectoryDTO = new TrajectoryDTO();
                StringTokenizer tokenizer = new StringTokenizer(line, " ");
                while (tokenizer.hasMoreTokens()) {
                    String x = tokenizer.nextToken();
                    String y = tokenizer.nextToken();
                    String z = tokenizer.nextToken();
                    trajectoryDTO.setX(x);
                    trajectoryDTO.setY(y);
                    trajectoryDTO.setZ(z);
                }
                listPoint.add(trajectoryDTO);
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return listPoint;
    }

    public List<TrajectoryResponseDTO> generateTrajectory(UploadRequestDTO uploadRequestDTO){
       List<TrajectoryResponseDTO> listTrajectory = new ArrayList<>();
       List<TrajectoryDTO> trajectoryDTOList = processFile(uploadRequestDTO.getAttachement());
        trajectoryDTOList.forEach(trajectoryDTO -> {
            TrajectoryResponseDTO trajectoryResponseDTO = new TrajectoryResponseDTO();
            trajectoryResponseDTO.setX(trajectoryDTO.getX());
            trajectoryResponseDTO.setY(trajectoryDTO.getY());
            trajectoryResponseDTO.setZ(trajectoryDTO.getZ());
            listTrajectory.add(trajectoryResponseDTO);
        });
        if (!listTrajectory.isEmpty()) {
            TrajectoryResponseDTO first = listTrajectory.get(0);
            first.setTime(uploadRequestDTO.getTime());
            first.setNose(uploadRequestDTO.getNose());
            first.setScale(uploadRequestDTO.getScale());
            first.setBiais(uploadRequestDTO.getBiais());
            first.setVariant(uploadRequestDTO.getVariant());

        }
        return listTrajectory;
    }
}

