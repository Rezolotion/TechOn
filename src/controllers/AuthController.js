import { DemoUsers } from '../core/models.js';

export class AuthController {
  login(body) {
    const { username, password } = body;
    const user = Object.values(DemoUsers).find(u => u.username === username && u.password === password);
    if (!user) {
      throw new Error('نام کاربری یا رمز عبور اشتباه است');
    }
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        phone: user.phone,
        role: user.role,
        title: user.title,
        avatar: user.avatar
      },
      token: `token_${user.id}_${Date.now()}`
    };
  }
}
