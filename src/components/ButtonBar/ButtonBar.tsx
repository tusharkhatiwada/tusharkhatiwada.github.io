import { Button, HStack, useTheme } from "native-base"
import { FC, useEffect, useState } from "react"
import { ScrollView, StyleSheet } from "react-native"

import { TranslationKeys } from "models/TranslationKeys"
import { Typography } from "components/Typography"
import { useTranslation } from "react-i18next"
import { TransactionRange } from "../../models/Wallet"
import { isNil } from "lodash"
import { accentColors } from "styles/colors"

export type ButtonBarElement = {
  label: TranslationKeys
  value: TransactionRange
}

export type ButtonBarProps = {
  buttons: ButtonBarElement[]
  onChange: (value: TransactionRange) => void
  defaultValue: TransactionRange
  value?: string
}

export const ButtonBar: FC<ButtonBarProps> = ({ buttons, onChange, value }) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<string>(buttons[0].value)
  const { colors } = useTheme()

  useEffect(() => {
    if (!isNil(value)) {
      setSelected(value)
    }
  }, [value])

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <HStack
        space="sm"
        flexDirection="row"
        justifyContent="space-between"
        style={styles.container}
      >
        {buttons.map((button) => (
          <Button
            key={button.label}
            style={[
              styles.button,
              {
                // TODO: Change selected color
                backgroundColor:
                  selected === button.value ? colors.primary[500] : colors.primary[100],
                borderColor: selected === button.value ? accentColors.gold : "transparent",
                borderWidth: selected === button.value ? 2 : 0,
              },
            ]}
            onPress={() => {
              onChange(button.value)
              setSelected(button.value)
            }}
          >
            <Typography color={colors.white}>{t(button.label as TranslationKeys)}</Typography>
          </Button>
        ))}
      </HStack>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: "scroll",
    marginBottom: 16,
  },
  button: {
    borderRadius: 24,
    paddingHorizontal: 8,
    minWidth: 60,
  },
})
