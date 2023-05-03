import type { IData } from "@/type/home";
class InitData implements IData {
  form: { email: string; password: string; } = { email: "test@qq.com", password: "123456" };
  registerForm: { name: string; email: string; password: string; surePassword: string; avatar: string } = {
    name: "",
    email: "",
    password: "",
    surePassword: "",
    avatar: ""
  };
  isLogin: number = 1;
  timestamp: number = +new Date();
  showModal: boolean = false;
  step: number = 1;
  verificationCode: string = "";
  sendVerificationCodeState: boolean = false;
  hasSendVerificationCode: boolean = false;
  countdown: number = 60;
  timer: any = null;
  showPopover: boolean = false;
  gifIndex: number = 1;
  loading:boolean = false;
}

export { InitData }
