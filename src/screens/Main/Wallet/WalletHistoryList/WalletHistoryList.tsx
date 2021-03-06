import { Pressable, StyleSheet, View } from "react-native"

import { FC } from "react"
import { Icon } from "components/Icon"
import { TranslationKeys } from "models/TranslationKeys"
import { Typography } from "components/Typography"
import { WalletHistory } from "models/Wallet"
import { formatNumberToCurrency } from "utils/currency"
import { Spinner, useTheme } from "native-base"
import { useTranslation } from "react-i18next"

export type WalletHistoryListProps = {
  walletHistory: WalletHistory[]
  goPositionDetails: (position: WalletHistory) => void
  isLoading?: boolean
}

export const WalletHistoryList: FC<WalletHistoryListProps> = ({
  walletHistory,
  isLoading,
  goPositionDetails,
}) => {
  const { t, i18n } = useTranslation()
  const { colors } = useTheme()
  const WalletTransactionTypes = {
    DEPOSIT: {
      translationKey: "wallet.history.deposit",
      color: colors.info[400],
      sign: "-",
      icon: "arrow-circle-dowm",
    },
    WITHDRAWAL: {
      translationKey: "wallet.history.withdrawal",
      color: colors.warning[400],
      sign: "+",
      icon: "arrow-circle-dowm",
    },
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.alignCenter]}>
        <Spinner />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {walletHistory.length > 0 ? (
        walletHistory.map((transaction, index) => {
          const transactionProps = WalletTransactionTypes[transaction.type]

          const date = new Date(transaction.date)

          return (
            <Pressable
              onPress={() => goPositionDetails(transaction)}
              key={`${transaction.date}-${index}`}
              style={[styles.profitRow, { borderBottomColor: colors.primary[200] }]}
            >
              <View style={styles.profitValue}>
                <View
                  style={[
                    styles.circleIcon,
                    {
                      backgroundColor:
                        transaction.type === "DEPOSIT" ? colors.info[400] : colors.warning[400],
                    },
                  ]}
                >
                  <Icon
                    size="xl"
                    name={transaction.type === "DEPOSIT" ? "arrow-circle-down" : "arrow-circle-up"}
                    color="white"
                  />
                </View>
                <View>
                  <Typography>{t(transactionProps.translationKey as TranslationKeys)}</Typography>
                  <Typography color={colors.primary[400]}>
                    {date.toLocaleDateString(i18n.language)}
                  </Typography>
                </View>
              </View>
              <View style={styles.profitValue}>
                <Typography>{formatNumberToCurrency(transaction.amount)}</Typography>
                <Icon color={colors.primary[400]} name="dollar-sign" />
              </View>
            </Pressable>
          )
        })
      ) : (
        <Typography color="primary.600" style={styles.noTransaction}>
          {t("wallet.history.noTransactions")}
        </Typography>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noTransaction: {
    marginTop: 40,
    textAlign: "center",
  },
  profitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  profitValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  circleIcon: {
    padding: 8,
    borderRadius: 50,
    marginRight: 16,
  },
  alignCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
})
