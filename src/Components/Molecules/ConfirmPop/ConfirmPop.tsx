import { Button, message, Popconfirm } from "antd";
import { ReactNode, useState } from "react";
import ToogleSwitch2 from "../../Atoms/ToogleSwitch2/ToogleSwitch2";

type popType = {
  Submit: () => void;
  title?: string;
  des?: string;
  open?: boolean;
  component: ReactNode;
};

const ConfirmPop = (props: popType) => {
  const [open, setOpen] = useState(false);
  return (
    <Popconfirm
      open={open}
      title={props.title}
      description={props.des}
      onConfirm={() => props.Submit()}
      onCancel={()=>setOpen(false)}
      okText="Yes"
      cancelText="No"
    >
      <div onClick={() => setOpen(true)}>{props.component}</div>
    </Popconfirm>
  );
};

export default ConfirmPop;
