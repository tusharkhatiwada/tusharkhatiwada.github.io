import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Routes } from "./Routes"
import { WithdrawalRequest } from "api/domain/wallet"
import { OtpForm } from "../hooks/auth/useOtpForm"
import { Plan } from "./Plans"
import { WalletHistory } from "./Wallet"
import { ReferralLevelType } from "./Referrals"

export type RootStackParamList = {
  [Routes.home]: undefined
  [Routes.main.navigator]: NavigatorScreenParams<MainTabParamList> | undefined
  [Routes.auth.navigator]: NavigatorScreenParams<AuthStackParamList> | undefined
  [Routes.main.trading.navigator]: NavigatorScreenParams<TradingStackParamList> | undefined
  Modal: undefined
  NotFound: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>

export type MainTabScreenProps<Screen extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>

export type ReferralsStackScreenProps<Screen extends keyof ReferralsStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ReferralsStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >

export type ProfileStackScreenProps<Screen extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >

export type WalletStackScreenProps<Screen extends keyof WalletStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<WalletStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >

export type InvestStackScreenProps<Screen extends keyof InvestStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<InvestStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >

export type MainTabParamList = {
  [Routes.main.home]: undefined
  [Routes.main.referrals.navigator]: undefined
  [Routes.main.transactionHistory]: undefined
  [Routes.main.invest.navigator]: undefined
  [Routes.main.profile.navigator]: undefined
  [Routes.main.wallet.navigator]: undefined
}

export type ReferralsStackParamList = {
  [Routes.main.referrals.information]: undefined
  [Routes.main.referrals.levelDetails]: { level: ReferralLevelType; levelName: string }
  [Routes.main.referrals.navigator]: undefined
}

export type AuthStackParamList = {
  [Routes.auth.login]: undefined
  [Routes.auth.otp]: {
    email: string
    codeEndTime?: string
    submitOtp: (form: OtpForm, email: string) => void
  }
  [Routes.auth.create_account]: { referralId?: string } | undefined
  [Routes.auth.forgot_password]: undefined
  [Routes.auth.forgot_password_create_new]: { email: string; hash: string }
  [Routes.auth.reset_password]: { token: string }
  [Routes.auth.kyc]: WithdrawalRequest.Params
  [Routes.auth.document_photo]: undefined
  [Routes.auth.plans]: { desiredPlan?: Plan; step?: number }
}

export type ProfileStackParamList = {
  [Routes.main.profile.userProfile]: undefined
  [Routes.main.profile.support]: undefined
  [Routes.main.profile.changePassword]: undefined
  [Routes.main.profile.logout]: undefined
  [Routes.main.profile.apiKeys]: undefined
}

export type WalletStackParamList = {
  [Routes.main.wallet.walletDetails]: undefined
  [Routes.main.wallet.deposit]: undefined
  [Routes.main.wallet.withdraw]: { addressToSend?: string }
  [Routes.main.wallet.historyPositionDetails]: { position: WalletHistory }
  [Routes.main.wallet.qr_scanner]: undefined
}

export type InvestStackParamList = {
  [Routes.main.invest.walletDetails]: undefined
  [Routes.main.invest.deposit]: undefined
  [Routes.main.invest.refund]: { addressToSend?: string }
  [Routes.main.invest.qr_scanner]: undefined
}

export type TradingStackParamList = {
  [Routes.main.trading.tradingDetails]: undefined
}
