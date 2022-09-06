import * as y from "yup"

import { UseFormProps, useForm } from "hooks/useForm"

import { NetworkList } from "models/Networks"
import { useTranslation } from "react-i18next"

type WithdrawalRequestValues = {
  network: string
  walletAddress: string
  amount: string
}

const networks = NetworkList.map((network) => ({ value: network.type, label: network.name }))

const DEFAULT_VALUES: WithdrawalRequestValues = {
  network: networks[0].value,
  walletAddress: "",
  amount: "",
}

type FormProps = UseFormProps<WithdrawalRequestValues>

export interface WithdrawalRequestProps {
  onSubmit: FormProps["onSubmit"]
  defaultValues?: WithdrawalRequestValues
}

export const useWithdrawalRequestForm = ({
  onSubmit,
  defaultValues = DEFAULT_VALUES,
}: WithdrawalRequestProps) => {
  const patternTwoDigisAfterComma = /^(\d+(?:[.,]\d{2})?)$/
  const { t } = useTranslation()

  return useForm({
    defaultValues,
    onSubmit,
    schema: y.object().shape({
      network: y.string().required(),
      walletAddress: y.string().required(),
      amount: y
        .string()
        .test("is-decimal", t("common.numberInput.2decimals"), (val) => {
          if (val != undefined) {
            return patternTwoDigisAfterComma.test(val)
          }
          return true
        })
        .required(),
    }),
  })
}
