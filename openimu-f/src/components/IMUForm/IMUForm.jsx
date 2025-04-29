import React, { useState } from "react";
import "./IMUForm.css";
import Select from "react-select";
import { FormattedMessage } from "react-intl";
import { gradeOptions } from "../../common/constants";
import { useForm, Controller, useWatch } from "react-hook-form";
import axios from "axios";
import TrajectoryTable from "../TrajectoryTable";
import { ReactComponent as LoadIcon } from "../../icons/rotate-solid.svg";
import { ReactComponent as DownLoadIcon } from "../../icons/download-solid.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../Input";
import * as yup from "yup";
const IMUForm = () => {
  const schema = yup.object({
    attachement: yup
      .mixed()
      .required("required file")
      .test(
        "is-txt",
        "The file must be a .txt",
        (file) => file[0] && file[0].name && file[0].name.endsWith(".txt")
      ),
    grade: yup.object().required("required field"),
    time: yup.string().required("required field"),
    variant: yup
      .number()
      .transform((val, orig) => (orig === "" ? undefined : val))
      .typeError("Must be a number")
      .required("required field"),
    accelerometer: yup.object().when("grade.id", {
      is: 4,
      then: (schema) =>
        schema.shape({
          bias: yup
            .number()
            .transform((val, orig) => (orig === "" ? undefined : val))
            .typeError("Must be a number")
            .required("required field"),
          noise: yup
            .number()
            .transform((val, orig) => (orig === "" ? undefined : val))
            .typeError("Must be a number")
            .required("required field"),
          scale: yup
            .number()
            .transform((val, orig) => (orig === "" ? undefined : val))
            .typeError("Must be a number")
            .required("required field"),
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
    gyroscope: yup.object().when("grade.id", {
      is: 4,
      then: (schema) =>
        schema.shape({
          bias: yup
            .number()
            .transform((val, orig) => (orig === "" ? undefined : val))
            .typeError("Must be a number")
            .required("required field"),
          noise: yup
            .number()
            .transform((val, orig) => (orig === "" ? undefined : val))
            .typeError("Must be a number")
            .required("required field"),
          scale: yup
            .number()
            .transform((val, orig) => (orig === "" ? undefined : val))
            .typeError("Must be a number")
            .required("required field"),
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const grade = useWatch({ control, name: "grade" });
  const [trajectories, setTrajectories] = useState([]);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("attachement", data.attachement[0]);
    const grade =
      data.grade.id === 4
        ? { accelerometre: data.accelerometre, gyroscope: data.gyroscope }
        : data.grade;
    formData.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            grade,
            time: data.time,
            variant: data.variant,
          }),
        ],
        { type: "application/json" }
      )
    );

    axios
      .post("/api/imu/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((reponse) => {
        setTrajectories(reponse.data);
      });
  };
  console.log(errors);
  return (
    <>
      <div class="page-header">
        <h2>
          <FormattedMessage id="title" />
        </h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="field">
            <label for="attachement">
              <FormattedMessage id="form.trajectory" />
            </label>
            <div className="inputContainer">
              <input
                className="custom-file-input"
                type="file"
                id="file"
                name="attachement"
                {...register("attachement")}
              />
              {errors.attachement && (
                <div className="errorMsg">{errors.attachement.message}</div>
              )}
            </div>
          </div>

          <div className="field">
            <label for="grade">
              <FormattedMessage id="form.grade" />
            </label>
            <div className="inputContainer">
              <Controller
                name="grade"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={gradeOptions}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              {errors.grade && (
                <div className="errorMsg">{errors.grade.message}</div>
              )}
            </div>
          </div>
        </div>
        {grade && grade.id === 4 && (
          <>
            <div className="row grade">
              <div className="grade-title">
                <FormattedMessage id="form.accelerometer" />
              </div>
              <Input
                error={errors.accelerometer?.bias}
                name="accelerometer.bias"
                label="form.bias"
                unit="mg"
                register={register}
              />

              <Input
                error={errors.accelerometer?.noise}
                name="accelerometer.noise"
                label="form.noise"
                unit="°/h"
                register={register}
              />

              <Input
                error={errors.accelerometer?.scale}
                name="accelerometer.scale"
                label="form.scale"
                unit="%"
                register={register}
              />
            </div>
            <div className="row grade">
              <div className="grade-title">
                <FormattedMessage id="form.gyroscope" />
              </div>
              <Input
                error={errors.gyroscope?.bias}
                name="gyroscope.bias"
                label="form.bias"
                unit="°/h"
                register={register}
              />

              <Input
                error={errors.gyroscope?.noise}
                name="gyroscope.noise"
                label="form.noise"
                unit="%"
                register={register}
              />

              <Input
                error={errors.gyroscope?.scale}
                name="gyroscope.scale"
                label="form.scale"
                unit="°/√Hz"
                register={register}
              />
            </div>
          </>
        )}
        <div className="row">
          <div className="field">
            <label for="time">
              <FormattedMessage id="form.time" />
            </label>
            <div className="inputContainer">
              <input
                className={errors.time ? "error" : ""}
                type="text"
                id="time"
                name="time"
                {...register("time")}
              />
              {errors.time && (
                <div className="errorMsg">{errors.time.message}</div>
              )}
            </div>
          </div>
          <div className="field">
            <label for="variant">
              <FormattedMessage id="form.variant" />
            </label>
            <div className="inputContainer">
              <input
                className={errors.variant ? "error" : ""}
                type="text"
                id="variant"
                name="variant"
                {...register("variant")}
              />
              {errors.variant && (
                <div className="errorMsg">{errors.variant.message}</div>
              )}
            </div>
          </div>
        </div>
        <div className="row submit">
          <button type="submit">
            <span>
              <LoadIcon className="btn-icon" />
            </span>
            <FormattedMessage id="form.generate" />
          </button>
        </div>
      </form>
      <div className="tableContainer">
        {!!trajectories.length && (
          <>
            <div>
              <button>
                <span>
                  <DownLoadIcon className="btn-icon" />
                </span>
                <FormattedMessage id="form.download" />
              </button>
            </div>
            <TrajectoryTable trajectoryList={trajectories} />
          </>
        )}
      </div>
    </>
  );
};
export default IMUForm;
