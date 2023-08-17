import { Grid, Paper, TextField, Button } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import ValidateMessage from "../../Components/ValidationMsg";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../../Service/auth.service";
import "../Forms.css";
import { useAuthContext } from "../../Context/auth";
import {Paths} from "../../Utils/enum"

const initialValues = {
  email: "",
  password: "",
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const authContext = useAuthContext();

  const validateSchema = Yup.object().shape({
    email: Yup.string().required("Please Enter Email").email(),
    password: Yup.string().required("Please Enter Password"),
  });

  const handleSubmit = (data) => {
    authService.login(data).then((res) => {
      toast.success("Login successfully");
      console.log("result", res);
      navigate(Paths.Home);
      authContext.setUser(res);
    });
  };

 

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
        handleSubmit,
        handleChange,
        handleBlur,
      }) => (
        <div align="center">
          <Paper elevation={20} className="paper-style">
            <Grid item xs={12}>
              <h2 className="header-style">Login</h2>
            </Grid>
            <Grid>
              <form onSubmit={handleSubmit} className="form-container">
                <div className="form-field">
                  <TextField
                    fullWidth
                    label="Email *"
                    placeholder="Enter Email"
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
                    placeholder="Enter Password"
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
                <div className=".submit-button">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disableElevation
                    onSubmit={handleSubmit}
                  >
                    Login
                  </Button>
                </div>

                
              </form>
              <div className="Navigate">
                  New to E-BookSeller?
                <NavLink to = {Paths.RegistrationForm}>click</NavLink>
                </div>
            </Grid>
          </Paper>
        </div>
      )}
    </Formik>
  );
};
