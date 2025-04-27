import React from "react";
import "./TrajectoryTable.css";

const TrajectoryTable = ({ trajectoryList }) => {
  return (
    <div className="tableBox">
      <table>
        <thead>
          <th>X</th>
          <th>Y</th>
          <th>Z</th>
          <th>Biais</th>
          <th>Bruit</th>
          <th>Facteur échelle</th>
          <th>Temps</th>
          <th>Variant</th>
        </thead>
        <tbody>
          {trajectoryList.slice(0, 10).map((trajectory) => (
            <tr>
              <td>{trajectory.x}</td>
              <td>{trajectory.y}</td>
              <td>{trajectory.z}</td>
              <td>{trajectory.biais}</td>
              <td>{trajectory.nose}</td>
              <td>{trajectory.scale}</td>
              <td>{trajectory.time}</td>
              <td>{trajectory.variant}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrajectoryTable;
