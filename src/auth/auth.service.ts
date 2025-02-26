import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/utils/password-hash';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await comparePassword(password, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    const payload = { email: user.email, sub: user.id };
    return {
      message: 'Login successful',
      token: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name },
    };
  }
}
