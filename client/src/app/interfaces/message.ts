export interface Message {
  name: string;
  clientId?: string;
  sessionName?: string;
  status?: number;
  data?: any;
}
