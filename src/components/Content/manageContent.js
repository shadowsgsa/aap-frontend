import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function ManageContentComp() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // Edit modal state
  const [openEdit, setOpenEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Delete confirmation modal
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const user = localStorage.getItem('role');
  const isAdmin = user && user.toLowerCase() === 'admin';

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch("http://localhost:8000/api/assessment/");
    if (response.ok) {
      const json = await response.json();
      setData(json);
    }
  };

  const handleEditOpen = (row) => {
    setEditItem(JSON.parse(JSON.stringify(row)));
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    await fetch(`http://localhost:8000/api/assessment/${editItem._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editItem),
    });

    setOpenEdit(false);
    getData();
  };

  const handleDeleteConfirm = async () => {
  try {
    const response = await fetch(`http://localhost:8000/api/assessment/${deleteId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Delete failed:", data.error || data.message);
      alert("❌ Failed to delete assessment");
      return;
    }

    alert("🗑️ Assessment deleted successfully!");
    setOpenDelete(false);
    getData(); // refresh list
  } catch (err) {
    console.error("Error deleting assessment:", err);
    alert("❌ Something went wrong!");
  }
};


  const filtered = data.filter((row) => {
    const q = search.toLowerCase();
    return (
      row.district.toLowerCase().includes(q) ||
      row.monthName.toLowerCase().includes(q)
    );
  });

  // ---------------------------------------------------------
  //        PDF GENERATION — EXACT STYLING LIKE IMAGE
  // ---------------------------------------------------------
