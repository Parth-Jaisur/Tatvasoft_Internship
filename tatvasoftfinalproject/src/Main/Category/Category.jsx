import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  TextField,
  Paper,
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import categoryService from "../../Service/category.service";
import ConfirmationDialog from "../../Components/ComfirmationDialog";
import { toast } from "react-toastify";
import { defaultFilter, RecordsPerPage } from "../../Constant/constant";
import Shared from "../../Utils/Shared";
import "./Category.css";

export const Category = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [filters, setFilters] = useState(defaultFilter);
  const [categoryRecord, setCategoryRecord] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const navigate = useNavigate();

  //get all categories
  useEffect(() => {
    getAllCategories();
  }, []);

  //list all categories
  const getAllCategories = async () => {
    await categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res);
      }
    });
  };

  //search category
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllCategories({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  //search all categories
  const searchAllCategories = (filters) => {
    categoryService.getAll(filters).then((res) => {
      setCategoryRecord(res);
    });
  };

  const columns = [
    { id: "category", label: "Categories", minWidth: 100 },
  ];

  const handleDelete = (id) => {
    categoryService
      .deleteCategory(selectedId)
      .then((res) => {
        toast.success(Shared.messages.DELETE_SUCCESS);
        setOpen(false);
        setFilters({ ...filters, pageIndex: 1 });
      })
      .catch((e) => toast.error(Shared.messages.DELETE_FAIL));
  };

  return (
    <div className="category-container">
      <h1 className="category-title">Categories</h1>
      <div className="category-buttons">
        <TextField
          id="text"
          name="text"
          placeholder="Search..."
          variant="outlined"
          inputProps={{ className: "small" }}
          onChange={(e) => {
            setFilters({ ...filters, keyword: e.target.value, pageIndex: 1 });
          }}
        />
        <div className="buttons-container">
          <Button
            type="button"
            className="btn pink-btn"
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => navigate("/add-category")}
          >
            Add
          </Button>
        </div>
      </div>
      <TableContainer component={Paper} className="category-table-container">
        <Table aria-label="Categories Table" className="MuiTable-root">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryRecord?.items?.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    disableElevation
                    onClick={() => {
                      navigate(`/edit-category/${row.id}`);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="delete"
                    variant="contained"
                    color="secondary"
                    disableElevation
                    onClick={() => {
                      setOpen(true);
                      setSelectedId(row.id ?? 0);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!categoryRecord.items.length && (
              <TableRow className="TableRow">
                <TableCell colSpan={5} className="TableCell">
                  <Typography align="center" className="noDataText">
                    No Categories
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={RecordsPerPage}
        component="div"
        count={categoryRecord.totalItems}
        rowsPerPage={filters.pageSize || 0}
        page={filters.pageIndex - 1}
        onPageChange={(e, newPage) => {
          setFilters({ ...filters, pageIndex: newPage + 1 });
        }}
        onRowsPerPageChange={(e) => {
          setFilters({
            ...filters,
            pageIndex: 1,
            pageSize: Number(e.target.value),
          });
        }}
      />
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => handleDelete(selectedId)}
        title="Delete category"
        description="Are you sure you want to delete this category?"
      />
    </div>
  );
};
