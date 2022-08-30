import { Button, useTheme } from "native-base"
import { StyleSheet, View } from "react-native"

import { FC } from "react"
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view"
import { ProfileStackScreenProps } from "models/Navigation"
import { RootView } from "components/RootView"
import { Routes } from "models/Routes"
import { TextInput } from "components/TextInput"
import { ToastType } from "components/Toast/Toast"
import { useChangePassword } from "hooks/profile/useChangePassword"
import { useChangePasswordForm } from "hooks/profile/useChangePasswordForm"
import { useToastContext } from "context/ToastContext"
import { useTranslation } from "react-i18next"

export type ChangePasswordProps = ProfileStackScreenProps<typeof Routes.main.profile.support>

export const ChangePassword: FC<ChangePasswordProps> = ({ navigation }) => {
  const { t } = useTranslation()
  const { showToast } = useToastContext()

  const { space } = useTheme()

  const { changePassword } = useChangePassword()
  const { getTextFieldProps, handleSubmit, dirty, isValid } = useChangePasswordForm({
    onSubmit: ({ oldPassword, newPassword }) => {
      changePassword(
        { oldPassword, newPassword },
        {
          onSuccess: () => {
            showToast({
              type: ToastType.success,
              title: "Success",
              description: t("profile.changePassword.form.success"),
            })
            navigation.goBack()
          },
          onError: (err) =>
            showToast({
              type: ToastType.error,
              title: t("profile.changePassword.form.error"),
              description: err.message,
            }),
        },
      )
    },
  })

  return (
    <RootView style={[styles.container, { padding: space[6] }]}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View>
          <TextInput
            type="password"
            autoCapitalize="none"
            autoComplete="off"
            label={t("profile.changePassword.form.oldPassword.label")}
            placeholder={t("profile.changePassword.form.oldPassword.placeholder")}
            {...getTextFieldProps("oldPassword")}
          />

          <TextInput
            type="password"
            autoCapitalize="none"
            autoComplete="off"
            label={t("profile.changePassword.form.newPassword.label")}
            placeholder={t("profile.changePassword.form.newPassword.placeholder")}
            {...getTextFieldProps("newPassword")}
          />

          <TextInput
            type="password"
            autoCapitalize="none"
            autoComplete="off"
            label={t("profile.changePassword.form.repeatPassword.label")}
            placeholder={t("profile.changePassword.form.repeatPassword.placeholder")}
            {...getTextFieldProps("repeatPassword")}
          />
        </View>

        <Button isDisabled={!isValid || !dirty} onPress={() => handleSubmit()}>
          {t("profile.changePassword.form.submit")}
        </Button>
      </KeyboardAwareScrollView>
    </RootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
})
