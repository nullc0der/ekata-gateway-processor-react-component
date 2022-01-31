export interface FormConfigData {
  isTestnet: boolean;
  projectID: string;
  onCloseForm: (reason: string) => void;
  onError: (payload: any) => void;
  onSuccess: (payload: any) => void;
}

interface ConfigData extends FormConfigData {
  iframeID: string;
  formID: string;
  formURL: string;
}

export class GatewayProcessorFormLoader {
  config: ConfigData = {
    projectID: '',
    formID: '',
    onCloseForm: reason => {
      console.log(reason);
    },
    onError: payload => {
      console.log(payload);
    },
    onSuccess: payload => {
      console.log(payload);
    },
    iframeID:
      Math.random()
        .toString(36)
        .substring(2, 10) + '-ekata-gateway-processor-iframe',
    isTestnet: false,
    formURL: '',
  };

  constructor(configData: FormConfigData) {
    this.config.projectID = configData.projectID;
    this.config.onCloseForm = configData.onCloseForm;
    this.config.onError = configData.onError;
    this.config.onSuccess = configData.onSuccess;
    this.config.formURL = configData.isTestnet
      ? 'https://gatewayprocessorform.ekata.io'
      : 'https://gpform.ekata.io';
  }

  handleEvents = (e: MessageEvent) => {
    if (e.origin !== this.config.formURL) {
      return;
    }
    const paymentFormIFrame = document.getElementById(
      this.config.iframeID
    ) as HTMLIFrameElement;
    const paymentFormLoadingAnimation = document.getElementById(
      'gp-loading-anim'
    );
    if (paymentFormIFrame) {
      switch (e.data.type) {
        case 'GET_FORM_ID':
          paymentFormIFrame.contentWindow?.postMessage(
            {
              type: 'SET_FORM_ID',
              payload: {
                formID: this.config.formID,
              },
            },
            this.config.formURL
          );
          paymentFormIFrame.style.visibility = 'visible';
          paymentFormLoadingAnimation?.remove();
          break;
        case 'PROJECT_ERROR':
          typeof this.config.onError === 'function' &&
            this.config.onError(e.data.payload);
          paymentFormIFrame.style.visibility = 'visible';
          paymentFormLoadingAnimation?.remove();
          break;
        case 'USER_CANCEL':
          this.closePaymentForm('User Canceled');
          break;
        case 'PAYMENT_SUCCESS':
          typeof this.config.onSuccess === 'function' &&
            this.config.onSuccess(e.data.payload);
          this.closePaymentForm('Payment Success');
          break;
        default:
          console.log(e.data.payload);
          break;
      }
    }
  };

  showPaymentForm(formID: string) {
    this.config['formID'] = formID;
    const iFrameContainer = document.createElement('div');
    const loadingAnimation = document.createElement('img');
    const iFrame = document.createElement('iframe');
    Object.assign(iFrameContainer.style, {
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      zIndex: 9999,
    });
    iFrameContainer.setAttribute('id', 'ekata-gateway-processor-container');
    document.getElementsByTagName('body')[0].appendChild(iFrameContainer);
    loadingAnimation.setAttribute('id', 'gp-loading-anim');
    loadingAnimation.setAttribute(
      'src',
      'data:image/svg+xml;base64, PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCiAgdmlld0JveD0iMCAwIDEwMCAxMDAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDAgMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CiAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNNzMsNTBjMC0xMi43LTEwLjMtMjMtMjMtMjNTMjcsMzcuMywyNyw1MCBNMzAuOSw1MGMwLTEwLjUsOC41LTE5LjEsMTkuMS0xOS4xUzY5LjEsMzkuNSw2OS4xLDUwIj4KICAgICAgPGFuaW1hdGVUcmFuc2Zvcm0gCiAgICAgICAgIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgCiAgICAgICAgIGF0dHJpYnV0ZVR5cGU9IlhNTCIgCiAgICAgICAgIHR5cGU9InJvdGF0ZSIKICAgICAgICAgZHVyPSIxcyIgCiAgICAgICAgIGZyb209IjAgNTAgNTAiCiAgICAgICAgIHRvPSIzNjAgNTAgNTAiIAogICAgICAgICByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICA8L3BhdGg+Cjwvc3ZnPgo='
    );
    Object.assign(loadingAnimation.style, {
      width: '150px',
      height: '150px',
    });
    iFrame.setAttribute('id', this.config.iframeID);
    iFrame.setAttribute(
      'src',
      this.config.formURL + `?project-id=${this.config.projectID}`
    );
    Object.assign(iFrame.style, {
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      zIndex: 9999,
      border: 'none',
      visibility: 'hidden',
    });
    iFrameContainer.appendChild(loadingAnimation);
    iFrameContainer.appendChild(iFrame);
    window.addEventListener('message', this.handleEvents);
  }

  closePaymentForm(reason: string) {
    const iFrame = document.getElementById(
      this.config.iframeID
    ) as HTMLIFrameElement;
    const iFrameContainer = document.getElementById(
      'ekata-gateway-processor-container'
    ) as HTMLElement;
    iFrame.remove();
    iFrameContainer.remove();
    typeof this.config.onCloseForm === 'function' &&
      this.config.onCloseForm(reason);
    window.removeEventListener('message', this.handleEvents);
  }
}
