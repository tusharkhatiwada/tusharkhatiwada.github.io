import { StyleSheet, TouchableOpacity, View } from "react-native"

import { FC } from "react"
import { FontAwesome5 } from "@expo/vector-icons"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ParamListBase } from "@react-navigation/native"
import { RootView } from "components/RootView"
import { Typography } from "components/Typography"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export type HeaderProps = {
  navigation: NativeStackNavigationProp<ParamListBase>
  title: string
}

export const Header: FC<HeaderProps> = ({ navigation, title }) => {
  const { top } = useSafeAreaInsets()

  const handleGoBack = () => {
    navigation.goBack()
  }

  return (
    <RootView style={[styles.container, { paddingTop: top + 24 }]}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="go back"
        onPress={handleGoBack}
        style={styles.backButton}
      >
        <FontAwesome5 size={12} name="chevron-left" />
      </TouchableOpacity>

      <Typography fontWeight={500}>{title}</Typography>

      <View style={styles.backButton} />
    </RootView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
})