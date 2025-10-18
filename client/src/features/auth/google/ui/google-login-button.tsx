"use client";

import { useGoogleSignIn } from "../model/use-google-sign-in";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

export const GoogleLoginConponent = () => {
  const google = useGoogleSignIn();

  const handleSuccess = (res: CredentialResponse) => {
    if (res.credential) {
      google.signIn(res.credential);
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.error("Google login failed")}
        useOneTap={false}
        theme="outline" 
        size="large" 
        text="signin_with" 
        shape="rectangular" 
        logo_alignment="center" 
        width="400" 
      />
    </div>
  );
};
