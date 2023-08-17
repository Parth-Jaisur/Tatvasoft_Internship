import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Input,
  Typography,
} from "@material-ui/core";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import userService from "../../Service/user.service";
import { toast } from "react-toastify";
import ValidateMessage from "../../Components/ValidationMsg";
import Shared from "../../Utils/Shared";
import { useAuthContext } from "../../Context/auth";

const EditUser = () => {
  
  const initialValues = {
    id: 0,
    email: "",
    lastName: "",
    firstName: "",
    roleId: 3,
  };
  const authContext = useAuthContext();
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    if (id) {
      getUserById();
    }
  }, [id]);

  useEffect(() => {
    if (user && roles.length) {
      const roleId = roles.find((role) => role.name === user?.role)?.id;
      setInitialValueState({
        id: user.id,
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        roleId,
        password: user.password,
      });
    }
  }, [user, roles]);
  const validateSchema = Yup.object().shape({
    firstName: Yup.string().required("First-Name is Required"),
    lastName: Yup.string().required("Last-Name is Required"),
    email: Yup.string()
      .email("Invalid Email Address")
      .required("First-Name is Required"),
    roleId: Yup.number().required("Please Enter role"),
  });

  const getRoles = () => {
    userService.getAllRoles().then((res) => {
      if (res) {
        setRoles(res);
      }
    });
  };

  const getUserById = () => {
    userService.getById(Number(id)).then((res) => {
      if (res) {
        setUser(res);
      }
    });
  };

  const handleSubmit = (values) => {
    const updatedValue = {
      ...values,
      role: roles.find((r) => r.id === values.roleId).name,
    };
    userService
      .update(updatedValue)
      .then((res) => {
        if (res) {
          toast.success(Shared.messages.UPDATED_SUCCESS);
          navigate("/user");
        }
      })
      .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
  };

  return (
    <div className="add-book-form-container">
      <Typography variant="h1"> Edit User</Typography>
      <Formik
        initialValues={initialValueState}
        validationSchema={validateSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
        validator={() => ({})}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              id="first-name"
              name="firstName"
              label="First Name *"
              variant="outlined"
              inputProps={{ className: "small" }}
              value={values.firstName}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <ValidateMessage
              message={errors.firstName}
              touched={touched.name}
            />

            <TextField
              id="last-name"
              name="lastName"
              label="Last Name *"
              variant="outlined"
              inputProps={{ className: "small" }}
              value={values.lastName}
              onBlur={handleBlur}
              onChange={handleChange}
            />

            <ValidateMessage message={errors.lastName} touched={touched.name} />
            <TextField
              id="email"
              name="email"
              label="email *"
              variant="outlined"
              inputProps={{ className: "small" }}
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <ValidateMessage message={errors.email} touched={touched.name} />
            {values.id !== authContext.user.id && (
                  <div className="form-col">
                    <FormControl
                      variant="outlined"
                      disabled={values.id === authContext.user.id}
                    >
                      <InputLabel htmlFor="select">Roles</InputLabel>
                      <Select
                        name="roleId"
                        id={"roleId"}
                        onChange={handleChange}
                        disabled={values.id === authContext.user.id}
                        value={values.roleId}
                      >
                        {roles.length > 0 &&
                          roles.map((role) => (
                            <MenuItem value={role.id} key={"name" + role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
            <div className="button-container">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disableElevation
              >
                Save
              </Button>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate("/book");
                }}
                disableElevation
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default EditUser;
