import { Button } from "components/Button"
import { RootView } from "components/RootView"
import { Select } from "components/Select"
import { TextInput } from "components/TextInput"
import { ToastType } from "components/Toast/Toast"
import { Typography } from "components/Typography"
import { useAuthContext } from "context/AuthContext"
import { useToastContext } from "context/ToastContext"
import { isNil } from "lodash"
import { MainTabScreenProps } from "models/Navigation"
import { riskLevelsList } from "models/RiskLevels"
import { Routes } from "models/Routes"
import { ScrollView, Spinner, Stack, useTheme, WarningIcon } from "native-base"
import { FC, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ProfitsList } from "screens/Common/ProfitsList"
import { StorageKey, createSecureStorage } from "services/SecureStorage"
import { GetPlans } from "../../../api/domain/auth"
import { useCheckNeedGoToPlan } from "../../../hooks/auth/useCheckNeedGoToPlan"
import useColorScheme from "../../../hooks/useColorScheme"
import { Plan, ProPlanMock } from "../../../models/Plans"
import { PlansSelector } from "./PlansSelector"
import { useStartTrade } from "hooks/trade/useStartTrade"
import { useActivateBot } from "hooks/trade/useActivateBot"
import { useActivateBotForm } from "hooks/trade/useActivateBotForm"
import { useStopBot } from "hooks/trade/useStopBot"
import { accentColors } from "styles/colors"
import { Icon } from "components/Icon"
import { useGetActivateStatus } from "hooks/trade/useGetActivateStatus"

export type HomeProps = MainTabScreenProps<typeof Routes.main.home>

