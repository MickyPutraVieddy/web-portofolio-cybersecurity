
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type AuthenticationResponseJSON,
  type AuthenticatorTransportFuture,
  type RegistrationResponseJSON,
} from "@simplewebauthn/server"

import type { Engine } from "@/lib/server/passkey"

const toBytes = (b64url: string) =>
  new Uint8Array(Buffer.from(b64url, "base64url"))

const toB64 = (bytes: Uint8Array) =>
  Buffer.from(bytes).toString("base64url")

const TIMEOUT_MS = 120_000

export const realEngine: Engine = {
  async registrationOptions({
    rpName,
    rpID,
    userName,
    userID,
    excludeIds,
  }) {
    return generateRegistrationOptions({
      rpName,
      rpID,
      userName,
      userID: new Uint8Array(userID),
      timeout: TIMEOUT_MS,
      attestationType: "none",
      excludeCredentials: excludeIds.map((id) => ({ id })),
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "required",
      },
    })
  },

  async verifyRegistration({
    response,
    expectedChallenge,
    expectedOrigin,
    expectedRPID,
  }) {
    const result = await verifyRegistrationResponse({
      response: response as RegistrationResponseJSON,
      expectedChallenge,
      expectedOrigin,
      expectedRPID,
      requireUserVerification: true,
    })

    if (!result.verified || !result.registrationInfo) {
      return { verified: false }
    }

    const {
      credential,
      credentialDeviceType,
      credentialBackedUp,
    } = result.registrationInfo

    return {
      verified: true,
      credential: {
        id: credential.id,
        publicKey: toB64(credential.publicKey),
        counter: credential.counter,
        transports: (credential.transports ?? []) as string[],
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
      },
    }
  },

  async authenticationOptions({ rpID }) {
    return generateAuthenticationOptions({
      rpID,
      userVerification: "required",
      timeout: TIMEOUT_MS,
    })
  },

  async verifyAuthentication({
    response,
    expectedChallenge,
    expectedOrigin,
    expectedRPID,
    credential,
  }) {
    const result = await verifyAuthenticationResponse({
      response: response as AuthenticationResponseJSON,
      expectedChallenge,
      expectedOrigin,
      expectedRPID,
      requireUserVerification: true,
      credential: {
        id: credential.id,
        publicKey: toBytes(credential.publicKey),
        counter: credential.counter,
        transports:
          credential.transports as AuthenticatorTransportFuture[],
      },
    })

    return {
      verified: result.verified,
      newCounter: result.authenticationInfo.newCounter,
    }
  },
}
