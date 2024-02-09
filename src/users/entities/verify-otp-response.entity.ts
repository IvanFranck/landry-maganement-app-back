export class VerifiedOTPResponseEntity {
  attemptsRemaining: number;
  msisdn: string;
  pinError: string;
  pinId: string;
  verified: boolean;
}
