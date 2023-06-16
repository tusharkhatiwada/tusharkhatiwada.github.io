import { useQuery } from "@tanstack/react-query"
import { StartTrade } from "api/domain/trade"

import { AxiosError } from "axios"
import { useApi } from "context/ApiContext"

export const useStartTrade = (params: StartTrade.Params) => {
  const { trade } = useApi()

  console.log("===Params===", params, !!params.startTrading)

  const request = useQuery<StartTrade.Response, AxiosError>(
    ["startTrade", params.email_address, params.startTrading],
    () => trade.startTrade(params),
    {
      enabled: !!params.startTrading,
      refetchInterval: (data) => {
        if (data?.message?.includes("processing")) {
          return 300000 // 5 minutes polling if the payment is processing
        }
        return false
      },
      retry: false,
    },
  )

  return {
    ...request,
    payment: request.data,
  }
}