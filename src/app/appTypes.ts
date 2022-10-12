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
  title: string,
  creator: IUser,
  date: Date,
  invites: IInvite[]
}


export enum RenderState
{
  LOGIN=0,
  EVENT_CREATE=1,
  EVENT_EDIT=2,
  INVITE_VIEW=3,
  EVENT_VIEW=4,
  USER_PAGE=5
}
