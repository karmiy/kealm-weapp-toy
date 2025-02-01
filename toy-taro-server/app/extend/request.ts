import { Request } from "egg";

export default {
  get token() {
    return (this as Request).get("token");
  },
};
