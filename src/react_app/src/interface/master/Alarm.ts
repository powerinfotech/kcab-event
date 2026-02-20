export interface alarmItem {
  alarmText1: string;
  alarmText2: string;
  alarmCnt: number;
  readCls: string;
  iconCls: string;
  iconImg: string;
  chkFlag: Boolean;
  snsrAlrmSeq : number;
}

export interface alarmSearchCondition {
  allFlag: Boolean;
}