export const Home: FC<HomeProps> = ({ navigation }) => {
  const { space } = useTheme()
  const { top, bottom } = useSafeAreaInsets()
  const storage = createSecureStorage()
  const { showToast } = useToastContext()

  const { t } = useTranslation()

  const { isLoggedIn, setSelectedPlan, user } = useAuthContext()

  // const { plans } = useGetAllPlans(isLoggedIn)

  const [plansToShow, setPlansToShow] = useState<GetPlans.Response>([ProPlanMock])
  const [tradingInitiated, setTradingInitiated] = useState<boolean>(false)
  const [tradingPaymentCompleted, setTradingPaymentCompleted] = useState<boolean | undefined>(false)
  const [botActivated, setBotActivated] = useState<boolean | undefined>(false)
  const [riskLevel, setRiskLevel] = useState<string | undefined>()
  const [userTradingEmail, setUserTradingEmail] = useState<string | undefined>("")
  const [userId, setUserId] = useState<string>("")
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [readyToActivate, setReadyToActivate] = useState(false)
  const [botRunning, setBotRunning] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [hasApiKeys, setHasApiKeys] = useState(false)
  const [lessPayment, setLessPayment] = useState("")
  const { data: activateStatus, refetch } = useGetActivateStatus({ userId })
  const {
    data: paymentData,
    isLoading: paymentDataLoading,
    fetchStatus,
    isError,
  } = useStartTrade({
    email_address: userTradingEmail as string,
    startTrading: tradingInitiated,
  })

  const {
    activateBot: activateBotApi,
    data: activateData,
    isSuccess: isActivateSuccess,
    isLoading: isActivateLoading,
  } = useActivateBot()

  const { stopBot, isLoading: isStopping, data: stopData, isSuccess: isStopSuccess } = useStopBot()

  const handleChangeRiskLevel = (level: string) => {
    setRiskLevel(level)
  }

  const { colors } = useTheme()

  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === "dark"

  useEffect(() => {
    const getTradingStatus = async () => {
      const userEmail = (await storage.get(StorageKey.USER_TRADING_EMAIL)) as string
      setUserTradingEmail(userEmail)
      const userId = (await storage.get(StorageKey.ACCESS_TOKEN)) as string
      setUserId(userId)
      const tradingInitatedData = (await storage.get(StorageKey.INITIATE_TRADING)) as string | null
      const tradingInitiatedVal = !tradingInitatedData
        ? Boolean(tradingInitatedData)
        : (JSON.parse(tradingInitatedData) as boolean)
      if (tradingInitiatedVal) {
        setPaymentProcessing(true)
      }
      // const paymentCompleted = (await storage.get(StorageKey.INITIATE_TRADING)) as string | null
      // const paymentCompletedVal = !paymentCompleted
      //   ? Boolean(paymentCompleted)
      //   : (JSON.parse(paymentCompleted) as boolean)
      const botActivated = (await storage.get(StorageKey.BOT_ACTIVATED)) as string | null
      const botActivateddVal = !botActivated
        ? Boolean(botActivated)
        : (JSON.parse(botActivated) as boolean)
      const botRunning = (await storage.get(StorageKey.BOT_RUNNING)) as string | null
      const botRunningdVal = !botRunning ? Boolean(botRunning) : (JSON.parse(botRunning) as boolean)
      const hasApiKeysData = (await storage.get(StorageKey.BOT_KEY)) as string | null
      const hasApiKeysVal = Boolean(hasApiKeysData)
      setHasApiKeys(hasApiKeysVal)
      tradingInitiatedVal && setTradingInitiated(tradingInitiatedVal)
      //   paymentCompletedVal && setTradingPaymentCompleted(paymentCompletedVal)
      botActivateddVal && setBotActivated(botActivateddVal)
      botRunningdVal && setBotRunning(botRunningdVal)
    }

    getTradingStatus()
  }, [])

  useEffect(() => {
    // if (
    //   isError ||
    //   paymentData === null ||
    //   paymentData?.message?.includes("recognize") ||
    //   paymentData?.message?.includes("failure")
    // ) {
    //   showToast({
    //     type: ToastType.error,
    //     title: "User doesn't have bybit account or the transaction failed",
    //   })
    //   storage.set(StorageKey.INITIATE_TRADING, "false")
    //   setTradingInitiated(false)
    // }
    // if (paymentData?.message?.includes("processing")) {
    //   setPaymentProcessing(true)
    //   setTradingInitiated(true)
    // }
    if (paymentData && paymentData?.message?.includes("less than")) {
      // split string with :
      const splitString = paymentData?.message?.split(":")
      const paidAmount = splitString?.[1]
      setLessPayment(t("home.lessPaidError", { value: paidAmount }))
    }
    if (paymentData && paymentData?.message?.includes("ready")) {
      setPaymentProcessing(false)
      setReadyToActivate(true)
      setTradingInitiated(true)
      setLessPayment("")
      // showToast({
      //   type: ToastType.success,
      //   title: "Ready to activate",
      // })
    }
  }, [paymentData])
  useEffect(() => {
    console.log("===Activate Data===", activateData)
    if (isActivateSuccess && activateData.message_activate?.includes("successfully saved")) {
      setPaymentSuccess(true)
      setBotRunning(true)
      setReadyToActivate(false)
      storage.set(StorageKey.BOT_RUNNING, "true")
      storage.set(StorageKey.BOT_ACTIVATED, "true")
      setBotActivated(false)
      showToast({
        type: ToastType.success,
        title: t("home.botPaid"),
      })
    }
    if (activateData?.message_activate?.includes("user was")) {
      setPaymentSuccess(true)
      setBotRunning(true)
      setReadyToActivate(false)
      storage.set(StorageKey.BOT_RUNNING, "true")
      storage.set(StorageKey.BOT_ACTIVATED, "true")
      setBotActivated(false)
      showToast({
        type: ToastType.error,
        title: t("home.userAlreadyActivated"),
      })
    }
    if (activateData?.message_activate?.includes("The bot was activated")) {
      setPaymentSuccess(true)
      setBotRunning(true)
      setReadyToActivate(false)
      storage.set(StorageKey.BOT_RUNNING, "true")
      storage.set(StorageKey.BOT_ACTIVATED, "true")
      setBotActivated(false)
      showToast({
        type: ToastType.error,
        title: t("home.activatedMore"),
      })
    }
    // else {
    //   showToast({
    //     type: ToastType.error,
    //     title: "Unable to activate bot",
    //   })
    // }
  }, [isActivateSuccess, activateData])

  useEffect(() => {
    console.log("===Stop data===", stopData)
    if (stopData && stopData?.message?.includes("bot stopped")) {
      setBotRunning(false)
      setTradingInitiated(true)
      setPaymentProcessing(false)
      refetch()
      storage.set(StorageKey.INITIATE_TRADING, "true")
      storage.set(StorageKey.BOT_RUNNING, "false")
      showToast({
        type: ToastType.success,
        title: t("home.botStopped"),
      })
    }
  }, [stopData])

  useEffect(() => {
    if (
      activateStatus &&
      (activateStatus?.message?.includes("the state of the bot is: activate") ||
        activateStatus?.message?.includes("the state of the bot is: deactivate"))
    ) {
      setPaymentProcessing(false)
    }
  }, [activateStatus])

  /*   useEffect(() => {
    if (!isNil(user) && !isNil(plans)) {
      if (!isNil(user.UserPlan)) {
        const indexOfElement = findIndex(plans, (plan) => user.UserPlan.Plan.name === plan.name)
        if (indexOfElement !== -1) {
          setPlansToShow(plans.filter((plan, index) => indexOfElement < index))
        } else {
          setPlansToShow(plans)
        }
      } else {
        setPlansToShow(plans)
      }
    }
  }, [plans, user]) */
  // Commenting this for now as we are only showing Pro plan statically
  // useCheckNeedGoToPlan({ navigationProps: navigation })

  const { getTextFieldProps, handleSubmit, dirty, isValid } = useActivateBotForm({
    onSubmit: ({ key, secret }) => {
      if (!riskLevel) {
        return showToast({
          type: ToastType.error,
          title: t("profile.apiKeys.chooseRiskLevel"),
        })
      }

      activateBotApi(
        {
          key,
          secret,
          risk_level: riskLevel as string,
          user_id: userId,
          email_address: userTradingEmail as string,
        },
        {
          onSuccess: (data) => {
            console.log("===save success===", data)
            storage.set(StorageKey.BOT_KEY, key)
            storage.set(StorageKey.BOT_SECRET, secret)
            storage.set(StorageKey.RISK_LEVEL, riskLevel)
            setHasApiKeys(true)
          },
          onError: () =>
            showToast({
              type: ToastType.error,
              title: "Error activating bot",
            }),
        },
      )
    },
  })

  const goToSignUp = () => {
    navigation.navigate(Routes.auth.navigator, {
      screen: Routes.auth.create_account,
    })
  }

  const goToLogin = (selectedPlan?: Plan) => {
    setSelectedPlan(isNil(selectedPlan) ? null : selectedPlan)
    navigation.navigate(Routes.auth.navigator, {
      screen: Routes.auth.login,
    })
  }

  // const goToPlans = (selectedPlan?: Plan) => {
  //   navigation.navigate(Routes.auth.navigator, {
  //     screen: Routes.auth.plans,
  //     params: { desiredPlan: selectedPlan, step: 1 },
  //   })
  // }
  const goToStartTrading = () => {
    navigation.navigate(Routes.main.trading.navigator, {
      screen: Routes.main.trading.tradingDetails,
    })
  }

  const activateBot = () => {
    storage.set(StorageKey.BOT_ACTIVATED, "true")
    setReadyToActivate(false)
    setBotActivated(true)
    showToast({
      type: ToastType.success,
      title: "Success",
      description: t("home.botActivated"),
    })
  }
  const handleBotStop = async () => {
    stopBot({
      user_id: userId,
      key: (await storage.get(StorageKey.BOT_KEY)) as string,
      secret: (await storage.get(StorageKey.BOT_SECRET)) as string,
    })
  }
  const handleBotStart = async () => {
    storage.set(StorageKey.BOT_RUNNING, "true")
    setBotRunning(true)
  }

  const viewStyle = {
    backgroundColor: isDarkMode ? colors.black : "#ffff",
    paddingBottom: bottom + space[6],
    marginTop: space[6],
  }

  const profitSummary = {
    last24hours: 1.45,
    last7days: -3.33,
    lastMonth: 6.32,
  }

  // console.log("==Payment Data===", paymentData)
  // console.log("==Status===", activateStatus)
  // console.log("===has api keys===", hasApiKeys)
  // console.log("===Activate Date===", activateData)
  // console.log("===stop Date===", stopData)

  return (
    <RootView style={styles.container}>
      <ScrollView
        style={{
          paddingHorizontal: space[6],
          paddingTop: top + space[6],
          paddingBottom: bottom + space[6],
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Typography color="primary.600" size="h3" style={styles.title}>
            {t("home.greetings")}
          </Typography>

          <Typography style={styles.description}>{t("home.description")}</Typography>

          {/* {!isLoggedIn && ( */}
          <View>
            <Typography color="primary.600" size="h3" style={styles.profits}>
              {t("home.profits")}
            </Typography>
            <Typography style={styles.profitDescription}>{t("home.profit-description")}</Typography>
            <ProfitsList profitSummary={profitSummary} />
          </View>
          {/* )} */}
        </View>
        <View style={viewStyle}>
          {!isLoggedIn && (
            <Stack space="md">
              <Button onPress={goToSignUp}>{t("createAccount.title")}</Button>
              <Button onPress={() => goToLogin()}>{t("login.title")}</Button>
            </Stack>
          )}

          {/* {!isNil(user) && isLoggedIn && (
          <View style={styles.planName}>
            <Typography color="primary.800">{t("plans.selectSubscription.yourPlanIs")}</Typography>
            <Typography color="primary.800" size="headline" weight="bold" ml="1">
              {!isNil(user.UserPlan)
                ? t(`plans.selectPlan.${PlanTranslationsTypes[user.UserPlan.Plan.name]}`)
                : t(`plans.selectPlan.${PlanTranslationsTypes[PlanTypes.FREE]}`)}
            </Typography>
          </View>
        )} */}
          {isLoggedIn && (
            <>
              {activateStatus?.message?.includes("the bot first") && !paymentProcessing && (
                <>
                  <PlansSelector plans={plansToShow as Plan[]} goToPlans={() => null} />
                  <Button onPress={() => goToStartTrading()} isLoading={fetchStatus === "fetching"}>
                    {t("home.startEarn")}
                  </Button>
                </>
              )}
              {fetchStatus === "fetching" && (
                <View style={{ flex: 1, flexDirection: "row", gap: 2, paddingVertical: 10 }}>
                  <Spinner />
                  <Typography color="primary.400">{t("home.checkingAccount")}</Typography>
                </View>
              )}
              {fetchStatus !== "fetching" && paymentProcessing && (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    gap: 2,
                    paddingVertical: 10,
                    alignItems: "center",
                  }}
                >
                  <View style={{ marginRight: 5 }}>
                    <Spinner />
                  </View>
                  <Typography color="primary.400">{t("home.receivingPayment")}</Typography>
                </View>
              )}
              {fetchStatus !== "fetching" && lessPayment && (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    gap: 2,
                    paddingVertical: 10,
                    alignItems: "center",
                  }}
                >
                  <WarningIcon size={5} color={accentColors.red.dark} style={{ marginRight: 5 }} />
                  <Typography color={accentColors.red.dark}>{lessPayment}</Typography>
                </View>
              )}
              {activateStatus?.message?.includes("the state of the bot is: deactivate") &&
                !botActivated &&
                !botRunning &&
                !hasApiKeys && <Button onPress={activateBot}>{t("home.activateBot")}</Button>}

              {botActivated &&
                activateStatus?.message?.includes("the state of the bot is: deactivate") &&
                !hasApiKeys && (
                  <View style={{ marginVertical: 10 }}>
                    <Typography color="primary.400" size="h3" style={styles.title}>
                      Bybit Keys
                    </Typography>
                    <TextInput
                      label={t("profile.apiKeys.form.apiKey.label")}
                      placeholder={t("profile.apiKeys.form.apiKey.placeholder")}
                      {...getTextFieldProps("key")}
                    />

                    <TextInput
                      label={t("profile.apiKeys.form.secretKey.label")}
                      placeholder={t("profile.apiKeys.form.secretKey.placeholder")}
                      {...getTextFieldProps("secret")}
                    />
                    <Select
                      custom
                      label={t("profile.apiKeys.chooseRiskLevel")}
                      bottomLabel={t("profile.apiKeys.changeRiskLevel")}
                      cta={t("profile.apiKeys.chooseRiskLevel")}
                      value={riskLevel}
                      options={riskLevelsList}
                      onChange={handleChangeRiskLevel}
                    />
                    <Button
                      onPress={() => handleSubmit()}
                      isLoading={isActivateLoading}
                      disabled={isActivateLoading}
                    >
                      Save
                    </Button>
                  </View>
                )}
              {(activateStatus?.message?.includes("the state of the bot is: deactivate") ||
                stopData?.message?.includes("bot stopped")) &&
                hasApiKeys &&
                !botRunning && (
                  <Button
                    bgColor={"primary.600"}
                    onPress={handleBotStart}
                    style={{ marginVertical: 10 }}
                  >
                    {t("home.startBot")}
                  </Button>
                )}
              {(activateStatus?.message?.includes("the state of the bot is: activate") ||
                botRunning) && (
                <Button bgColor={"red.500"} onPress={handleBotStop} style={{ marginVertical: 10 }}>
                  {t("home.stopBot")}
                </Button>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </RootView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 5,
  },
  description: {
    marginBottom: 10,
  },
  profits: {
    marginBottom: 5,
  },
  profitDescription: {
    marginBottom: 5,
  },
  planName: {
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "baseline",
  },
})
