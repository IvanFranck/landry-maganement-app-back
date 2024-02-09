import { Injectable } from '@nestjs/common';
import { ValidateUserDto } from './dto/validate-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { ValidatedUserEntity } from './entites/validate-user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * validate user based on phone and password.
   *
   * @param {ValidateUserDto} validateUserDto - the user data to be validated
   * @return {Promise<ValidatedUserEntity | null>} the result of the user validation
   */
  async validateUser(
    validateUserDto: ValidateUserDto,
  ): Promise<ValidatedUserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        phone: validateUserDto.phone,
      },
    });

    const isPaswwordValid = await bcrypt.compare(
      validateUserDto.password,
      user.password,
    );

    if (user && isPaswwordValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login() {}
}
