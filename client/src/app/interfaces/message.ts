import {MessageNames} from "../enums/message-names";

export interface Message {
  name: MessageNames;
  clientId?: string;
  sessionName?: string;
  status?: number;
  data?: any;
}
