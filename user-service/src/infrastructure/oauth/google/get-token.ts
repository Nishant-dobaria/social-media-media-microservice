import { env } from "@/config/env";
import { UserTypeEnum } from "@/domain/enum/user.enum";
import { NotFoundError } from "@/domain/errors/app-errors";

interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export async function getGoogleOAuthTokens(
  code: string,
  userType: UserTypeEnum
) {
  const url = "https://oauth2.googleapis.com/token";

  let redirectUrl: string;

  switch (userType) {
    case UserTypeEnum.INDIVIDUAL:
      redirectUrl = env.GOOGLE_REDIRECT_URL;
      break;
    case UserTypeEnum.BUSINESS:
      redirectUrl = env.GOOGLE_REDIRECT_BUSINESS_URL;
      break;
    default:
      throw new NotFoundError("User type not found");
  }

  const values = {
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRETE,
    redirect_uri: redirectUrl,
    grant_type: "authorization_code",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(values).toString(),
  });

  const data: GoogleTokensResult = await res.json();

  return data;
}

interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function getGoogleUser(
  id_token: string,
  access_token: string
): Promise<GoogleUserResult> {
  const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (error: any) {
    console.error(error, "Error fetching Google user");
    throw new Error(error.message);
  }
}

export async function getGoogleProfile(code: string, userType: UserTypeEnum) {
  const { id_token, access_token } = await getGoogleOAuthTokens(code, userType);
  const user = await getGoogleUser(id_token, access_token);
  return user;
}
