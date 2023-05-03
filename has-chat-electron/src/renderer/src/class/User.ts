export default class User {
  Id: number;
  Name: string;
  OnlineState: boolean;
  Mobile: string;
  NickName: string;
  Avatar: string;
  constructor(Id: number, Name: string, OnlineState: boolean, Code: string, Mobile: string, NickName: string, Avatar: string) {
    this.Id = Id;
    this.Name = Name;
    this.OnlineState = OnlineState;
    this.Mobile = Mobile;
    this.NickName = NickName;
    this.Avatar = Avatar;
  }
}