const generatePDF = () => {
const doc = new jsPDF("p", "mm", "a4");

doc.setFontSize(14);
doc.text("Monthly Assessment Report", 14, 14);

const tableData = [];

filtered.forEach((row, i) => {
const age23 = row.data.age_06_to_23_months;
const age59 = row.data.age_24_to_59_months;
// helper placeholder cell
// const empty = { content: "", styles: { cellWidth: 0 } };

// ROW 1: 06–23 Male
const row1Values = [
  age23.male.samWithComplication,
  age23.male.samWithoutComplication,
  age23.male.mam,
  age23.male.normal
];
const row1Total = row1Values.reduce((a,b) => Number(a)+Number(b), 0);
tableData.push([
  { content: i + 1, rowSpan: 4, styles: { valign: 'middle' } },
  { content: row.district, rowSpan: 4, styles: { valign: 'middle' } },
  { content: row.monthName, rowSpan: 4, styles: { valign: 'middle' } },
  "06–23 months",
  "Male",
  ...row1Values,
  row1Total
]);

// ROW 2: 06–23 Female
const row2Values = [
  age23.female.samWithComplication,
  age23.female.samWithoutComplication,
  age23.female.mam,
  age23.female.normal
];
const row2Total = row2Values.reduce((a,b) => Number(a)+Number(b), 0);
tableData.push([
  "06–23 months",
  "Female",
  ...row2Values,
  row2Total
]);

// ROW 3: 24–59 Male
const row3Values = [
  age59.male.samWithComplication,
  age59.male.samWithoutComplication,
  age59.male.mam,
  age59.male.normal
];
const row3Total = row3Values.reduce((a,b) => Number(a)+Number(b), 0);
tableData.push([
  "24–59 months",
  "Male",
  ...row3Values,
  row3Total
]);

// ROW 4: 24–59 Female
const row4Values = [
  age59.female.samWithComplication,
  age59.female.samWithoutComplication,
  age59.female.mam,
  age59.female.normal
];
const row4Total = row4Values.reduce((a,b) => Number(a)+Number(b), 0);
tableData.push([
  "24–59 months",
  "Female",
  ...row4Values,
  row4Total
]);

// ROW 5: TOTAL per column (sum vertically)

});

autoTable(doc, {
startY: 20,
head: [[
"ID", "District", "Month",
"Age Group", "Gender",
"SAM w/ Comp", "SAM w/o Comp",
"MAM", "Normal", "Total"
]],
body: tableData,
theme: "grid",
styles: { fontSize: 9, valign: 'middle' },
headStyles: { fillColor: [60, 60, 60], textColor: 255 },
});

doc.save("Assessment_Report.pdf");
};





  // ---------------------------------------------------------

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Manage Content</Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            style={{ backgroundColor: "#dc2500", color: "#fff", padding: 13 }}
            onClick={generatePDF}
          >
            <PictureAsPdfIcon style={{ marginRight: 8 }} /> Generate Report
          </Button>

          <FormControl sx={{ width: { xs: "100%", md: "25ch" } }}>
            <OutlinedInput
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              startAdornment={
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
      </Stack>

      <Box
        sx={{
          width: "100%",
          mt: 5,
          backgroundColor: "#fff",
          boxShadow: "0px 0px 3px #ccc",
          borderRadius: 1,
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>ID</TableCell>
              <TableCell>District</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>06-23M M SAM W</TableCell>
              <TableCell>06-23M M SAM WO</TableCell>
              <TableCell>06-23M F SAM W</TableCell>
              <TableCell>06-23M F SAM WO</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((row, index) => (
              <TableRow key={row._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.district}</TableCell>
                <TableCell>{row.monthName}</TableCell>

                <TableCell>{row.data.age_06_to_23_months.male.samWithComplication}</TableCell>
                <TableCell>{row.data.age_06_to_23_months.male.samWithoutComplication}</TableCell>
                <TableCell>{row.data.age_06_to_23_months.female.samWithComplication}</TableCell>
                <TableCell>{row.data.age_06_to_23_months.female.samWithoutComplication}</TableCell>

                <TableCell>{row.totals.totalChildrenAssessed}</TableCell>

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

      {/* EDIT MODAL */}
     <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
{
  isAdmin ? (
      <Box
    sx={{
      width: 500,
      p: 3,
      background: "#fff",
      mt: "5%",
      mx: "auto",
      borderRadius: 2,
      maxHeight: "90vh",
      overflowY: "auto",
    }}
  >
    <Typography variant="h6">Edit Record</Typography>

    {editItem && (
      <>
        {/* District */}
        <TextField
          fullWidth
          label="District"
          sx={{ mt: 2 }}
          value={editItem.district}
          onChange={(e) =>
            setEditItem({ ...editItem, district: e.target.value })
          }
        />

        {/* Month */}
        <TextField
          fullWidth
          label="Month"
          sx={{ mt: 2 }}
          value={editItem.monthName}
          onChange={(e) =>
            setEditItem({ ...editItem, monthName: e.target.value })
          }
        />

        {/* Male - SAM With Complication */}
        <TextField
          fullWidth
          label="Male - SAM With Complication"
          sx={{ mt: 2 }}
          type="number"
          value={editItem.data.age_06_to_23_months.male.samWithComplication}
          onChange={(e) =>
            setEditItem({
              ...editItem,
              data: {
                ...editItem.data,
                age_06_to_23_months: {
                  ...editItem.data.age_06_to_23_months,
                  male: {
                    ...editItem.data.age_06_to_23_months.male,
                    samWithComplication: e.target.value,
                  },
                },
              },
            })
          }
        />

        {/* Male - SAM Without Complication */}
        <TextField
          fullWidth
          label="Male - SAM Without Complication"
          sx={{ mt: 2 }}
          type="number"
          value={editItem.data.age_06_to_23_months.male.samWithoutComplication}
          onChange={(e) =>
            setEditItem({
              ...editItem,
              data: {
                ...editItem.data,
                age_06_to_23_months: {
                  ...editItem.data.age_06_to_23_months,
                  male: {
                    ...editItem.data.age_06_to_23_months.male,
                    samWithoutComplication: e.target.value,
                  },
                },
              },
            })
          }
        />

        {/* Female - SAM With Complication */}
        <TextField
          fullWidth
          label="Female - SAM With Complication"
          sx={{ mt: 2 }}
          type="number"
          value={editItem.data.age_06_to_23_months.female.samWithComplication}
          onChange={(e) =>
            setEditItem({
              ...editItem,
              data: {
                ...editItem.data,
                age_06_to_23_months: {
                  ...editItem.data.age_06_to_23_months,
                  female: {
                    ...editItem.data.age_06_to_23_months.female,
                    samWithComplication: e.target.value,
                  },
                },
              },
            })
          }
        />

        {/* Female - SAM Without Complication */}
        <TextField
          fullWidth
          label="Female - SAM Without Complication"
          sx={{ mt: 2 }}
          type="number"
          value={editItem.data.age_06_to_23_months.female.samWithoutComplication}
          onChange={(e) =>
            setEditItem({
              ...editItem,
              data: {
                ...editItem.data,
                age_06_to_23_months: {
                  ...editItem.data.age_06_to_23_months,
                  female: {
                    ...editItem.data.age_06_to_23_months.female,
                    samWithoutComplication: e.target.value,
                  },
                },
              },
            })
          }
        />

        {/* Total Children Assessed */}
        <TextField
          fullWidth
          label="Total Children Assessed"
          sx={{ mt: 2 }}
          type="number"
          value={editItem.totals.totalChildrenAssessed}
          onChange={(e) =>
            setEditItem({
              ...editItem,
              totals: {
                ...editItem.totals,
                totalChildrenAssessed: e.target.value,
              },
            })
          }
        />

        <Button
          fullWidth
          
          sx={{ mt: 3, backgroundColor: "#008F4C",color: "#fff" }}
          onClick={handleEditSave}
        >
          Save Changes
        </Button>
      </>
    )}
  </Box>
  ) : (
    <Box sx={{ width: 300, p: 3, background: "#fff", mt: "20%", mx: "auto", borderRadius: 2 }}>
      <Typography>You do not have permission to edit records.</Typography>
    </Box>
  )
}
</Modal>


      {/* DELETE CONFIRM MODAL */}
      <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
        {isAdmin ? (
          <Box sx={{ width: 300, p: 3, background: "#fff", mt: "20%", mx: "auto", borderRadius: 2 }}>
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
        ): (
          <Box sx={{ width: 300, p: 3, background: "#fff", mt: "20%", mx: "auto", borderRadius: 2 }}>
      <Typography>You do not have permission to delete records.</Typography>
    </Box>
        )
      }

      </Modal>
    </Stack>
  );
}
