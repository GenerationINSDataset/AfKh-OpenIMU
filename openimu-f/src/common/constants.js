export const gradeOptions = [
  {
    id: 1,
    label: "Low cost",
    value: "Low cost",
    accelerometer: { bias: "10", noise: "10", scale: "1" },
    gyroscope: { bias: "10", noise: "0,1", scale: "10" },
  },
  {
    id: 2,
    label: "Industrial",
    value: "Industrial",
    accelerometer: { bias: "2", noise: "1", scale: "0,5" },
    gyroscope: { bias: "1", noise: "0,01", scale: "0,5" },
  },
  {
    id: 3,
    label: "Tactical",
    value: "Tactical",
    accelerometer: { bias: "0,1", noise: "0,1", scale: "0,1" },
    gyroscope: { bias: "0,1", noise: "0,01", scale: "0,1" },
  },
  {
    id: 4,
    label: "Custom",
    value: "Custom",
    accelerometer: {},
    gyroscope: {},
  },
];
