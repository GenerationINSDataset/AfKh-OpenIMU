import React from "react";
import "./TrajectoryTable.css";
import { FormattedMessage } from "react-intl";

const TrajectoryTable = ({ trajectoryList }) => {
  return (
    <div className="tableBox">
      <table>
        <thead>
          <tr>
            <th rowspan="2">
              <FormattedMessage id="table.x" />
            </th>
            <th rowspan="2">
              <FormattedMessage id="table.y" />
            </th>
            <th rowspan="2">
              <FormattedMessage id="table.z" />
            </th>
            <th colspan="3">
              <FormattedMessage id="table.accelerometer" />
            </th>
            <th colspan="3">
              <FormattedMessage id="table.gyroscope" />
            </th>
            <th rowspan="2">
              <FormattedMessage id="table.time" />
            </th>
            <th rowspan="2">
              <FormattedMessage id="table.variant" />
            </th>
          </tr>
          <tr>
            <th>
              <FormattedMessage id="table.bias" />
            </th>
            <th>
              <FormattedMessage id="table.noise" />
            </th>
            <th>
              <FormattedMessage id="table.scale" />
            </th>
            <th>
              <FormattedMessage id="table.bias" />
            </th>
            <th>
              <FormattedMessage id="table.noise" />
            </th>
            <th>
              <FormattedMessage id="table.scale" />
            </th>
          </tr>
        </thead>
        <tbody>
          {trajectoryList.slice(0, 10).map((trajectory) => (
            <tr>
              <td>{trajectory.x}</td>
              <td>{trajectory.y}</td>
              <td>{trajectory.z}</td>
              <td>{trajectory.grade?.accelerometer?.bias}</td>
              <td>{trajectory.grade?.accelerometer?.noise}</td>
              <td>{trajectory.grade?.accelerometer?.scale}</td>
              <td>{trajectory.grade?.gyroscope?.bias}</td>
              <td>{trajectory.grade?.gyroscope?.noise}</td>
              <td>{trajectory.grade?.gyroscope?.scale}</td>
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
