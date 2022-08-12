import "@testing-library/jest-native/extend-expect"

import { FC, ReactElement } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ApiContext } from "context/ApiContext"
import { NativeBaseProvider } from "native-base"
import { NavigationContainer } from "@react-navigation/native"
import { createApiFake } from "api/createApiFake"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createTheme } from "styles/theme"
import { render as rtlRender } from "@testing-library/react-native"

const Stack = createNativeStackNavigator()

type customRenderOptions = {
  routeParams?: never
  darkMode?: boolean
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
      retry: false,
    },
  },
})

const api = createApiFake()

const nativeBaseInsets = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
}

export const customRender = async (
  component: ReactElement<unknown>,
  { routeParams, darkMode = false, ...renderOptions }: customRenderOptions = {},
) => {
  const theme = createTheme(darkMode ? "dark" : "light")

  const Wrapper: FC = ({ children }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <ApiContext.Provider value={api}>
          <NativeBaseProvider initialWindowMetrics={nativeBaseInsets} theme={theme}>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen name="MockedScreen" initialParams={routeParams}>
                  {() => children}
                </Stack.Screen>
              </Stack.Navigator>
            </NavigationContainer>
          </NativeBaseProvider>
        </ApiContext.Provider>
      </QueryClientProvider>
    )
  }

  return rtlRender(component, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from "@testing-library/react-native"
// override render method
export { customRender as render, api }
