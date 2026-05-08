import { MenuInfo, MenuType } from '@interface/auth/MenuManagement';

export type AdminRole = 'ADMIN' | 'ORGANIZATION';

export function getAdminRole(admYn?: string): AdminRole {
  return admYn === 'Y' ? 'ADMIN' : 'ORGANIZATION';
}

function menu(
  menuSeq: number,
  menuNm: string,
  menuUrl: string,
  menuViewPath: string,
  sortSeq: number,
  level = 1,
): MenuInfo {
  return {
    menuSeq,
    upMenuSeq: 0,
    menuNm,
    menuTypeCd: MenuType.V,
    menuViewPath,
    menuUrl,
    useYn: 'Y',
    sortSeq,
    menuNamePath: `관리자 > ${menuNm}`,
    menuIdPath: `admin>${menuSeq}`,
    level,
    rgstUserName: 'system',
    rgstDateTime: '',
    uptUserName: 'system',
    uptDateTime: '',
  };
}

export function getFixedAdminMenuInfo(admYn?: string): MenuInfo[] {
  if (getAdminRole(admYn) === 'ADMIN') {
    return [
      menu(100, '대시보드', '/', 'DashBoard', 1),
      menu(110, '행사 관리', '/events', 'admin/SuperEventList', 2),
      menu(111, '행사 등록', '/events/new', 'admin/EventEditor', 3, 2),
      menu(120, '부대행사 승인', '/side-events/SE-0042', 'admin/SideEventReview', 4),
      menu(130, '참가자 관리', '/participants', 'admin/Participants', 5),
      menu(140, '결제 관리', '/payments', 'admin/Payments', 6),
      menu(150, '이메일 CMS', '/email-cms/registration-confirm', 'admin/EmailCms', 7),
      menu(155, '로펌/기관 관리', '/organizations', 'admin/OrganizationManagementMock', 8),
      menu(160, '사용자 관리', '/users', 'admin/UserManagementMock', 9),
      menu(170, '환경 설정', '/settings', 'admin/SettingsMock', 10),
    ];
  }

  return [
    menu(200, '대시보드', '/', 'DashBoard', 1),
    menu(210, '내 부대행사', '/side-events', 'admin/OrgSideEvents', 2),
    menu(211, '부대행사 신청', '/side-events/new', 'admin/OrgSideEventForm', 3, 2),
    menu(220, '참가자', '/participants', 'admin/Participants', 4),
    menu(230, '기관 프로필', '/profile', 'admin/OrgProfile', 5),
  ];
}
