import { UserRoles } from '../core/models.js';

export const Permissions = Object.freeze({
  VIEW_PUBLIC_CATALOG: 'VIEW_PUBLIC_CATALOG',
  CREATE_RESERVATION: 'CREATE_RESERVATION',
  VIEW_OWN_RESERVATIONS: 'VIEW_OWN_RESERVATIONS',
  APPLY_PROMO_CODE: 'APPLY_PROMO_CODE',

  // Coworking Operator
  MANAGE_DESK_CAPACITY: 'MANAGE_DESK_CAPACITY',
  REGISTER_MANUAL_RESERVATION: 'REGISTER_MANUAL_RESERVATION',
  VIEW_ALL_RESERVATIONS: 'VIEW_ALL_RESERVATIONS',
  MANAGE_RESERVATION_SCHEDULE: 'MANAGE_RESERVATION_SCHEDULE',

  // Hall & Cafe Operator
  REVIEW_HALL_EVENTS: 'REVIEW_HALL_EVENTS',
  APPROVE_REJECT_HALL_RESERVATION: 'APPROVE_REJECT_HALL_RESERVATION',
  MANAGE_CATERING_MENU: 'MANAGE_CATERING_MENU',
  VIEW_CATERING_ORDERS: 'VIEW_CATERING_ORDERS',

  // Super Admin
  MANAGE_PROMO_CODES: 'MANAGE_PROMO_CODES',
  VIEW_FINANCIAL_REPORTS: 'VIEW_FINANCIAL_REPORTS',
  MANAGE_USERS_AND_ROLES: 'MANAGE_USERS_AND_ROLES',
  VIEW_AUDIT_LOGS: 'VIEW_AUDIT_LOGS',
  MANAGE_CMS_CONTENT: 'MANAGE_CMS_CONTENT'
});

const RolePermissions = {
  [UserRoles.CUSTOMER]: [
    Permissions.VIEW_PUBLIC_CATALOG,
    Permissions.CREATE_RESERVATION,
    Permissions.VIEW_OWN_RESERVATIONS,
    Permissions.APPLY_PROMO_CODE
  ],
  [UserRoles.COWORKING_OPERATOR]: [
    Permissions.VIEW_PUBLIC_CATALOG,
    Permissions.CREATE_RESERVATION,
    Permissions.VIEW_ALL_RESERVATIONS,
    Permissions.MANAGE_DESK_CAPACITY,
    Permissions.REGISTER_MANUAL_RESERVATION,
    Permissions.MANAGE_RESERVATION_SCHEDULE
  ],
  [UserRoles.CAFE_OPERATOR]: [
    Permissions.VIEW_PUBLIC_CATALOG,
    Permissions.REVIEW_HALL_EVENTS,
    Permissions.APPROVE_REJECT_HALL_RESERVATION,
    Permissions.MANAGE_CATERING_MENU,
    Permissions.VIEW_CATERING_ORDERS
  ],
  [UserRoles.SUPER_ADMIN]: Object.values(Permissions)
};

export class SecurityGuard {
  static hasPermission(userRole, requiredPermission) {
    if (!userRole || !RolePermissions[userRole]) return false;
    return RolePermissions[userRole].includes(requiredPermission);
  }

  static authorize(requiredPermission) {
    return (req, res, next) => {
      const user = req.user || { role: UserRoles.CUSTOMER };
      if (!this.hasPermission(user.role, requiredPermission)) {
        return res.status(403).json({
          success: false,
          error: 'ACCESS_DENIED',
          message: 'دسترسی شما برای انجام این عملیات مجاز نمی‌باشد.'
        });
      }
      next();
    };
  }
}
