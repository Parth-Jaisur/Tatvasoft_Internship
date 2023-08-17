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
import { useNavigate } from "react-router-dom";
import { defaultFilter, RecordsPerPage } from "../../Constant/constant";
import ConfirmationDialog from "../../Components/ComfirmationDialog";
import { toast } from "react-toastify";
import Shared from "../../Utils/Shared";
import { useAuthContext } from "../../Context/auth";
import userService from "../../Service/user.service";
import './user.css'

export const User = () => {
  const authContext = useAuthContext();
  const [filters, setFilters] = useState(defaultFilter);
  const [UserList, setUserList] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const navigate = useNavigate();

  const getAllUsers = async () => {
    await userService.getAllUsers(filters).then((res) => {
      if (res) {
        setUserList(res);
      }
    });
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      getAllUsers({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const columns = [
    { id: "firstName", label: "First-Name", minWidth: 100 },
    { id: "lastName", label: "Last-Name", minWidth: 100 },
    { id: "email", label: "Email", minWidth: 170 },
    { id: "roleName", label: "Role", minWidth: 130 },
  ];

  const handleDelete = async () => {
    await userService
      .deleteUser(selectedId)
      .then((res) => {
        if (res) {
          toast.success(Shared.messages.DELETE_SUCCESS);
          setOpen(false);
          setFilters({ ...filters });
        }
      })
      .catch((e) => toast.error(Shared.messages.DELETE_FAIL));
  };

  return (
    <div>
      <h1>Users</h1>
      <div>
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
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="Books Table">
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
            {UserList?.items?.map((row, index) => (
              <TableRow key={`${index}-${row.id}-${row.email}`}>
                <TableCell>{row.firstName}</TableCell>
                <TableCell>{row.lastName}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    disableElevation
                    onClick={() => {
                      navigate(`/edit-user/${row.id}`);
                    }}
                  >
                    Edit
                  </Button>
                  {row.id !== authContext.user.id && (
                      <Button
                        type="button"
                        className="btn pink-btn"
                        variant="contained"
                        color="primary"
                        disableElevation
                        onClick={() => {
                          setOpen(true);
                          setSelectedId(row.id ?? 0);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
            {!UserList?.items?.length && (
              <TableRow className="TableRow">
                <TableCell colSpan={5} className="TableCell">
                  <Typography align="center" className="noDataText">
                    No Users
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
        count={UserList?.totalItems || 0}
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
          title="Delete user"
          description={Shared.messages.USER_DELETE}
        />
    </div>
  );
};
