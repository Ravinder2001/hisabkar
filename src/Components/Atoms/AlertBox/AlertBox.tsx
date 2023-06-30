import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import DeleteGroup from "../../../APIs/DeleteGroup";
import { Unauthorized, localStorageKey, request_succesfully } from "../../../utils/Constants";
import { toast } from "react-toastify";
import { ErroToast, SuccessToast } from "../../../utils/ToastStyle";
import { Logout } from "../../../store/slices/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type AlertBoxProps = {
  open: boolean;
  openAlert: () => void;
  id: string;
  toogleFlag: () => void;
};

export default function AlertBox(props: AlertBoxProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { open, openAlert, id } = props;
  const RemoveGroup = async () => {
    const res = await DeleteGroup({ group_id: id, status: false });
    if (res.status == request_succesfully) {
      openAlert();
      toast.success(res.message, SuccessToast);
      props.toogleFlag();
    } else if (res.response.data.status === Unauthorized) {
      localStorage.removeItem(localStorageKey)
      dispatch(Logout());
      navigate("/login");
      toast.error(
        res.response.data.message ?? "Something went wrong",
        ErroToast
      );
    } else {
      toast.error(
        res.response.data.message ?? "Something went wrong",
        ErroToast
      );
    }
  };

  const handleClickOpen = () => {
    openAlert();
  };

  const handleClose = () => {
    openAlert();
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this group?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={RemoveGroup}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
