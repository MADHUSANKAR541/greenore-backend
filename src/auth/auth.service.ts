import { Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  async register(registerDto: RegisterDto) {
    // TODO: Implement user registration
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    console.log('Registering user:', registerDto);
    return {
      message: 'User registered successfully',
      user: {
        id: '1',
        email: registerDto.email,
        name: registerDto.name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // TODO: Implement user login with JWT
    console.log('Logging in user:', loginDto);
    return {
      message: 'Login successful',
      accessToken: 'mock-jwt-token',
      user: {
        id: '1',
        email: loginDto.email,
        name: 'John Doe',
      },
    };
  }
}

