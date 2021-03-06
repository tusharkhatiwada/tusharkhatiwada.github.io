import { Deposit } from "screens/Main/Wallet/Deposit"
import { Header } from "components/Header"
import { Routes } from "models/Routes"
import { Wallet } from "screens/Main/Wallet"
import { WalletStackParamList } from "../models/Navigation"
import { Withdraw } from "screens/Main/Wallet/Withdraw"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useTranslation } from "react-i18next"
import { QrScanner } from "../screens/Main/Wallet/QrScanner "
import { HistoryPositionDetails } from "../screens/Main/Wallet/HistoryPositionDetails/HistoryPositionDetails"

const Stack = createNativeStackNavigator<WalletStackParamList>()

export function WalletNavigator() {
  const { t } = useTranslation()

  return (
    <Stack.Navigator screenOptions={{ animation: "slide_from_right" }}>
      <Stack.Screen
        name={Routes.main.wallet.walletDetails}
        component={Wallet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.main.wallet.historyPositionDetails}
        component={HistoryPositionDetails}
        options={{
          header: ({ navigation }) => (
            <Header canGoBack navigation={navigation} title={t("wallet.withdraw.title")} />
          ),
        }}
      />
      <Stack.Screen
        name={Routes.main.wallet.deposit}
        component={Deposit}
        options={{
          header: ({ navigation }) => (
            <Header canGoBack navigation={navigation} title={t("wallet.deposit.title")} />
          ),
        }}
      />
      <Stack.Screen
        name={Routes.main.wallet.withdraw}
        component={Withdraw}
        options={{
          header: ({ navigation }) => (
            <Header canGoBack navigation={navigation} title={t("wallet.withdraw.title")} />
          ),
        }}
      />
      <Stack.Screen
        name={Routes.main.wallet.qr_scanner}
        component={QrScanner}
        options={{
          header: ({ navigation }) => (
            <Header canGoBack navigation={navigation} title={t("wallet.withdraw.title")} />
          ),
        }}
      />
    </Stack.Navigator>
  )
}
