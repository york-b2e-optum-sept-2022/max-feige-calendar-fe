export enum InviteStatus
{
  UNANSWERED = 0,
  NO = 1,
  MAYBE = 2,
  YES = 3
}
export interface IUser
{
  username: string,
  password: string
}
export interface IInvite
{
  invitee: IUser,
  status: InviteStatus
}
export interface IEvent
{
  creator: IUser,
  date: Date,
  invites: IInvite[]
}
