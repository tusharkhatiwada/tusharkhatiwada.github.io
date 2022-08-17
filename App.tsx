import "./src/config/i18n"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ApiProvider } from "context/ApiContext"
import { AuthProvider } from "context/AuthContext"
import { NativeBaseProvider } from "native-base"
import Navigation from "./src/navigation/NavigationContainer"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { createTheme } from "styles/theme"
import useCachedResources from "./src/hooks/useCachedResources"
import useColorScheme from "./src/hooks/useColorScheme"

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  })

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          <AuthProvider>
            <SafeAreaProvider>
              <NativeBaseProvider theme={createTheme(colorScheme)}>
                <Navigation colorScheme={colorScheme} />
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
              </NativeBaseProvider>
            </SafeAreaProvider>
          </AuthProvider>
        </ApiProvider>
      </QueryClientProvider>
    )
  }
}
