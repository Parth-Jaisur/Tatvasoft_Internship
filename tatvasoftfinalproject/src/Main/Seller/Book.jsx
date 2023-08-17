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
  Paper,
  TextField,
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import bookService from "../../Service/book.service";
import { defaultFilter, RecordsPerPage } from "../../Constant/constant";
import categoryService from "../../Service/category.service";
import ConfirmationDialog from "../../Components/ComfirmationDialog";
import { toast } from "react-toastify";
import Shared from "../../Utils/Shared";


export const Book = () => {
  const [filters, setFilters] = useState(defaultFilter);
  const [bookRecords, setBookRecords] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    await categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res);
      }
    });
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllBooks({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllBooks = (filters) => {
    bookService.getAll(filters).then((res) => {
      setBookRecords(res);
    });
  };

  const columns = [
    { id: "name", label: "Book Name", minWidth: 100 },
    { id: "price", label: "Price", minWidth: 100 },
    { id: "category", label: "Category", minWidth: 100 },
  ];

  const handleDelete = (id) => {
    bookService
      .deleteBook(selectedId)
      .then((res) => {
        toast.success(Shared.messages.DELETE_SUCCESS);
        setOpen(false);
        setFilters({ ...filters, pageIndex: 1 });
      })
      .catch((e) => toast.error(Shared.messages.DELETE_FAIL));
  };

  return (
    <div>
      <h1>Books</h1>
      <div className="container">
       
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
       
        {/* <div class="add-button"> */}
        <Button
          type="button"
          className="btn pink-btn"
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => navigate("/add-book")}
        >
          Add Book
        </Button>
        {/* </div> */}
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="Books Table" className="books-table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookRecords?.items?.map((row, index) => (
              <TableRow key={row.id} className="books-table-row">
                <TableCell className="books-table-cell">{row.name}</TableCell>
                <TableCell className="books-table-cell">{row.price}</TableCell>
                <TableCell className="books-table-cell">
                  {categories.find((c) => c.id === row.categoryId)?.name}
                </TableCell>
                <TableCell className="books-table-cell">
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    disableElevation
                    onClick={() => {
                      navigate(`/edit-book/${row.id}`);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="delete"
                    disableElevation
                    onClick={() => {
                      setOpen(true);
                      setSelectedId(row.id ?? 0);
                    }}
                    variant="contained"
                    color="secondary"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!bookRecords.items.length && (
              <TableRow className="TableRow">
                <TableCell colSpan={5} className="TableCell">
                  <Typography align="center" className="noDataText">
                    No Books
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
        count={bookRecords.totalItems}
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
        onConfirm={() => handleDelete()}
        title="Delete book"
        description="Are you sure you want to delete this book?"
      />
    </div>
  );
};
