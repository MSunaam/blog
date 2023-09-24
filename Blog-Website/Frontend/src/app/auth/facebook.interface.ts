export namespace Facebook {
  export interface StatusResponse {
    status: 'connected' | 'not_authorized' | 'unknown';
    authResponse: authResponse;
  }
  export interface authResponse {
    accessToken: string;
    expiresIn: string;
    signedRequest: string;
    userID: string;
  }
}
