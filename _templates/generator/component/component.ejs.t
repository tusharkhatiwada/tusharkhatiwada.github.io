---
to: "<%= files.includes('styles') ? null : `src/${path}/${h.changeCase.pascal(name)}/${h.changeCase.pascal(name)}.tsx` %>"
---
import { StyleSheet, View } from "react-native"

import { FC } from "react"
import { Typography } from "components/Typography"

export type <%= h.changeCase.pascal(name) %>Props = {}

export const <%= h.changeCase.pascal(name) %>: FC<<%= h.changeCase.pascal(name) %>Props> = (_props) => {
  return (
    <View>
      <Typography size="h3"><%= h.changeCase.pascal(name) %></Typography>
      <Typography>This is the <%= h.changeCase.pascal(name) %> component!</Typography>
    </View>
  )
}
