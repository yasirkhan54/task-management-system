import { IsString, MinLength, MaxLength, IsEmail, IsBoolean } from "class-validator";

export class SignUpDto {
  @IsString({ message: "First name is required" })
  @MinLength(2, { message: "First name should be minimum 2 characters long" })
  @MaxLength(15, { message: "First name should be maximum 15 characters long" })
  first_name: string;

  @IsString({ message: "Last name is required" })
  @MinLength(2, { message: "Last name should be minimum 2 characters long" })
  @MaxLength(15, { message: "Last name should be maximum 15 characters long" })
  last_name: string;

  @IsString({ message: "Email is required" })
  @IsEmail({}, { message: "Please provide valid email" })
  @MaxLength(50, { message: "Email should be maximum 50 characters long" })
  email: string;

  @IsString({ message: "Password is required" })
  @MinLength(5, { message: "Password should be minimum 5 characters long" })
  @MaxLength(15, { message: "Password should be maximum 15 characters long" })
  password: string;

  @IsBoolean({ message: "Terms and conditions should be boolean" })
  terms_accepted: boolean;

  @IsString({ message: "Redirect url is required" })
  @MaxLength(50, { message: "Redirect url should be maximum 50 characters long" })
  redirect_url: string;
}

export class VerifyEmailDto {
  @IsString({ message: "Email is required" })
  @IsEmail({}, { message: "Please provide valid email" })
  @MaxLength(50, { message: "Email should be maximum 50 characters long" })
  email: string;

  @IsString({ message: "Email verify code is required" })
  email_verify_code: string;
}

export class ResendEmailDto {
  @IsEmail({}, { message: "Please provide valid email" })
  @MaxLength(50, { message: "Email should be maximum 50 characters long" })
  email: string;

  @IsString({ message: "Redirect url is required" })
  @MaxLength(50, { message: "Redirect url should be maximum 50 characters long" })
  redirect_url: string;
}

export class SignInDto {
  @IsString({ message: "Email is required" })
  @IsEmail({}, { message: "Please provide valid email" })
  @MaxLength(50, { message: "Email should be maximum 50 characters long" })
  email: string;

  @IsString({ message: "Password is required" })
  @MinLength(5, { message: "Password should be minimum 5 characters long" })
  @MaxLength(15, { message: "Password should be maximum 15 characters long" })
  password: string;
}

export class ForgotPasswordDto {
  @IsString({ message: "Email is required" })
  @IsEmail({}, { message: "Please provide valid email" })
  @MaxLength(50, { message: "Email should be maximum 50 characters long" })
  email: string;

  @IsString({ message: "Redirect url is required" })
  @MaxLength(50, { message: "Redirect url should be maximum 50 characters long" })
  redirect_url: string;
}

export class ResetPasswordDto {
  @IsString({ message: "Email is required" })
  @IsEmail({}, { message: "Please provide valid email" })
  @MaxLength(50, { message: "Email should be maximum 50 characters long" })
  email: string;

  @IsString({ message: "Password is required" })
  @MinLength(5, { message: "Password should be minimum 5 characters long" })
  @MaxLength(15, { message: "Password should be maximum 15 characters long" })
  password: string;

  @IsString({ message: "Reset password code is required" })
  reset_password_code: string;
}

export class ChangePasswordDto {
  @IsString({ message: "Old password is required" })
  @MinLength(5, { message: "Old password should be minimum 5 characters long" })
  @MaxLength(15, { message: "Old password should be maximum 15 characters long" })
  old_password: string;

  @IsString({ message: "New password is required" })
  @MinLength(5, { message: "New password should be minimum 5 characters long" })
  @MaxLength(15, { message: "New password should be maximum 15 characters long" })
  new_password: string;
}

export class DeleteAccountDto {
  @IsString({ message: "Password is required" })
  @MinLength(5, { message: "Password should be minimum 5 characters long" })
  @MaxLength(15, { message: "Password should be maximum 15 characters long" })
  password: string;
}