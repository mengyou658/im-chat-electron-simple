interface IData {
  form: {
    email: string;
    password: string;
  },
  registerForm: {
    name: string,
    email: string;
    password: string;
    surePassword: string;
    avatar: string;
  },
  isLogin: number,
  timestamp: number,
  showModal: boolean,
  step: number,
  verificationCode: string,
  sendVerificationCodeState: boolean,
  hasSendVerificationCode: boolean,
  countdown: number,
  timer: any,
  showPopover: boolean,
  gifIndex:number,
  loading:boolean,
}

export type {
  IData
}