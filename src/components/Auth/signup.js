import React, { useEffect, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Box, TextField, Button, Typography, Alert, Select,MenuItem, Stack, Divider } from '@mui/material';
import axios from 'axios';
import AlertTitle from '@mui/material/AlertTitle';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [data,setData]  = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const navigate = useNavigate();
  const handleEditOpen = (row) => {
    // Implement edit functionality here
    setEditData(row);
    setOpenEdit(true);

    

  };

  useEffect(() => {
    dataListing();
}, []);

const dataListing  = async () => {
    try {
        const res = await axios.get('http://localhost:8000/api/auth/users');
        if(res.data.success){
            console.log(res.data.users);
            setData(res.data.users);
        }
        else{
            console.error("Failed to fetch users");
        }


    }
    catch (err) {
        console.error(err);
    }
}
// const filtered = data.filter(item => item !== null && item.data);
const editSave = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.put(`http://localhost:8000/api/auth/users/${editData._id}`, {
            role: editData.role
        });
        if(res.data.success){
            setOpenEdit(false);
            dataListing();
            alert(res.data.msg);
        }
        else{
            console.error("Failed to update user: ",res.data.msg);
        }
    }
    catch (err) {
        console.error(err);
    }};
    const handleDeleteConfirm = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.delete(`http://localhost:8000/api/auth/users/${deleteId}`);
        if(res.data.success){
            setOpenDelete(false);
            dataListing();
            alert(res.data.msg);
        }
        else{
            console.error("Failed to delete user: ",res.data.msg);
        }
    }
    catch (err) {
        console.error(err);
    }};
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:8000/api/auth/signup', {
        email,
        password,
        name,
        role
      });

      if (res.data.success) {
        // Save token in localStorage
        // localStorage.setItem('token', res.data.token);

        // Redirect to home page
        // navigate('/');
        alert('User created successfully');
        setEmail('');
        setPassword('');
        setName('');
        setRole('');
        dataListing();
      } else {
        setError(res.data.msg || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  return (
  <Stack sx={{width:'100%',height:"200vh"}} >
    <Typography variant="h5" mb={3} mt={3} >
          Create User Account
        </Typography>
        
        <Box
        component="form"
        onSubmit={handleLogin}
        fullWidth
        sx={{
          p: 4,
          bgcolor: 'white',
          borderRadius: 1,
          boxShadow: 3,
          width: '100%',
        //   maxWidth: 400,
        }}
      >
        

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{pt:1}}
          margin="normal"
          required
        />
         <TextField
          label="Name"
          type="text"
          sx={{pt:1}}
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
      <Select
        labelId="role-label"
        value={role}
        fullWidth
        // margin='normal'
  sx={{
    color: 'grey.700',
    mt: 2,
    mb: 0,
  }}        onChange={(e) => setRole(e.target.value)}
        displayEmpty
        required
      >
        <MenuItem value="" disabled>
          Select Role
        </MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="user">User</MenuItem>
      </Select>

        <TextField
          label="Password"
          type="password"
          sx={{pt:1}}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />


        <Button
          type="submit"
          

          fullWidth
          sx={{ mt: 3,backgroundColor: '#008F4C', color: 'white' }}
        >
          Create Account
        </Button>
        </Box>
        <Divider sx={{mt:4}} />
        <Typography variant="h5" mt={3} >
            User Accounts
        </Typography>
        <Box sx={{textAlign:'center', mt:3,width:"100%",minHeight:'40px',backgroundColor:'white', boxShadow: 3, p:2, borderRadius:1}}>
            {/* List of user accounts will go here */}
             <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role.slice(0,1).toUpperCase()+row.role.slice(1)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      style={{ backgroundColor: "#008F4C", color: "#fff" }}
                      size="small"
                      onClick={() => handleEditOpen(row)}
                    >
                      <EditIcon />
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => {
                        setDeleteId(row._id);
                        setOpenDelete(true);
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Box>
      
        
        
              {/* DELETE CONFIRM MODAL */}
              <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
                <Box  sx={{ width: 300, p: 3, background: "#fff", mt: "20%", mx: "auto", borderRadius: 2 }}>
                  <Typography>Are you sure you want to delete?</Typography>
        
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button fullWidth variant="outlined" onClick={() => setOpenDelete(false)}>
                      Cancel
                    </Button>
        
                    <Button fullWidth color="error" variant="contained" onClick={handleDeleteConfirm}>
                      Delete
                    </Button>
                  </Stack>
                </Box>
              </Modal>
              <Modal open={openEdit} onClose={()=>setOpenEdit(false)}>
                <Box component={"form"} onSubmit={editSave} sx={{ width: 400, p: 3, background: "#fff", mt: "10%", mx: "auto", borderRadius: 2 }}>
                  <Typography variant="h6" mb={2}>Edit User</Typography>
                  {editData && (
<Select
        labelId="role-label"
        value={editData.role}
        fullWidth
        margin='normal'
        onChange={(e) => 
            setEditData({
            ...editData,
             role:e.target.value
            }
        )}
        displayEmpty
        required
      >
        <MenuItem value="" disabled>
          <em>Select Role</em>
        </MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="user">User</MenuItem>
      </Select>
                  )}
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button type="submit" fullWidth sx={{backgroundColor:"#008F4C",color:"white"}}>
                      Update
                    </Button> <Button fullWidth variant="outlined" onClick={() => setOpenEdit(false)}>
                      Close
                    </Button>
                  </Stack>
                </Box>
              </Modal>
  </Stack>
  );
}
