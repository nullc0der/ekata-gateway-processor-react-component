import * as React from "react";
import {
    FormConfigData,
    GatewayProcessorFormLoader,
} from "./gatewayprocessorformloader";

export interface GatewayProcessorFormProps extends FormConfigData {
    formID?: string;
}

interface GatewayProcessorFormState {
    formConfig: {
        isTestnet: boolean;
        projectID: string;
        onError: (payload: any) => void;
        onSuccess: (payload: any) => void;
        onCloseForm: (payload: any) => void;
    };
}

class GatewayProcessorForm extends React.Component<
    GatewayProcessorFormProps,
    GatewayProcessorFormState
> {
    gpForm: GatewayProcessorFormLoader;
    state: GatewayProcessorFormState = {
        formConfig: {
            isTestnet: this.props.isTestnet || false,
            projectID: this.props.projectID,
            onError: (data) => this.props.onError(data),
            onCloseForm: (reason) => this.props.onCloseForm(reason),
            onSuccess: (data) => this.props.onSuccess(data),
        },
    };

    componentDidMount() {
        this.gpForm = new GatewayProcessorFormLoader(this.state.formConfig);
    }

    componentDidUpdate(prevProps: GatewayProcessorFormProps) {
        if (
            prevProps.formID !== this.props.formID &&
            this.props.formID?.length
        ) {
            this.gpForm.showPaymentForm(this.props.formID);
        }
    }

    render() {
        return null;
    }
}

export default GatewayProcessorForm;
