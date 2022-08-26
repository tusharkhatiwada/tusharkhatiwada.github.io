import { Dispatch, FC, SetStateAction } from "react"
import { PlanTypes, Plans } from "models/Plans"
import { Pressable, StyleSheet, View } from "react-native"
import { Trans, useTranslation } from "react-i18next"

import { Icon } from "components/Icon"
import { RootView } from "components/RootView"
import { Typography } from "components/Typography"
import { accentColors } from "styles/colors"
import useColorScheme from "hooks/useColorScheme"
import { useTheme } from "native-base"

export type PlanCardProps = {
  type: PlanTypes
  selectPlan: Dispatch<SetStateAction<PlanTypes>>
  selected?: boolean
}

const typeToAccentColor: { [key: string]: "green" | "blue" | "yellow" } = {
  [PlanTypes.BASIC]: "green",
  [PlanTypes.PREMIUM]: "blue",
  [PlanTypes.VIP]: "yellow",
}

export const PlanCard: FC<PlanCardProps> = ({ type, selectPlan, selected }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()

  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === "dark"

  const handlePress = () => {
    selectPlan(type)
  }

  const accentColor = accentColors[typeToAccentColor[type]]

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={t(`plans.selectPlan.${type}`)}
      onPress={handlePress}
    >
      <RootView
        testID="plan-card"
        style={[
          styles.container,
          { borderBottomColor: accentColor.dark },
          selected && { ...styles.selected, backgroundColor: accentColor.light },
        ]}
      >
        <View style={[styles.topRow, styles.rowCenter]}>
          <View style={styles.rowCenter}>
            <View style={[styles.iconCircle, { backgroundColor: accentColor.dark }]}>
              <Icon size="md" color="white" name="coins" />
            </View>
            <Typography
              size="headline"
              weight="bold"
              color={selected && isDarkMode ? "black" : undefined}
            >
              {t(`plans.selectPlan.${type}`)}
            </Typography>
          </View>

          <View style={[styles.radio, !selected && { borderColor: colors.primary[300] }]}>
            {selected && <View style={styles.circle} />}
          </View>
        </View>

        <Typography size="h3" color={selected && isDarkMode ? "black" : undefined}>
          <Trans
            i18nKey={"plans.selectPlan.yield"}
            values={{ from: Plans[type].yield.from, to: Plans[type].yield.to }}
            components={{
              small: <Typography color="primary.500" style={styles.yield} />,
            }}
          />
        </Typography>
      </RootView>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 4,
    borderBottomWidth: 4,

    shadowColor: accentColors.black,

    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,

    elevation: 12,
  },
  selected: {
    shadowOpacity: 0.3,
  },
  topRow: {
    justifyContent: "space-between",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 32,
    height: 32,
    marginRight: 12,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  radio: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: accentColors.black,
  },
  yield: {
    lineHeight: 36,
  },
})
