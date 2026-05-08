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
    menuNamePath: `Admin > ${menuNm}`,
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
      menu(100, 'Dashboard', '/', 'DashBoard', 1),
      menu(110, 'Event Management', '/events', 'admin/SuperEventList', 2),
      menu(111, 'Create Event', '/events/new', 'admin/EventEditor', 3, 2),
      menu(120, 'Side Event Approval', '/side-events/SE-0042', 'admin/SideEventReview', 4),
      menu(130, 'Participant Management', '/participants', 'admin/Participants', 5),
      menu(140, 'Payment Management', '/payments', 'admin/Payments', 6),
      menu(150, 'Email CMS', '/email-cms/registration-confirm', 'admin/EmailCms', 7),
      menu(155, 'Law Firm / Organization Management', '/organizations', 'admin/OrganizationManagementMock', 8),
      menu(160, 'User Management', '/users', 'admin/UserManagementMock', 9),
      menu(170, 'Settings', '/settings', 'admin/SettingsMock', 10),
    ];
  }

  return [
    menu(200, 'Dashboard', '/', 'DashBoard', 1),
    menu(210, 'My Side Events', '/side-events', 'admin/OrgSideEvents', 2),
    menu(211, 'Apply for Side Event', '/side-events/new', 'admin/OrgSideEventForm', 3, 2),
    menu(220, 'Participants', '/participants', 'admin/Participants', 4),
    menu(230, 'Organization Profile', '/profile', 'admin/OrgProfile', 5),
  ];
}
