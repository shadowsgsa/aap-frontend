import React, { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Select,
  InputLabel,
  MenuItem
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function AgricultureForm() {
  const { dept } = useParams();

  // ---------------- AGRICULTURE FORM ----------------
  const [rows, setRows] = useState([
    {
      sno: 1,
      outputIndicator: "",
      yearlyTarget: "",
      currentMonth: "",
      totalAchievement: "",
      district: "",
      packageA: "",
      packageB: "",
      packageC: "",
    },
  ]);
  // ---------------- LIVESTOCK FORM ----------------
const livestockOptions = [
  { id: 1, description: "Baseline/Selection Villages", target: "200", progress: "ی" },
  { id: 2, description: "Kitchen Garden Demonstrations", target: "200", progress: "ی" },
  { id: 3, description: "Kitchen Garden Kits Distribution", target: "2000", progress: "ی" },
  { id: 4, description: "Farmer Field Schools", target: "100", progress: "ی" },
  { id: 5, description: "Demonstration on Site", target: "350", progress: "0" },
  { id: 6, description: "Social Media Campaign", target: "Monthly Basis", progress: "Monthly Basis" },
];

const progressDescriptions = [
  "Completed",
  "In Progress",
  "Delayed",
  "Not Started",
];

const [livestockRows, setLivestockRows] = useState([
  {
    sno: 1,
    description: "",
    target: "",
    progress: "",
    district: "",
    progressDetails: "",
  }
]);

const addLivestockRow = () => {
  setLivestockRows(prev => [
    ...prev,
    {
      sno: prev.length + 1,
      description: "",
      target: "",
      progress: "",
      district: "",
      progressDetails: "",
    }
  ]);
};

const handleLivestockChange = (index, field, value) => {
  const updated = [...livestockRows];

  if (field === "description") {
    const option = livestockOptions.find(o => o.description === value);
    updated[index].description = value;
    updated[index].target = option?.target || "";
    updated[index].progress = option?.progress || "";
  } else {
    updated[index][field] = value;
  }

  setLivestockRows(updated);
};

const submitLivestock = async () => {
  try {
    const res = await axios.post("http://localhost:8000/api/livestock", {
      rows: livestockRows
    });
    console.log(livestockRows);

    alert(res.data.message || "Livestock data submitted!");
  } catch (err) {
    alert("Error submitting livestock data");
  }
};


  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        sno: prev.length + 1,
        outputIndicator: "",
        yearlyTarget: "",
        currentMonth: "",
        totalAchievement: "",
        district: "",
        packageA: "",
        packageB: "",
        packageC: "",
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleSubmitAgriculture = async () => {
    try {
      // Ensure at least one row is sent

      const res = await axios.post(
        "http://localhost:8000/api/agriculture",
        { rows: rows }
      );

      console.log(res.data);
      alert(res.data.message || "Data Submitted Successfully!");
    } catch (err) {
      console.error(err);
      alert("Error submitting data!");
    }
    console.log(rows);

  };

  const [formData, setFormData] = useState({
    district: "",
    monthName: "",
    reportDate: "",
    data: {
      age_06_to_23_months: {
        male: {
          oedema: 0,
          samWithComplication: 0,
          samWithoutComplication: 0,
          mam: 0,
          normal: 0,
          totalChildrenAssessed: 0,
        },
        female: {
          oedema: 0,
          samWithComplication: 0,
          samWithoutComplication: 0,
          mam: 0,
          normal: 0,
          totalChildrenAssessed: 0,
        },
      },
      age_24_to_59_months: {
        male: {
          oedema: 0,
          samWithComplication: 0,
          samWithoutComplication: 0,
          mam: 0,
          normal: 0,
          totalChildrenAssessed: 0,
        },
        female: {
          oedema: 0,
          samWithComplication: 0,
          samWithoutComplication: 0,
          mam: 0,
          normal: 0,
          totalChildrenAssessed: 0,
        },
      },
    },
  });

  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (ageGroup, gender, field, value) => {
    setFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [ageGroup]: {
          ...prev.data[ageGroup],
          [gender]: {
            ...prev.data[ageGroup][gender],
            [field]: Number(value),
          },
        },
      },
    }));
  };

  const numberFields = [
    "oedema",
    "samWithComplication",
    "samWithoutComplication",
    "mam",
    "normal",
    "totalChildrenAssessed",
  ];

  const renderGenderFields = (ageGroup, gender) => (
    <Box sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {gender.toUpperCase()}
      </Typography>
      <Stack spacing={2}>
        {numberFields.map((field) => (
          <TextField
            key={field}
            label={field}
            type="number"
            size="small"
            value={formData.data[ageGroup][gender][field]}
            onChange={(e) =>
              handleNestedChange(ageGroup, gender, field, e.target.value)
            }
            fullWidth
            required
          />
        ))}
      </Stack>
    </Box>
  );

  const handleSubmitNutrition = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      console.log(result);

      if (res.ok) {
        alert(result.message || "Assessment saved successfully!");
      } else {
        alert("Error: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {/* ---------------- AGRICULTURE FORM ---------------- */}
      {dept === "Agriculture" && (
        <Box sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Agriculture Assessment
          </Typography>

          <Paper sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Output Indicator</TableCell>
                  <TableCell>Yearly Target</TableCell>
                  <TableCell>Current Month</TableCell>
                  <TableCell>Total Achievement</TableCell>
                  <TableCell>District</TableCell>
                  <TableCell>Package A</TableCell>
                  <TableCell>Package B</TableCell>
                  <TableCell>Package C</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    {Object.keys(row)
                      .filter((field) => field !== "sno")
                      .map((field) => (
                        <TableCell key={field}>
                          <TextField
                            size="small"
                            fullWidth
                            type={["yearlyTarget", "currentMonth", "totalAchievement", "packageA", "packageB", "packageC"].includes(
                              field
                            )
                              ? "number"
                              : "text"}
                            value={row[field]}
                            onChange={(e) =>
                              handleChange(index, field, e.target.value)
                            }
                          />
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Button onClick={addRow} variant="outlined" sx={{ mt: 2 }}>
            + Add Row
          </Button>

          <Button
            onClick={handleSubmitAgriculture}
            variant="contained"
            color="success"
            sx={{ mt: 2, ml: 2 }}
          >
            Submit
          </Button>
        </Box>
      )}
      {/* ---------------- LIVESTOCK FORM ---------------- */}
      {decodeURIComponent(dept) === "Livestock & Fisheries" && (
  <Box sx={{ p: 4 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Livestock Assessment
    </Typography>

    <Paper sx={{ overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S#</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Target CFY 2025-26</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>District</TableCell>
            <TableCell>Progress Details & Description</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {livestockRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>

             <TableCell>
  <Select
    fullWidth
    size="small"
    displayEmpty
    value={row.description}
    onChange={(e) =>
      handleLivestockChange(index, "description", e.target.value)
    }
    renderValue={(selected) => {
      if (!selected) {
        return <span style={{ color: "#888" }}>Select Livestock</span>;
      }
      return selected;
    }}
  >
    <MenuItem value="" disabled>
      Select Livestock
    </MenuItem>

    {livestockOptions.map((opt) => (
      <MenuItem key={opt.id} value={opt.description}>
        {opt.description}
      </MenuItem>
    ))}
  </Select>
</TableCell>


              <TableCell>
                <TextField fullWidth size="small"onChange={(e) =>
                    handleLivestockChange(index, "target", e.target.value)
                  } value={row.target}  />
              </TableCell>

              <TableCell>
                <TextField fullWidth size="small" onChange={(e) =>
                    handleLivestockChange(index, "progress", e.target.value)
                  } value={row.progress}  />
              </TableCell>

              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  value={row.district}
                  onChange={(e) =>
                    handleLivestockChange(index, "district", e.target.value)
                  }
                />
              </TableCell>

              <TableCell>
                <TextField
                  select
                  SelectProps={{ native: true }}
                  fullWidth
                  size="small"
                  value={row.progressDetails}
                  onChange={(e) =>
                    handleLivestockChange(index, "progressDetails", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  {progressDescriptions.map((p, i) => (
                    <option key={i} value={p}>{p}</option>
                  ))}
                </TextField>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>

    <Button onClick={addLivestockRow} variant="outlined" sx={{ mt: 2 }}>
      + Add Row
    </Button>

    <Button
      onClick={submitLivestock}
      variant="contained"
      color="success"
      sx={{ mt: 2, ml: 2 }}
    >
      Submit
    </Button>
  </Box>
      )}


      {/* ---------------- NUTRITION FORM ---------------- */}
      {decodeURIComponent(dept) === "Nutrition (DoN)" && (
        <Box
          sx={{
            width: "100%",
            p: 4,
            backgroundColor: "#ffffff",
            borderRadius: 1,
            boxShadow: "0px 0px 1px #7d7d7d",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Nutrition Assessment
          </Typography>

          <TextField
            label="District"
            name="district"
            size="small"
            fullWidth
            sx={{ mb: 2 }}
            value={formData.district}
            onChange={handleSimpleChange}
          />

          <TextField
            label="Month Name"
            name="monthName"
            size="small"
            fullWidth
            sx={{ mb: 2 }}
            value={formData.monthName}
            onChange={handleSimpleChange}
          />

          <TextField
            label="Report Date"
            name="reportDate"
            type="date"
            size="small"
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={formData.reportDate}
            onChange={handleSimpleChange}
          />

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Age 06–23 Months
          </Typography>

          {renderGenderFields("age_06_to_23_months", "male")}
          {renderGenderFields("age_06_to_23_months", "female")}

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Age 24–59 Months
          </Typography>

          {renderGenderFields("age_24_to_59_months", "male")}
          {renderGenderFields("age_24_to_59_months", "female")}

          <Button
            onClick={handleSubmitNutrition}
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      )}
    </Box>
  );
}
