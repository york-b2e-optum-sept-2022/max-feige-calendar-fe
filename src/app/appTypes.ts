export enum InviteStatus
{
  UNANSWERED = 0,
  NO = 1,
  MAYBE = 2,
  YES = 3
}
export interface IUser
{
  id: number,
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
  id: number,
  creator: IUser,
  date: Date,
  invites: IInvite[]
}
