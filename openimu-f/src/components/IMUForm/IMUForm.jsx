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
import * as yup from "yup";
const IMUForm = () => {
  const schema = yup
    .object({
      attachement: yup
        .mixed()
        .required("Le fichier est requis")
        .test(
          "is-txt",
          "The file must be a .txt",
          (file) => file[0] && file[0].name && file[0].name.endsWith(".txt")
        ),
      time: yup.string().required("required fields"),
      variant: yup.string().required("required fields"),
    })
    .required();

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

    const { biais, nose, scale } =
      data.grade.id !== 2 ? { ...data.grade } : { data };
    formData.append("biais", biais);
    formData.append("nose", nose);
    formData.append("scale", scale);
    formData.append("time", data.time);
    formData.append("variant", data.variant);
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

  return (
    <>
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
        {grade && grade.id === 2 && (
          <div className="row grade">
            <div className="field">
              <label for="biais">
                <FormattedMessage id="form.biais" />
              </label>
              <div className="inputContainer">
                <input
                  className={errors.biais ? "error" : ""}
                  type="text"
                  id="biais"
                  {...register("biais")}
                />
                {errors.biais && (
                  <div className="errorMsg">{errors.biais.message}</div>
                )}
              </div>
            </div>
            <div className="field">
              <label for="nose">
                <FormattedMessage id="form.nose" />
              </label>
              <div className="inputContainer">
                <input type="text" id="nose" {...register("nose")} />
                {errors.nose && (
                  <div className="errorMsg">{errors.nose.message}</div>
                )}
              </div>
            </div>
            <div className="field">
              <label for="scale">
                <FormattedMessage id="form.scale" />
              </label>
              <div className="inputContainer">
                <input type="text" id="scale" {...register("scale")} />
                {errors.scale && (
                  <div className="errorMsg">{errors.scale.scale}</div>
                )}
              </div>
            </div>
          </div>
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
