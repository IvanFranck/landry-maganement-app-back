import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { SendOTPDto } from './dto/send-otp.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { VerifiedOTPResponseEntity } from './entities/verify-otp-response.entity';
import * as twilio from 'twilio';
import { ConfigService } from '@nestjs/config';
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';

@Injectable()
export class OTPService {
  private readonly logger = new Logger(OTPService.name);
  private twilioClient: twilio.Twilio = twilio(
    this.configService.get('TWILIO_VERIFY_API_ACCOUNT_SID'),
    this.configService.get('TWILIO_VERIFY_API_AUTH_KEY'),
  );
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async sendOTPSMS(sendOTPDto: SendOTPDto): Promise<VerificationInstance> {
    try {
      const data = await this.twilioClient.verify.v2
        .services(this.configService.get('TWILIO_VERIFY_API_SERVICE_ID'))
        .verifications.create(sendOTPDto);

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Verify OTP using the provided pinId and pin.
   *
   * @param {string} pinId - The pin ID to be verified
   * @param {string} pin - The OTP pin to be verified
   * @return {Promise<VerifiedOTPResponseEntity>} The verified OTP response entity
   */
  async verifyOTP(
    pinId: string,
    pin: string,
  ): Promise<VerifiedOTPResponseEntity> {
    const { data }: AxiosResponse<VerifiedOTPResponseEntity> =
      await firstValueFrom(
        this.httpService
          .post(`/2fa/2/pin/${pinId}/verify`, {
            pin,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw 'An error occurred when verifing OTP';
            }),
          ),
      );
    return data;
  }
}
