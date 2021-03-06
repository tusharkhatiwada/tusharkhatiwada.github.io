import { FC, useEffect, useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { Spinner, useTheme } from "native-base"
import { StorageKey, createSecureStorage } from "services/SecureStorage"
import * as Linking from "expo-linking"

import { Icon } from "components/Icon"
import { ProfileStackScreenProps } from "models/Navigation"
import { RootView } from "components/RootView"
import { Routes } from "models/Routes"
import { Select } from "components/Select"
import { Typography } from "components/Typography"
import { changeLanguage } from "i18next"
import { languagesList } from "models/Languages"
import { useAuthContext } from "context/AuthContext"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTranslation } from "react-i18next"

export type ProfileProps = ProfileStackScreenProps<typeof Routes.main.profile.userProfile>

export const Profile: FC<ProfileProps> = ({ navigation }) => {
  const { t } = useTranslation()

  const storage = createSecureStorage()

  const [language, setLanguage] = useState<string | undefined>()
  const [email, setEmail] = useState<string | undefined>()

  const { colors, space } = useTheme()
  const { top } = useSafeAreaInsets()

  const { user } = useAuthContext()

  const handleChangeLanguage = (language: string) => {
    changeLanguage(language)
    setLanguage(language)
    storage.set(StorageKey.LANGUAGE, language)
  }

  const goToSupport = async () => {
    navigation.navigate(Routes.main.profile.support)
  }

  const goToChangePassword = async () => {
    navigation.navigate(Routes.main.profile.changePassword)
  }

  const goToLogout = async () => {
    navigation.navigate(Routes.main.profile.logout)
  }

  const goToApiKeys = async () => {
    navigation.navigate(Routes.main.profile.apiKeys)
  }

  useEffect(() => {
    const getCurrentLanguage = async () => {
      const language = await storage.get(StorageKey.LANGUAGE)
      const email = await storage.get(StorageKey.USER_EMAIL)
      language && setLanguage(language)
      email && setEmail(email)
    }

    getCurrentLanguage()
  }, [])

  // if (!user) {
  //   return (
  //     <View style={[styles.container, styles.alignCenter]}>
  //       <Spinner />
  //     </View>
  //   )
  // }

  return (
    <RootView style={[styles.container, { paddingTop: top + space[6] }]}>
      <View>
        <View style={styles.paddingHorizontal}>
          <Typography size="h3" style={styles.button}>
            {t("profile.title")}
          </Typography>

          {user?.email && (
            <Typography size="headline" weight="semibold">
              {email}
            </Typography>
          )}

          <Typography color="primary.400" style={styles.button}>
            {email}
          </Typography>
        </View>

        <View style={[styles.separator, { borderColor: colors.primary[200] }]} />

        <View style={styles.paddingHorizontal}>
          <Select
            custom
            label={t("profile.chooseLanguage")}
            bottomLabel={t("profile.chooseLanguage")}
            cta={t("profile.changeLanguage")}
            value={language}
            options={languagesList}
            onChange={handleChangeLanguage}
          />
        </View>
      </View>

      <View>
        {/*<Pressable onPress={goToSupport} style={styles.link}>*/}
        {/*  <View style={styles.flexRow}>*/}
        {/*    <Icon name="mobile-alt" color={colors.primary[400]} style={styles.icon} />*/}
        {/*    <Typography weight="semibold">{t("profile.support.title")}</Typography>*/}
        {/*  </View>*/}
        {/*  <Icon name="chevron-right" size="md" />*/}
        {/*</Pressable>*/}

        <Pressable onPress={goToApiKeys} style={styles.link}>
          <View style={styles.flexRow}>
            <Icon name="lock" color={colors.primary[400]} style={styles.icon} />
            <Typography weight="semibold">{t("profile.apiKeys.title")}</Typography>
          </View>
          <Icon name="chevron-right" size="md" />
        </Pressable>

        <Pressable
          onPress={() => Linking.openURL("whatsapp://send?phone=+34678372017")}
          style={styles.link}
        >
          <View style={styles.flexRow}>
            <Icon name="mobile-alt" color={colors.primary[400]} style={styles.icon} />
            <Typography weight="semibold">{t("profile.support.title")}</Typography>
          </View>
          <Icon name="chevron-right" size="md" />
        </Pressable>

        <Pressable onPress={goToChangePassword} style={styles.link}>
          <View style={styles.flexRow}>
            <Icon name="lock" color={colors.primary[400]} style={styles.icon} />
            <Typography weight="semibold">{t("profile.changePassword.title")}</Typography>
          </View>
          <Icon name="chevron-right" size="md" />
        </Pressable>

        {/*<Pressable onPress={goToPlans} style={styles.link}>*/}
        {/*  <View style={styles.flexRow}>*/}
        {/*    <Icon name="coins" color={colors.primary[400]} style={styles.icon} />*/}
        {/*    <Typography weight="semibold">*/}
        {/*      {t("plans.selectSubscription.yourPlanIs", {*/}
        {/*        plan:*/}
        {/*          !isNil(userV2) && !isNil(userV2.UserPlan.Plan)*/}
        {/*            ? t(`plans.selectPlan.${PlanTranslationsTypes[userV2.UserPlan.Plan.name]}`)*/}
        {/*            : t(`plans.selectPlan.${PlanTranslationsTypes[PlanTypes.FREE]}`),*/}
        {/*      })}*/}
        {/*    </Typography>*/}
        {/*  </View>*/}
        {/*  <Icon name="chevron-right" size="md" />*/}
        {/*</Pressable>*/}

        <Pressable
          onPress={goToLogout}
          style={[styles.link, styles.logout, { borderColor: colors.primary[200] }]}
        >
          <View style={styles.flexRow}>
            <Icon name="sign-out-alt" color={colors.primary[400]} style={styles.icon} />
            <Typography weight="semibold">{t("profile.logout.title")}</Typography>
          </View>
          <Icon name="chevron-right" size="md" />
        </Pressable>
      </View>
    </RootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  separator: {
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  button: {
    marginBottom: 24,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
  },
  logout: {
    borderTopWidth: 1,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  paddingHorizontal: {
    paddingHorizontal: 24,
  },
  alignCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
})
