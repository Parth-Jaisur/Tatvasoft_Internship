import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import { TextField,
Button,
Select,
MenuItem,
FormControl,
InputLabel,
Grid,
Paper, } from "@material-ui/core";
import * as Yup from "yup";
import ValidateMessage from "../../Components/ValidationMsg";
import { AuthContext, useAuthContext } from "../../Context/auth";
import userService from "../../Service/user.service";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Shared from "../../Utils/Shared";
import './profile.css';

const Profile = () =>{
  const authContext=useAuthContext();
  const {user} = useContext(AuthContext);
  const initialValueState={
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    newPassword: "",
    confirmPassword: "",
  };
  const [updatePassword, setUpdatePassword]=useState(false);
  
  const navigate=useNavigate();

  const handleSubmit = async (values) => {
    const password = values.newPassword ? values.newPassword : user.password;
    delete values.confirmPassword;
    delete values.newPassword;

    const data = Object.assign(user, { ...values, password });
    delete data._id;
    delete data.__v;
    const res = await userService.updateProfile(data);
    if (res) {
      authContext.setUser(res);
      toast.success(Shared.messages.UPDATED_SUCCESS);
      navigate("/");
    }
  };


  const validateSchema = Yup.object().shape({
    firstName: Yup.string().required("First-Name is Required"),
    lastName: Yup.string().required("Last-Name is Required"),
    email: Yup.string()
      .email("Invalid Email Address")
      .required("First-Name is Required"),
    newPassword: Yup.string()
      .required("First-Name is Required")
      .min(8, "Password should be minimum 8 character long")
      .max(10, "Password should be maximum 10 character long"),
    confirmPassword: updatePassword
    ? Yup.string()
        .required("Must required")
        .oneOf([Yup.ref("newPassword")], "Passwords is not match")
    : Yup.string().oneOf([Yup.ref("newPassword")], "Passwords is not match"),
  });


  return(
        <Grid align="Center">
          <Paper elevation={20} className="paper-style">
            <Grid>
              <h2 className="header-style">Update Profile</h2>
            </Grid>
          <Formik
          initialValues={initialValueState}
          validationSchema={validateSchema}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validator={()=>({})}>
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          })=>(
            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-field">
                <TextField
                  fullWidth
                  label="First-Name *"
                  placeholder="Enter First-name"
                  id="first-name"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  
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
                  value={values.lastName}
                />
                <ValidateMessage
                  message={errors.lastName}
                  touched={touched.lastName}
                />
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
                  value={values.email}
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
                  id="newPassword"
                  name="newPassword"
                  onBlur={handleBlur}
                  onChange={(e)=>{
                    e.target.value !== "" ?setUpdatePassword(true) : setUpdatePassword(false);
                    handleChange(e);
                  }}
                  value={values.newPassword}
                />
                <ValidateMessage
                  message={errors.newPassword}
                  touched={touched.newPassword}
                />
              </div>

              <div className="form-field">
                <TextField
                  fullWidth
                  label="Confirm-Password *"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                />
                <ValidateMessage
                  message={errors.confirmPassword}
                  touched={touched.confirmPassword}
                />
              </div>

              <div className="submit-button">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disableElevation
                >
                  Update User
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
      )}
           
            </Formik>
           
          </Paper>
        </Grid>
  );
};

export default Profile;