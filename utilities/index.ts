export {
  SEND_EMAIL,
  SEND_VERIFICATION_EMAIL,
  SEND_FORGOT_PASSWORD_EMAIL,
  SEND_UPDATE_PASSWORD_EMAIL
} from './email.utility'

export const ERROR_LOG = (error: any) => {
  console.log('==================================================================')
  console.log(error);
  console.log('==================================================================')
};