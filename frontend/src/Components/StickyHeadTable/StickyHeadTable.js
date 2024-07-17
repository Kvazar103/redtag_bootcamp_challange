import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {CSVLink} from 'react-csv';

import AuthService from '../../services/auth.service';

const columns = [
  { id: 'id', label: 'Id', minWidth: 50 },
  { 
    id: 'title', 
    label: 'Title', 
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'language',
    label: 'Language',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'genre',
    label: 'Genre',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'date_of_creation',
    label: 'Date of creation',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'author',
    label: 'Author',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'author_actions',
    label: 'Delete Author',
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  }
];

function createData(id, title, language, genre, date_of_creation, actions, author, author_actions) {
  return { id, title, language, genre, date_of_creation, actions, author, author_actions };
}

export default function StickyHeadTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [dataToExport,setDataToExport]=useState([]);
  const [deletionStatus, setDeletionStatus] = useState(false);
  const [deletionAuthorStatus, setDeletionAuthorStatus] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  let token = JSON.parse(localStorage.getItem('token'));
  let config = {
    headers: {
      Authorization: `${token}`
    }
  };
  let navigate = useNavigate();

  const customer = AuthService.getCurrentUser();

  function actions(data) {
    return (
      <div>
        <IconButton onClick={() => deleteBook(customer.id, data.id, data.author.id)} aria-label="delete">
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={() => updateBook(customer.id, data)} aria-label="edit">
          <EditIcon />
        </IconButton>
      </div>
    );
  }

  function authorActions(authorId) {
    return (
      <div>
        <IconButton onClick={() => deleteAuthor(authorId)} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </div>
    );
  }

  function deleteBook(customerId, bookId, authorId) {
    AuthService.deleteBook(customerId, bookId, authorId)
      .then(() => {
        setDeletionStatus(!deletionStatus);
        navigate("/headTable");
      });
  }

  function deleteAuthor(authorId) {
    AuthService.deleteAuthor(authorId, customer.id)
      .then(() => {
        setDeletionAuthorStatus(!deletionAuthorStatus);
      });
  }

  function updateBook(customerId, book) {
    navigate("/updateBook", { state: { customerId, book } });
  }

  useEffect(() => {
    async function fetchData() {
      const data = await AuthService.getAllBooks(config);
      const books = data.data;
      let supBook = [];
      for (let book of books) {
        const author = await AuthService.getAuthorById(Object.keys(book)[0]);
        let author2 = author.data;
        let book2 = Object.values(book)[0];
        book2.author = author2;
        supBook.push(book2);
      }
      const newBooks = supBook.reverse();
      const csvData =[
        ['id', 'title', 'language','genre','date_of_creation','author'] 
      ];
      const formattedData = newBooks.map((country) =>
        createData(country.id, country.title, country.language, country.genre, country.dateOfCreation, actions(country), ((country.author.name)+" "+(country.author.surname)), authorActions(country.author.id))
      );

      newBooks.map((country)=>
        csvData.push([country.id,country.title,country.language,country.genre,country.dateOfCreation,((country.author.name)+" "+(country.author.surname))])
      )
    
      setRows(formattedData);
      setDataToExport(csvData);
    }
    fetchData();
  }, [deletionStatus, deletionAuthorStatus]);

  const handleSort = (columnId) => {
    const newDirection = sortConfig.key === columnId && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: columnId, direction: newDirection });

    const sortedRows = [...rows].sort((a, b) => {
      const aValue = a[columnId]?.props?.children || a[columnId];
      const bValue = b[columnId]?.props?.children || b[columnId];
      
      if (aValue > bValue) return newDirection === 'asc' ? 1 : -1;
      if (aValue < bValue) return newDirection === 'asc' ? -1 : 1;
      return 0;
    });
    setRows(sortedRows);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <CSVLink  data={dataToExport}>Export</CSVLink>
      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth ,cursor:"pointer"}}
                  onClick={() => handleSort(column.id)}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
