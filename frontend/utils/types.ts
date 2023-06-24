export interface UserData {
  login: string;
}

export interface UserDTO extends UserData {
  password: string;
}

export interface User extends UserData {
  _id: string;
}

export interface TrackData {
  name: string;
  cover: string;
  audio: string;
  author: User;
  liked: boolean;
}

export interface Track extends TrackData {
  _id: string;
}
