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
      menu(130, 'Participant Management', '/participants', 'admin/Participants', 4),
      menu(140, 'Payment Management', '/payments', 'admin/Payments', 5),
      menu(145, 'Pay Test', '/pay-test', 'admin/PayTest', 6),
      menu(150, 'Email CMS', '/email-cms/registration-confirm', 'admin/EmailCms', 7),
      menu(155, 'Email History', '/email-logs', 'admin/EmailLogHistory', 8),
      menu(158, 'Notice & News', '/notice-news', 'admin/NoticeNews', 9),
      menu(159, 'Gallery', '/gallery', 'admin/Gallery', 10),
      menu(160, 'User Management', '/users', 'admin/UserManagementMock', 11),
      menu(165, 'FAQ Management', '/faq', 'admin/FaqManagement', 12),
      menu(166, 'Popup Management', '/popups', 'admin/PopupManagement', 13),
      menu(170, 'Settings', '/settings', 'admin/Settings', 99),
    ];
  }

  return [
    menu(200, 'Dashboard', '/', 'DashBoard', 1),
    menu(210, 'Event Management', '/events', 'admin/SuperEventList', 2),
    menu(220, 'Participants', '/participants', 'admin/Participants', 3),
    menu(240, 'FAQ', '/faq', 'admin/OrganizationFaq', 4),
    menu(230, 'Organization Profile', '/profile', 'admin/OrgProfile', 99),
  ];
}
