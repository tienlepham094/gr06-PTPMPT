import { useCallback, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  DialogContentText,
  SelectChangeEvent,
  FormControl,
} from "@mui/material";
import { useAuth } from "../../context/useAuth";
import { RESOURCETYPE } from "../../api/enum";
import resourceApi from "../../api/resource";
import groupApi from "../../api/group";
import { Requests } from "../../types";
import requestApi from "../../api/request";

export const Request = () => {
  const { user, setMessage, setOpenAlert, setSeverity } = useAuth();
  const [request, setRequest] = useState<Requests[] | null>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Add delete dialog state
  const [resourceToDelete, setResourceToDelete] = useState<Requests | null>(
    null
  ); // State for resource to delete
  const [newResource, setNewResource] = useState<Requests>({
    id: 0,
    resource: {
      id: 0,
    },
    endTime: new Date(),
    startTime: new Date(),
    quantity: 0,
    user: user,
  });

  const fetchAllRequest = useCallback(async () => {
    try {
      const request = await requestApi.getAllRequests();
      setRequest(request);
      const groups = await groupApi.getAllGroup();
    } catch (error) {
      console.error("Error fetching request:", error);
    }
  }, []);

  useEffect(() => {
    fetchAllRequest();
  }, [fetchAllRequest]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewResource((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await resourceApi.createResource(newResource);
      setRequest((prev) => [...(prev || []), response]);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding resource:", error);
    }
  };

  const handleEdit = (resource: Request) => {
    setNewResource(resource);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    if (resourceToDelete) {
      try {
        await resourceApi.deleteResource(resourceToDelete.id);
        setRequest((prev) => prev?.filter((r) => r.id !== resourceToDelete.id));
        setOpenDeleteDialog(false);
      } catch (error) {
        console.error("Error deleting resource:", error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Tên tài nguyên", flex: 1 },
    { field: "description", headerName: "Mô tả", flex: 1 },
    { field: "type", headerName: "Loại", flex: 1 },
    { field: "totalQuantity", headerName: "Số lượng hiện có", flex: 1 },
    { field: "availableQuantity", headerName: "Số lượng khả dụng", flex: 1 },
    {
      field: "group",
      headerName: "Tài nguyên của nhóm",
      flex: 1,
      valueGetter: (params) => {
        if (params !== null && params?.name) {
          return params?.name;
        } else {
          return "ADMIN";
        }
      },
    },
    {
      field: "createdBy",
      headerName: "Tạo bởi",
      flex: 1,
      valueGetter: (params) => {
        if (params !== null && params?.username) {
          return params?.username;
        } else {
          return "N/A";
        }
      },
    },
    { field: "createdAt", headerName: "Ngày được tạo", flex: 1 },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 250,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            justifyContent="space-evenly"
            gap={0}
            sx={{ alignSelf: "center" }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleEdit(params.row)}
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setResourceToDelete(params.row); // Set resource to delete
                setOpenDeleteDialog(true); // Open delete confirmation dialog
              }}
            >
              Xóa
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: 2 }}
      >
        <FormControl fullWidth sx={{ maxWidth: 250 }}>
          <TextField
            label="Nhóm quản lý"
            select
            // value={selectedGroupId || 0}
          >
            <MenuItem>Yêu cầu nhóm</MenuItem>
            <MenuItem>Yêu cầu cá nhân</MenuItem>
          </TextField>
        </FormControl>
        <Button
          variant="contained"
          sx={{ marginLeft: 2 }}
          onClick={() => setOpenDialog(true)}
        >
          Thêm tài nguyên
        </Button>
      </Box>

      {/* Add/Edit Resource Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {newResource.id === 0
            ? "Thêm tài nguyên mới"
            : "Chỉnh sửa tài nguyên"}
        </DialogTitle>
        {/* <DialogContent>
          <TextField
            name="name"
            label="Tên tài nguyên"
            value={newResource.name}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="description"
            label="Mô tả"
            value={newResource.description}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="type"
            select
            label="Loại"
            value={newResource.type}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          >
            {Object.values(RESOURCETYPE).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="totalQuantity"
            label="Số lượng hiện có"
            value={newResource.totalQuantity}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="availableQuantity"
            label="Số lượng khả dụng"
            value={newResource.availableQuantity}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="group"
            label="Nhóm cấp phát"
            value={newResource.group?.id || ""}
            select
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          >
            {groups?.map((group) => (
              <MenuItem key={group.id} value={{ id: group.id }}>
                {group.name}
              </MenuItem>
            ))}
          </TextField>
          <pre>{JSON.stringify(newResource, null, 2)}</pre>
        </DialogContent> */}
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Xóa tài nguyên</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa tài nguyên này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={request || []}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
};
