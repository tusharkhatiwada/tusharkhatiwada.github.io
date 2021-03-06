import { Dispatch, FC, SetStateAction } from "react"
import { PlanTypes, PlanTranslationsTypes, Plan } from "models/Plans"
import { Image, Pressable, StyleSheet, View } from "react-native"
import { Trans, useTranslation } from "react-i18next"

import { Icon } from "components/Icon"
import { RootView } from "components/RootView"
import { Typography } from "components/Typography"
import { accentColors } from "styles/colors"
import useColorScheme from "hooks/useColorScheme"
import { useTheme } from "native-base"

export type PlanCardProps = {
  selectPlan: Dispatch<SetStateAction<Plan>>
  selected?: boolean
  plan: Plan
}

const typeToAccentColor: { [key: string]: "green" | "blue" | "yellow" } = {
  [PlanTypes.FREE]: "green",
  [PlanTypes.BASIC]: "green",
  [PlanTypes.PREMIUM]: "blue",
  [PlanTypes.VIP]: "yellow",
}

export const PlanCard: FC<PlanCardProps> = ({ plan, selectPlan, selected }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()

  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === "dark"

  const handlePress = () => {
    selectPlan(plan)
  }

  const accentColor = accentColors[typeToAccentColor[plan.name]]

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={t(`plans.selectPlan.${PlanTranslationsTypes[plan.name]}`)}
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
        <View style={styles.topRow}>
          <View style={styles.rowCenter}>
            {/*<View style={[styles.iconCircle, { backgroundColor: accentColor.dark }]}>*/}
            {/*  <Icon size="md" color="white" name="coins" />*/}
            {/*</View>*/}

            <View style={[styles.iconCircle, { backgroundColor: accentColor.dark }]}>
              {plan.name === PlanTypes.FREE || plan.name === PlanTypes.BASIC ? (
                <Image
                  style={styles.coinImage}
                  source={require("../../../../../assets/images/coin.png")}
                />
              ) : (
                <Icon size="md" color="white" name="coins" />
              )}
            </View>
            <Typography
              size="headline"
              weight="bold"
              color={selected && isDarkMode ? "black" : undefined}
            >
              {t(`plans.selectPlan.${PlanTranslationsTypes[plan.name]}`)}
            </Typography>
          </View>

          <View style={[styles.radio, !selected && { borderColor: colors.primary[300] }]}>
            {selected && <View style={styles.circle} />}
          </View>
        </View>

        <View style={styles.bottomRow}>
          <Typography size="h3" color={selected && isDarkMode ? "black" : undefined}>
            <Trans
              i18nKey={"plans.selectPlan.fee"}
              values={{ fee: plan.percent }}
              components={{
                small: <Typography color="primary.500" style={styles.fee} />,
              }}
            />
          </Typography>
          <Typography
            size="headline"
            weight="bold"
            color={selected && isDarkMode ? "black" : undefined}
          >
            <Trans
              i18nKey={"plans.selectPlan.price"}
              values={{ price: plan.price }}
              components={{
                small: <Typography weight="semibold" style={styles.fee} />,
              }}
            />
          </Typography>
        </View>
      </RootView>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 17,
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

  coinImage: {
    width: 16,
    height: 11,
  },

  selected: {
    shadowOpacity: 0.3,
  },
  topRow: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconCircle: {
    width: 42,
    height: 32,
    marginRight: 12,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  // eslint-disable-next-line react-native/no-color-literals
  radio: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
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
  fee: {
    lineHeight: 36,
  },
})
