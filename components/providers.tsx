import React, { Provider, ReactElement } from "react";

type ProviderData = ReactElement<any, Provider<any>>;
interface ProvidersProps {
    providers: ProviderData[];
    element: React.ReactNode;
}

export default function Providers({ providers, element }: ProvidersProps) {
    let result = element;
    providers.forEach(v => {
        result = React.createElement(
            v.type,
            {
                value: v.props.value,
            },
            result
        );
    });
    return (<>{result}</>);
}