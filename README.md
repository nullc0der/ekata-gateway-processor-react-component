# Ekata Gateway Processor form component for React

### Install using

```bash
  npm i @ekataio/gateway-processor-form-react
```

### How to integrate

-   Create a project in [Client Console](https://gpconsole.ekata.io) and copy project id, api key and payment signature secret, the project must be active to integrate in form. Check [Create Project](https://gpdocs.ekata.io/console/project/) doc for more info.
-   Import `GatewayProcessorForm` in your react component.
    ```js
    import GatewayProcessorForm from '@ekataio/gateway-processor-form-react'
    ```
-   Add function to handle `onError`, `onCloseForm`, `onSuccess` event.

    ```js
    const onPaymentFormError = (payload: any) => {
        // process error event, for example show some error message to user
        console.log(payload)
    }

    const onClosePaymentForm = (reason: string) => {
        console.log(reason)
    }

    const onSuccessPayment = (payload: any) => {
        // send payload to backend here and verify in backend, once verified show success message
        // to user
        console.log(payload)
    }
    ```

-   Add payment or checkout button on your site once user clicks on the button call your backend to generate formID after you get the formID, update it in state so that form component can use it, the form will show once it sees a formID, for more details visit [Docs](https://gpdocs.ekata.io/integration/integration-in-react-site/)

    ```js
    const [formID, setFormID] = useState('')

    const onClickCheckout = () => {
        //call your backend then set the formID
        setFormID(formID)
    }
    ```

-   Include the form in your component
    ```js
    <GatewayProcessorForm
        formID={formID}
        projectID={
            process.env.REACT_APP_EKATA_GATEWAY_PROCESSOR_PROJECT_ID || ''
        }
        onError={onPaymentFormError}
        onCloseForm={onClosePaymentForm}
        onSuccess={onSuccessPayment}
    />
    ```
