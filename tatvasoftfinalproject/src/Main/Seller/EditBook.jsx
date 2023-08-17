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
import "./Book.css";
import { Formik } from "formik";
import categoryService from "../../Service/category.service";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import bookService from "../../Service/book.service";
import { toast } from "react-toastify";
import ValidateMessage from "../../Components/ValidationMsg";
import Shared from "../../Utils/Shared";

const EditBook = () => {
  const initialValues = {
    name: "",
    price: "",
    categoryId: 0,
    description: "",
    base64image: "",
  };
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) getBookById();
    categoryService.getAll().then((res) => {
      setCategories(res);
    });
  }, [id]);

  const validateSchema = Yup.object().shape({
    name: Yup.string().required("Please Enter Name of book"),
    description: Yup.string()
      .required("Please Enter Description")
      .max(200, "maximum 200 words are required"),
    categoryId: Yup.number()
      .min(1, "Category is Required")
      .required("Category is required"),
    price: Yup.number().required("Please Enter Price"),
    base64image: Yup.string().required("Please ENter Image"),
  });

  const getBookById = () => {
    bookService.getById(Number(id)).then((res) => {
      setInitialValueState({
        id: res.id,
        name: res.name,
        price: res.price,
        categoryId: res.categoryId,
        description: res.description,
        base64image: res.base64image,
      });
    });
  };

  const handleSubmit = (values) => {
    bookService
      .save(values)
      .then((res) => {
        toast.success(
          values.id
            ? Shared.messages.UPDATED_SUCCESS
            : "Record Created Successfully"
        );
        navigate("/book");
      })
      .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
  };

  const onSelectFile = (e, setFieldValue, setFieldError) => {
    const files = e.target.files;
    if (files?.length) {
      const fileSelected = e.target.files[0];
      const fileNameArray = fileSelected.name.split(".");
      const extension = fileNameArray.pop();
      if (["png", "jpg", "jpeg"].includes(extension?.toLowerCase())) {
        if (fileSelected.size > 1000000) {
          toast.error("File size must be less then 50KB");
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(fileSelected);
        reader.onload = function () {
          setFieldValue("base64image", reader.result);
        };
        reader.onerror = function (error) {
          throw error;
        };
      } else {
        toast.error("only jpg,jpeg and png files are allowed");
      }
    } else {
      setFieldValue("base64image", "");
    }
  };

  return (
    <div className="add-book-form-container">
      <Typography variant="h1">{id ? "Edit" : "Add"} Book</Typography>
      <Formik
        initialValues={initialValueState}
        validationSchema={validateSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setValues,
          setFieldError,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              id="title"
              name="name"
              label="Book Title *"
              variant="outlined"
              inputProps={{ className: "small" }}
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <ValidateMessage message={errors.name} touched={touched.name} />
            <FormControl>
              <InputLabel htmlFor="select">Category *</InputLabel>
              <Select
                name={"categoryId"}
                id={"category"}
                onChange={handleChange}
                value={values.categoryId}
              >
                {categories?.map((rl) => (
                  <MenuItem value={rl.id} key={"category" + rl.id}>
                    {rl.name}
                  </MenuItem>
                ))}
              </Select>
              <ValidateMessage
                message={errors.categoryId}
                touched={touched.categoryId}
              />
            </FormControl>
            <TextField
              label="Price"
              type={"number"}
              name="price"
              variant="outlined"
              onBlur={handleBlur}
              value={values.price}
              onChange={handleChange}
            />
            <ValidateMessage message={errors.price} touched={touched.price} />
            <div className="form-col">
              {!values.base64image && (
                <>
                  {" "}
                  <label
                    htmlFor="contained-button-file"
                    className="file-upload-btn"
                  >
                    <Input
                      id="contained-button-file"
                      type="file"
                      inputProps={{ className: "small" }}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        onSelectFile(e, setFieldValue, setFieldError);
                      }}
                    />
                    <Button
                      variant="contained"
                      component="span"
                      className="btn pink-btn"
                    >
                      Upload
                    </Button>
                  </label>
                  <ValidateMessage
                    message={errors.base64image}
                    touched={touched.base64image}
                  />
                </>
              )}
              {values.base64image && (
                <div className="uploaded-file-name">
                  <em>
                    <img src={values.base64image} alt="" />
                  </em>
                  image{" "}
                  <span
                    onClick={() => {
                      setFieldValue("base64image", "");
                    }}
                  >
                    x
                  </span>
                </div>
              )}
            </div>
            <TextField
              label="Description"
              id="description"
              name="description"
              variant="outlined"
              multiline
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <ValidateMessage
              message={errors.description}
              touched={touched.description}
            />
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

export default EditBook;
