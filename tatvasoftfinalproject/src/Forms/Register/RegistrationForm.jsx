import {
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import * as Yup from "yup";
import React from "react";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ValidateMessage from "../../Components/ValidationMsg"
import authService from "../../Service/auth.service";
import "../Forms.css";

export const RegistrationForm = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    roleId: 0,
    password: "",
    cPassword: "",
  };
  const navigate = useNavigate();
  //const [values, setValues] = useState({ initialValues });

  const handleSubmit = (data) => {
    delete data.cPassword;
    authService.create(data).then((res) => {
      navigate("/LoginForm", { state: { data },});
      toast.success("Reistration Successfull");
      //console.log(data);
    });
    //actions.setSubmitting(false);
  };
  
  const validateSchema = Yup.object().shape({
    firstName: Yup.string().required("First-Name is Required"),
    lastName: Yup.string().required("Last-Name is Required"),
    email: Yup.string()
      .email("Invalid Email Address")
      .required("First-Name is Required"),
    password: Yup.string()
      .required("First-Name is Required")
      .min(8, "Password should be minimum 8 character long")
      .max(10, "Password should be maximum 10 character long"),
    cPassword: Yup.string()
      .required("Comfirm password is required")
      .oneOf([Yup.ref("password"), null], "Password do not match"),
    roleId: Yup.number().required("Please Enter role"),
  });

  const roleList = [
    { id: 2, name: "Seller" },
    { id: 3, name: "Buyer" },
  ];

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validateSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <Grid align="Center">
          <Paper elevation={20} className="paper-style">
            <Grid>
              <h2 className="header-style">Register</h2>
            </Grid>

            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-field">
                <TextField
                  fullWidth
                  label="First-Name *"
                  placeholder="Enter First-name"
                  id="first-Name"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <ValidateMessage
                  message={errors.firstName}
                  touched={touched.firstName}
                />
              </div>

              <div className="form-field">
                <TextField
                  fullWidth
                  label="Last-Name *"
                  placeholder="Enter Last-name"
                  id="last-Name"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <ValidateMessage
                  message={errors.lastName}
                  touched={touched.lastName}
                />
              </div>
              <div className="form-field">
                <FormControl fullWidth>
                  <InputLabel htmlFor="select">Roles</InputLabel>
                  <Select
                    name="roleId"
                    id={"roleId"}
                    inputProps={{ className: "small" }}
                    onChange={handleChange}
                    value={values.roleId}
                  >
                    {roleList.length >= 0 &&
                      roleList.map((role) => (
                        <MenuItem value={role.id} key={"name" + role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>

              <div className="form-field">
                <TextField
                  fullWidth
                  label="Email-Address *"
                  placeholder="Enter email"
                  id="email"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <ValidateMessage
                  message={errors.email}
                  touched={touched.email}
                />
              </div>

              <div className="form-field">
                <TextField
                  fullWidth
                  label="Password *"
                  type="password"
                  id="password"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <ValidateMessage
                  message={errors.password}
                  touched={touched.password}
                />
              </div>

              <div className="form-field">
                <TextField
                  fullWidth
                  label="Confirm-Password *"
                  type="password"
                  id="cPassword"
                  name="cPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <ValidateMessage
                  message={errors.cPassword}
                  touched={touched.cPassword}
                />
              </div>

              <div className="submit-button">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disableElevation
                >
                  Register
                </Button>
                <Button
                  className="cancel-button"
                  type="button"
                  variant="contained"
                  disableElevation
                  onClick={()=>navigate('/')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Paper>
        </Grid>
      )}
    </Formik>
  );
};

