import { IsString, MinLength, MaxLength, IsEmail, IsBoolean, IsDate, MinDate, IsEnum, IsDateString, IsISO8601 } from "class-validator";

export class TaskDto {
  @IsString({ message: "User ID is required" })
  user_id: string

  @IsString({ message: "Title is required" })
  @MinLength(2, { message: "Title should be minimum 2 characters long" })
  @MaxLength(15, { message: "Title should be maximum 15 characters long" })
  title: string

  @IsString({ message: "Description is required" })
  @MinLength(2, { message: "Description should be minimum 2 characters long" })
  @MaxLength(50, { message: "Description should be maximum 50 characters long" })
  description: string

  @IsISO8601({ strict: true }, { message: "Due date should be in ISO8601 format" })
  due_date: Date

  @IsString({ message: "Category is required" })
  @MinLength(2, { message: "Category should be minimum 2 characters long" })
  @MaxLength(15, { message: "Category should be maximum 15 characters long" })
  category: string

  @IsString({ message: "Status is required" })
  @IsEnum(['Pending', 'Completed'], { message: "Status should be either Pending or Completed" })
  status: string = 'Pending' || 'Completed'
}
