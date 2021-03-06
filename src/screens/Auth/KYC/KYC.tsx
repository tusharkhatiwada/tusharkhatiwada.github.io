import * as DocumentPicker from "expo-document-picker"

import { DeviceEventEmitter, StyleSheet, TouchableOpacity, View } from "react-native"
import { FC, useEffect } from "react"

import { AuthStackScreenProps } from "models/Navigation"
import { Button } from "components/Button"
import { CameraCapturedPicture } from "expo-camera"
import { CommonActions } from "@react-navigation/native"
import { Events } from "models/Events"
import { Icon } from "components/Icon"
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view"
import { RootView } from "components/RootView"
import { Routes } from "models/Routes"
import { Select } from "components/Select"
import { TextInput } from "components/TextInput"
import { ToastType } from "components/Toast/Toast"
import { Typography } from "components/Typography"
import { useKYC } from "hooks/auth/useKYC"
import { useKYCForm } from "hooks/auth/useKYCForm"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTheme } from "native-base"
import { useToastContext } from "context/ToastContext"
import { useTranslation } from "react-i18next"
import { useWithdrawalRequest } from "hooks/wallet/useWithdrawalRequest"

export type KYCProps = AuthStackScreenProps<typeof Routes.auth.kyc>

export const KYC: FC<KYCProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const { colors } = useTheme()

  const withdrawalRequestParams = route.params

  const { kyc } = useKYC()
  const { withdrawalRequest, isLoading } = useWithdrawalRequest()
  const { showToast } = useToastContext()

  const { getTextFieldProps, getFieldProps, setValue, values, handleSubmit, dirty, isValid } =
    useKYCForm({
      onSubmit: (values) => {
        kyc(values, {
          onSuccess: () => {
            withdrawalRequest(withdrawalRequestParams, {
              onSuccess: () => {
                showToast({
                  type: ToastType.success,
                  title: "Success",
                  description: t("wallet.withdraw.success"),
                })
                navigation.dispatch(
                  CommonActions.reset({ index: 0, routes: [{ name: Routes.main.navigator }] }),
                )
              },
            })
          },
        })
      },
    })

  const goToDocumentPhoto = () => {
    navigation.navigate(Routes.auth.document_photo)
  }

  const openFilePicker = async () => {
    const file = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
      multiple: false,
    })

    if (file.type === "success") {
      setValue("invoice", file)
    }
  }

  const getBackgroundColors = (isSuccess: boolean) => {
    return {
      borderColor: colors.primary[300],
      backgroundColor: isSuccess ? colors.secondary[100] : colors.primary[100],
    }
  }

  useEffect(() => {
    const event = DeviceEventEmitter.addListener(
      Events.CameraCapture,
      (photo: CameraCapturedPicture) => {
        setValue("documentPhoto", photo)
      },
    )

    return () => event.remove()
  }, [values.documentPhoto])

  return (
    <RootView style={[styles.container, { paddingBottom: bottom + 24 }]}>
      <KeyboardAwareScrollView enableOnAndroid>
        <Typography color="primary.400" style={styles.disclaimer}>
          {t("wallet.kyc.description")}
        </Typography>

        <TextInput
          label={t("wallet.kyc.form.name.label")}
          placeholder={t("wallet.kyc.form.name.placeholder")}
          // @ts-ignore
          {...getTextFieldProps("name")}
        />

        <Select
          custom
          label={t("wallet.kyc.form.documentType.label")}
          placeholder={t("wallet.kyc.form.documentType.placeholder")}
          options={[{ label: "National Document", value: "nationalDocument" }]}
          bottomLabel={t("wallet.kyc.form.documentType.bottomLabel")}
          cta={t("wallet.kyc.form.documentType.cta")}
          {...getFieldProps("documentType")}
          onChange={(value) => setValue("documentType", value)}
        />

        <TextInput
          label={t("wallet.kyc.form.documentNumber.label")}
          placeholder={t("wallet.kyc.form.documentNumber.placeholder")}
          {...getTextFieldProps("documentNumber")}
        />

        <Typography size="small" style={styles.title}>
          {t("wallet.kyc.form.documentPhoto.title")}
        </Typography>
        <Typography size="mini" color="primary.400" style={styles.description}>
          {t("wallet.kyc.form.documentPhoto.description")}
        </Typography>

        <TouchableOpacity accessibilityRole="button" onPress={goToDocumentPhoto}>
          <View style={[styles.box, getBackgroundColors(Boolean(values.documentPhoto))]}>
            {values.documentPhoto ? (
              <>
                <Icon name="check-circle" />
                <Typography style={styles.title}>
                  {t("wallet.kyc.form.documentPhoto.success")}
                </Typography>
                <Typography weight="semibold">
                  {t("wallet.kyc.form.documentPhoto.replace")}
                </Typography>
              </>
            ) : (
              <>
                <Icon name="camera" />
                <Typography>{t("wallet.kyc.form.documentPhoto.cta")}</Typography>
              </>
            )}
          </View>
        </TouchableOpacity>

        <TextInput
          label={t("wallet.kyc.form.address.label")}
          placeholder={t("wallet.kyc.form.address.placeholder")}
          {...getTextFieldProps("address")}
        />

        <Typography size="small" style={styles.title}>
          {t("wallet.kyc.form.invoice.title")}
        </Typography>
        <Typography size="mini" color="primary.400" style={styles.description}>
          {t("wallet.kyc.form.invoice.description")}
        </Typography>

        <TouchableOpacity accessibilityRole="button" onPress={openFilePicker}>
          <View style={[styles.box, getBackgroundColors(Boolean(values.invoice))]}>
            {values.invoice ? (
              <>
                <Icon name="check-circle" />
                <Typography style={styles.title}>{t("wallet.kyc.form.invoice.success")}</Typography>
                <Typography size="mini" align="center" numberOfLines={2} style={styles.description}>
                  {values.invoice.name}
                </Typography>
                <Typography weight="semibold">{t("wallet.kyc.form.invoice.replace")}</Typography>
              </>
            ) : (
              <>
                <Icon name="file-upload" />
                <Typography>{t("wallet.kyc.form.invoice.cta")}</Typography>
              </>
            )}
          </View>
        </TouchableOpacity>

        <Button
          isLoading={isLoading}
          onPress={() => handleSubmit()}
          isDisabled={!dirty || !isValid}
        >
          {t("wallet.kyc.form.cta")}
        </Button>
      </KeyboardAwareScrollView>
    </RootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  disclaimer: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  box: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    textAlign: "center",
  },
})
