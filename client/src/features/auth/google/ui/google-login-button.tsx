"use client";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

export const GoogleLoginConponent = ({
  onSuccess,
}: {
  onSuccess: (idToken: string) => void;
}) => {
  const handleSuccess = (res: CredentialResponse) => {
    if (res.credential) {
      onSuccess(res.credential);
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
