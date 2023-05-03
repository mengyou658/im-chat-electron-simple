/**
 * SendId 发送人Id
 * ReciverId 接受人Id
 * Content 内容
 * Type 类型
 * State 发送状态
 * NoCode 信息编号
 * CreateDateUtc 创建时间
 * Title 拓展功能字段
 * Description 拓展功能字段
 * Label 拓展功能字段
 * Thumbnail 拓展功能字段
 * ReadFlag 是否阅读
*/
export default class Conversition {
  SendId: number;
  ReciverId: number;
  Content: string;
  Type: number;
  State: number;
  NoCode: string;
  CreateDateUtc: string;
  Title: string;
  Description: string;
  Label: string;
  Thumbnail: string;
  ReadFlag: boolean;
  Avatar: string;
  constructor(
    SendId: number,
    ReciverId: number,
    Content: string,
    Type: number,
    State: number,
    NoCode: string,
    CreateDateUtc: string,
    Title: string,
    Description: string,
    Label: string,
    Thumbnail: string,
    ReadFlag: boolean,
    Avatar: string) {
    this.SendId = SendId;
    this.ReciverId = ReciverId;
    this.Content = Content;
    this.Type = Type;
    this.State = State;
    this.NoCode = NoCode;
    this.CreateDateUtc = CreateDateUtc;
    this.Title = Title;
    this.Description = Description;
    this.Label = Label;
    this.Thumbnail = Thumbnail;
    this.ReadFlag = ReadFlag;
    this.Avatar = Avatar;
  }
}