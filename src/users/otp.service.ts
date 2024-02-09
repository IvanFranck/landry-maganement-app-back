import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { SendOTPDto } from './dto/send-otp.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { PinResponseEntity } from './entities/pin-response.entity';
import { VerifiedOTPResponseEntity } from './entities/verify-otp-response.entity';

@Injectable()
export class OTPService {
  private readonly logger = new Logger(OTPService.name);
  constructor(private readonly httpService: HttpService) {}

  /**
   * Sends an OTP SMS using the provided SendOTPDto.
   *
   * @param {SendOTPDto} sendOTPDto - the data for sending the OTP SMS
   * @return {Promise<PinResponseEntity>} the response data from sending the OTP SMS
   */
  async sendOTPSMS(sendOTPDto: SendOTPDto): Promise<PinResponseEntity> {
    const { data }: AxiosResponse<PinResponseEntity> = await firstValueFrom(
      this.httpService.post('/2fa/2/pin?ncNeeded=false', sendOTPDto).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error occurred when sending OTP';
        }),
      ),
    );

    return data;
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
