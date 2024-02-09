export class PinResponseEntity {
  pinId: string;
  to: string;
  ncStatuss:
    | 'NC_DESTINATION_UNKNOWN'
    | 'NC_DESTINATION_REACHABLE'
    | 'NC_DESTINATION_NOT_REACHABLE'
    | 'NC_NOT_CONFIGURED';
  smsStatus: 'MESSAGE_SENT' | 'MESSAGE_NOT_SENT';
}
