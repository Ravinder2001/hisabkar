interface NREUM {
  info: {
    agentID: string;
    accountID: string;
    trustKey: string;
    licenseKey: string;
    applicationID: string;
    sa: number;
  };
  addPageAction: (action: string, attributes: object) => void;
  setCustomAttribute: (key: string, value: string) => void;
}

interface Window {
  NREUM: NREUM;
}
